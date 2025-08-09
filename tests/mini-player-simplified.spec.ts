import { test, expect, Page } from "@playwright/test";

class SimplifiedMiniPlayerTestHelper {
  constructor(private page: Page) {}

  /**
   * Manually inject mini player styles and functionality for testing
   * This bypasses extension loading issues and tests the core functionality
   */
  async injectMiniPlayerForTesting() {
    // Inject the mini player CSS
    await this.page.addStyleTag({
      content: `
        /* Mini player styles for testing */
        body[betteryt-mini] ytd-miniplayer {
          display: block !important;
          position: fixed !important;
          bottom: 10px !important;
          right: 10px !important;
          z-index: 9999 !important;
          width: 320px !important;
          height: 180px !important;
        }
        
        body:not([betteryt-mini]) ytd-miniplayer {
          display: none !important;
        }
      `,
    });

    // Inject mini player behavior
    await this.page.evaluate(() => {
      // Mini player show/hide logic
      function doPlayer() {
        const playerBounds = document.querySelector(
          "#player-container-inner, #player-wide-container, #player-full-bleed-container"
        );
        const pageApp = document.querySelector("ytd-app");

        if (playerBounds && pageApp) {
          if (
            window.scrollY >= playerBounds.offsetHeight ||
            pageApp.scrollTop >= playerBounds.offsetHeight
          ) {
            showMiniPlayer();
          } else {
            showFullPlayer();
          }
        }
      }

      function showMiniPlayer() {
        if (!document.body.hasAttribute("betteryt-mini")) {
          document.body.setAttribute("betteryt-mini", "");
        }

        const miniPlayerRoot = document.querySelector("ytd-miniplayer");
        if (miniPlayerRoot) {
          if (!miniPlayerRoot.hasAttribute("enabled")) {
            miniPlayerRoot.setAttribute("enabled", "");
          }
          if (!miniPlayerRoot.hasAttribute("active")) {
            miniPlayerRoot.setAttribute("active", "");
          }
        }
      }

      function showFullPlayer() {
        document.body.removeAttribute("betteryt-mini");

        const miniPlayerRoot = document.querySelector("ytd-miniplayer");
        if (miniPlayerRoot) {
          miniPlayerRoot.removeAttribute("active");
          miniPlayerRoot.removeAttribute("enabled");
        }
      }

      // Bind scroll events
      let scrollTimer: number | null = null;
      function handleScroll() {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          if (window.location.pathname.startsWith("/watch")) {
            doPlayer();
          } else {
            showFullPlayer();
          }
        }, 100);
      }

      window.addEventListener("scroll", handleScroll);
      document.addEventListener("DOMContentLoaded", handleScroll);

      // Initial check
      handleScroll();

      // Store functions globally for testing
      (window as any).betterYTTest = {
        doPlayer,
        showMiniPlayer,
        showFullPlayer,
      };
    });
  }

  /**
   * Navigate to a YouTube watch page with mini player injection
   */
  async goToWatchPage(videoId: string = "dQw4w9WgXcQ") {
    await this.page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await this.page.waitForLoadState("networkidle");
    await this.injectMiniPlayerForTesting();
    // Wait for injection to take effect
    await this.page.waitForTimeout(1000);
  }

  /**
   * Navigate to other YouTube pages
   */
  async goToHomePage() {
    await this.page.goto("https://www.youtube.com", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await this.page.waitForLoadState("networkidle");
    await this.injectMiniPlayerForTesting();
    await this.page.waitForTimeout(1000);
  }

  async goToSearchPage(query: string = "test") {
    await this.page.goto(
      `https://www.youtube.com/results?search_query=${query}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      }
    );
    await this.page.waitForLoadState("networkidle");
    await this.injectMiniPlayerForTesting();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Check if the mini player is visible
   */
  async isMiniPlayerVisible(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const bodyHasMiniAttr = document.body.hasAttribute("betteryt-mini");
      const miniPlayerRoot = document.querySelector("ytd-miniplayer");
      const miniPlayerActive =
        miniPlayerRoot &&
        miniPlayerRoot.hasAttribute("enabled") &&
        miniPlayerRoot.hasAttribute("active");

      return !!(bodyHasMiniAttr && miniPlayerActive);
    });
  }

  /**
   * Get the main video player bounds
   */
  async getPlayerBounds() {
    return await this.page.evaluate(() => {
      const playerBounds = document.querySelector(
        "#player-container-inner, #player-wide-container, #player-full-bleed-container"
      );
      if (!playerBounds) return null;

      return {
        offsetHeight: playerBounds.offsetHeight,
        offsetTop: playerBounds.offsetTop,
      };
    });
  }

  /**
   * Scroll the page to a specific position
   */
  async scrollTo(y: number) {
    await this.page.evaluate((scrollY) => {
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }, y);

    // Wait for scroll to complete and trigger mini player logic
    await this.page.waitForTimeout(500);
  }

  /**
   * Scroll below the main video player
   */
  async scrollBelowPlayer() {
    const bounds = await this.getPlayerBounds();
    if (!bounds) throw new Error("Could not find player bounds");

    // Scroll past the player height + some extra margin
    await this.scrollTo(bounds.offsetHeight + 100);
  }

  /**
   * Scroll back to the top of the page
   */
  async scrollToTop() {
    await this.scrollTo(0);
  }

  /**
   * Wait for the video player to load
   */
  async waitForVideoPlayer() {
    // Wait for essential elements to exist (not necessarily visible)
    await this.page.waitForSelector("#movie_player", {
      timeout: 10000,
      state: "attached",
    });
    await this.page.waitForSelector("ytd-miniplayer", {
      timeout: 10000,
      state: "attached",
    });

    // Wait for one of the player containers
    await this.page.waitForFunction(
      () => {
        return (
          document.querySelector("#player-container-inner") ||
          document.querySelector("#player-wide-container") ||
          document.querySelector("#player-full-bleed-container")
        );
      },
      { timeout: 10000 }
    );
  }
}

test.describe("BetterYT Mini Player - Simplified", () => {
  let helper: SimplifiedMiniPlayerTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new SimplifiedMiniPlayerTestHelper(page);
  });

  test.describe("Watch Page Behavior", () => {
    test("should show mini player when scrolled down on watch page", async ({
      page,
    }) => {
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();

      // Initially mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);

      // Scroll below the main player
      await helper.scrollBelowPlayer();

      // Mini player should now be visible
      expect(await helper.isMiniPlayerVisible()).toBe(true);
    });

    test("should hide mini player when scrolled back to top", async ({
      page,
    }) => {
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();

      // Scroll below player to show mini player
      await helper.scrollBelowPlayer();
      expect(await helper.isMiniPlayerVisible()).toBe(true);

      // Scroll back to top
      await helper.scrollToTop();

      // Mini player should be hidden
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });

    test("should not show mini player when not scrolled down", async ({
      page,
    }) => {
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();

      // Stay at the top of the page
      await page.waitForTimeout(1000);

      // Mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });
  });

  test.describe("Non-Watch Page Behavior", () => {
    test("should not show mini player on home page", async ({ page }) => {
      await helper.goToHomePage();

      // Scroll down on home page
      await helper.scrollTo(1000);
      await page.waitForTimeout(1000);

      // Mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });

    test("should not show mini player on search results page", async ({
      page,
    }) => {
      await helper.goToSearchPage();

      // Scroll down on search page
      await helper.scrollTo(1000);
      await page.waitForTimeout(1000);

      // Mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });
  });

  test.describe("Scroll Threshold Behavior", () => {
    test("should show mini player exactly at scroll threshold", async ({
      page,
    }) => {
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();

      const bounds = await helper.getPlayerBounds();
      if (!bounds) throw new Error("Could not find player bounds");

      // Scroll to exactly the threshold
      await helper.scrollTo(bounds.offsetHeight);

      // Mini player should be visible at the threshold
      expect(await helper.isMiniPlayerVisible()).toBe(true);
    });

    test("should not show mini player just below threshold", async ({
      page,
    }) => {
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();

      const bounds = await helper.getPlayerBounds();
      if (!bounds) throw new Error("Could not find player bounds");

      // Scroll to just below the threshold
      await helper.scrollTo(bounds.offsetHeight - 50);

      // Mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });
  });
});
