import { test, expect } from "@playwright/test";

test.describe("Extension Loading Debug", () => {
  test("should load extension and verify basic functionality", async ({
    page,
  }) => {
    // Enable console logging
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    page.on("pageerror", (error) => console.log("PAGE ERROR:", error.message));

    console.log("🔧 Starting extension debug test...");

    // Go to YouTube
    await page.goto("https://www.youtube.com", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    console.log("✅ YouTube loaded");

    // Check if chrome extension APIs are available
    const chromeApiAvailable = await page.evaluate(() => {
      return {
        chrome: typeof window.chrome !== "undefined",
        runtime: typeof window.chrome?.runtime !== "undefined",
        storage: typeof window.chrome?.storage !== "undefined",
        runtimeId: window.chrome?.runtime?.id || "not available",
      };
    });

    console.log("🔍 Chrome API check:", chromeApiAvailable);

    // Wait a bit for extension to load
    await page.waitForTimeout(3000);

    // Check if extension content script elements are present
    const extensionElements = await page.evaluate(() => {
      return {
        bodyHasBetterYT: document.body.hasAttribute("betteryt-mini"),
        miniPlayerExists: !!document.querySelector("ytd-miniplayer"),
        playerExists: !!document.querySelector("#movie_player"),
      };
    });

    console.log("🎬 Page elements:", extensionElements);

    // Try to set storage
    try {
      await page.evaluate(() => {
        return new Promise<void>((resolve, reject) => {
          if (window.chrome?.storage?.sync) {
            window.chrome.storage.sync.set({ miniPlayer: true }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve();
              }
            });
          } else {
            reject(new Error("Storage API not available"));
          }
        });
      });
      console.log("✅ Extension storage set successfully");
    } catch (error) {
      console.log("❌ Extension storage failed:", error);
    }

    // Expect at least chrome APIs to be available
    expect(chromeApiAvailable.chrome).toBe(true);
  });
});
