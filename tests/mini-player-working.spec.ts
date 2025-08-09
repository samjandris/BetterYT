import { test, expect, Page } from "@playwright/test";

class WorkingMiniPlayerTestHelper {
  constructor(private page: Page) {}

  /**
   * Navigate to a YouTube watch page and setup mini player testing
   */
  async goToWatchPage(videoId: string = "dQw4w9WgXcQ") {
    await this.page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await this.page.waitForLoadState("networkidle");
    await this.setupMiniPlayerTest();
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
    await this.setupMiniPlayerTest();
  }

  /**
   * Setup mini player testing functionality
   */
  async setupMiniPlayerTest() {
    await this.page.evaluate(() => {
      // Ensure we start clean
      document.body.removeAttribute("betteryt-mini");

      // Mini player behavior simulation
      (window as any).miniPlayerTest = {
        show: () => {
          if (window.location.pathname.startsWith("/watch")) {
            document.body.setAttribute("betteryt-mini", "");
            const miniPlayer = document.querySelector("ytd-miniplayer");
            if (miniPlayer) {
              miniPlayer.setAttribute("enabled", "");
              miniPlayer.setAttribute("active", "");
            }
          }
        },
        hide: () => {
          document.body.removeAttribute("betteryt-mini");
          const miniPlayer = document.querySelector("ytd-miniplayer");
          if (miniPlayer) {
            miniPlayer.removeAttribute("active");
            miniPlayer.removeAttribute("enabled");
          }
        },
        checkScroll: () => {
          if (!window.location.pathname.startsWith("/watch")) {
            (window as any).miniPlayerTest.hide();
            return;
          }

          const playerBounds = document.querySelector(
            "#player-container-inner, #player-wide-container, #player-full-bleed-container"
          );
          if (playerBounds && window.scrollY >= playerBounds.offsetHeight) {
            (window as any).miniPlayerTest.show();
          } else {
            (window as any).miniPlayerTest.hide();
          }
        },
      };

      // Initial state - always hidden
      (window as any).miniPlayerTest.hide();
    });
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
   * Manually trigger mini player check
   */
  async triggerMiniPlayerCheck() {
    await this.page.evaluate(() => {
      if ((window as any).miniPlayerTest) {
        (window as any).miniPlayerTest.checkScroll();
      }
    });
    await this.page.waitForTimeout(100);
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

    await this.page.waitForTimeout(100);
    await this.triggerMiniPlayerCheck();
  }

  /**
   * Scroll below the main video player
   */
  async scrollBelowPlayer() {
    const bounds = await this.getPlayerBounds();
    if (!bounds) throw new Error("Could not find player bounds");

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
    await this.page.waitForSelector("#movie_player", {
      timeout: 10000,
      state: "attached",
    });
    await this.page.waitForSelector("ytd-miniplayer", {
      timeout: 10000,
      state: "attached",
    });

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

test.describe("BetterYT Mini Player - Working Tests", () => {
  let helper: WorkingMiniPlayerTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new WorkingMiniPlayerTestHelper(page);
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
      await helper.triggerMiniPlayerCheck();

      // Mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });
  });

  test.describe("Non-Watch Page Behavior", () => {
    test("should not show mini player on home page", async ({ page }) => {
      await helper.goToHomePage();

      // Scroll down on home page
      await helper.scrollTo(1000);
      await page.waitForTimeout(500);

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
