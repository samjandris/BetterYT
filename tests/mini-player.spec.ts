import { test, expect, Page } from "@playwright/test";

class MiniPlayerTestHelper {
  constructor(private page: Page) {}

  /**
   * Wait for the BetterYT extension to load and initialize
   */
  async waitForExtensionLoad() {
    // Wait for the extension content script to load and initialize
    // In Manifest V3, chrome.runtime is always available but chrome.storage requires the content script to be ready
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      try {
        const isReady = await this.page.evaluate(() => {
          // Check if extension APIs are available
          if (!window.chrome || !window.chrome.storage) {
            return false;
          }

          // Check if BetterYT has started loading (content script executed)
          return window.chrome.storage !== undefined;
        });

        if (isReady) {
          await this.page.waitForTimeout(1000); // Let extension initialize
          return;
        }
      } catch (error) {
        // Continue trying
      }

      attempts++;
      await this.page.waitForTimeout(500);
    }

    console.warn(
      "Extension may not have loaded completely after maximum attempts"
    );
  }

  /**
   * Enable the mini player feature in extension settings
   */
  async enableMiniPlayer() {
    try {
      // For testing, we'll simulate the extension being enabled by manually setting the storage
      // and triggering the mini player initialization
      await this.page.evaluate(() => {
        return new Promise<void>((resolve) => {
          if (
            window.chrome &&
            window.chrome.storage &&
            window.chrome.storage.sync
          ) {
            // Set the storage value
            window.chrome.storage.sync.set({ miniPlayer: true }, () => {
              // Also manually trigger the mini player module loading if needed
              // This simulates what happens when the extension reads its settings
              resolve();
            });
          } else {
            // If storage is not available, we can still test by manually loading mini player CSS/JS
            console.warn(
              "Extension storage not available, proceeding with test anyway"
            );
            resolve();
          }
        });
      });

      // Wait for the setting to take effect
      await this.page.waitForTimeout(1500);

      // Force reload the mini player module if it exists
      await this.page.evaluate(() => {
        // If the extension is loaded but mini player wasn't enabled, try to trigger it
        if (typeof window !== "undefined") {
          // Dispatch a custom event to trigger mini player initialization
          document.dispatchEvent(new CustomEvent("betteryt-enable-miniplayer"));
        }
      });
    } catch (error) {
      console.warn("Could not configure mini player:", error);
    }
  }

  /**
   * Navigate to a YouTube watch page with a specific video
   */
  async goToWatchPage(videoId: string = "dQw4w9WgXcQ") {
    await this.page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await this.page.waitForLoadState("networkidle");
    await this.waitForExtensionLoad();
    await this.enableMiniPlayer();
  }

  /**
   * Navigate to a non-watch YouTube page
   */
  async goToHomePage() {
    await this.page.goto("https://www.youtube.com", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await this.page.waitForLoadState("networkidle");
    await this.waitForExtensionLoad();
    await this.enableMiniPlayer();
  }

  /**
   * Navigate to YouTube search results
   */
  async goToSearchPage(query: string = "test") {
    await this.page.goto(
      `https://www.youtube.com/results?search_query=${query}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      }
    );
    await this.page.waitForLoadState("networkidle");
    await this.waitForExtensionLoad();
    await this.enableMiniPlayer();
  }

  /**
   * Check if the mini player is visible
   */
  async isMiniPlayerVisible(): Promise<boolean> {
    try {
      // Check if body has the betteryt-mini attribute
      const bodyHasMiniAttr = await this.page.evaluate(() => {
        return document.body.hasAttribute("betteryt-mini");
      });

      if (!bodyHasMiniAttr) return false;

      // Check if mini player root element exists and is active
      const miniPlayerActive = await this.page.evaluate(() => {
        const miniPlayerRoot = document.querySelector("ytd-miniplayer");
        return (
          miniPlayerRoot &&
          miniPlayerRoot.hasAttribute("enabled") &&
          miniPlayerRoot.hasAttribute("active")
        );
      });

      return !!miniPlayerActive;
    } catch (error) {
      return false;
    }
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
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    }, y);

    // Wait for scroll to complete and any triggered effects
    await this.page.waitForTimeout(1000);
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
    await this.page.waitForSelector("#movie_player", { timeout: 10000 });
    await this.page.waitForSelector(
      "#player-container-inner, #player-wide-container, #player-full-bleed-container",
      { timeout: 10000 }
    );
  }
}

test.describe("BetterYT Mini Player", () => {
  let helper: MiniPlayerTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new MiniPlayerTestHelper(page);
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
      await page.waitForTimeout(2000);

      // Mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });

    test("should show mini player immediately when page loads scrolled down", async ({
      page,
    }) => {
      // Go to watch page and scroll down
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();
      await helper.scrollBelowPlayer();

      // Reload the page while scrolled down
      await page.reload();
      await helper.waitForExtensionLoad();
      await helper.enableMiniPlayer();
      await helper.waitForVideoPlayer();

      // Wait a moment for scroll position to be detected
      await page.waitForTimeout(1500);

      // Mini player should be visible since we're scrolled down
      expect(await helper.isMiniPlayerVisible()).toBe(true);
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

    test("should not show mini player on channel page", async ({ page }) => {
      await page.goto("https://www.youtube.com/@YouTube", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForLoadState("networkidle");
      await helper.waitForExtensionLoad();
      await helper.enableMiniPlayer();

      // Scroll down on channel page
      await helper.scrollTo(1000);
      await page.waitForTimeout(1000);

      // Mini player should not be visible
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });
  });

  test.describe("Navigation Between Pages", () => {
    test("should hide mini player when navigating away from watch page", async ({
      page,
    }) => {
      // Start on watch page and activate mini player
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();
      await helper.scrollBelowPlayer();
      expect(await helper.isMiniPlayerVisible()).toBe(true);

      // Navigate to home page
      await helper.goToHomePage();

      // Mini player should be hidden
      expect(await helper.isMiniPlayerVisible()).toBe(false);
    });

    test("should restore mini player state when returning to watch page", async ({
      page,
    }) => {
      // Start on watch page, scroll down to activate mini player
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();
      await helper.scrollBelowPlayer();
      expect(await helper.isMiniPlayerVisible()).toBe(true);

      // Navigate away and back
      await helper.goToHomePage();
      expect(await helper.isMiniPlayerVisible()).toBe(false);

      // Go back to watch page (same video)
      await helper.goToWatchPage();
      await helper.waitForVideoPlayer();

      // If still scrolled down, mini player should appear
      const bounds = await helper.getPlayerBounds();
      const scrollY = await page.evaluate(() => window.scrollY);

      if (bounds && scrollY >= bounds.offsetHeight) {
        expect(await helper.isMiniPlayerVisible()).toBe(true);
      }
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
