import "../css/popup.scss";

const STORAGE_KEYS = [
  "miniPlayer",
  "returnDislikes",
  "twitchTheater",
  "pipButton",
  "experimentalComments",
] as const;

type SettingKey = (typeof STORAGE_KEYS)[number];

const DEFAULTS: Record<SettingKey, boolean> = {
  miniPlayer: true,
  returnDislikes: true,
  twitchTheater: true,
  pipButton: true,
  experimentalComments: false,
};

document.addEventListener("DOMContentLoaded", () => {
  initLocalization();
  initThemeDetection();
  initSettings();
  initPiPCheck();
  initResetButton();
});

function initLocalization(): void {
  document.querySelectorAll("[data-locale]").forEach((rawElem: Element) => {
    const element = rawElem as HTMLElement;
    if (element.dataset.locale) {
      element.innerText = chrome.i18n.getMessage(element.dataset.locale);
    }
  });

  const versionElement = document.getElementById("versionNumber");
  if (versionElement) {
    versionElement.textContent = VERSION;
  }
}

function initThemeDetection(): void {
  function detectSystemTheme(): "dark" | "light" {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme: "dark" | "light"): void {
    document.documentElement.setAttribute("data-theme", theme);
  }

  const theme = detectSystemTheme();
  applyTheme(theme);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      applyTheme(e.matches ? "dark" : "light");
    });
}

function initSettings(): void {
  chrome.storage.sync.get(STORAGE_KEYS, (data) => {
    STORAGE_KEYS.forEach((key) => {
      const checkbox = document.getElementById(key) as HTMLInputElement | null;
      const card = document.querySelector(
        `[data-feature="${key}"]`
      ) as HTMLElement | null;

      if (checkbox && data[key] !== undefined) {
        checkbox.checked = data[key];

        if (card) {
          if (data[key]) {
            card.classList.add("active");
          } else {
            card.classList.remove("active");
          }
        }
      }
    });
  });

  STORAGE_KEYS.forEach((key) => {
    const checkbox = document.getElementById(key) as HTMLInputElement | null;
    const card = document.querySelector(
      `[data-feature="${key}"]`
    ) as HTMLElement | null;

    if (checkbox && card) {
      checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;

        chrome.storage.sync.set({ [key]: isChecked });

        if (isChecked) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }

        document.documentElement.setAttribute("refresh", "");
      });
    }
  });
}

function initPiPCheck(): void {
  const testVideo = document.createElement("video");
  const supportsPip =
    "requestPictureInPicture" in testVideo &&
    typeof testVideo.requestPictureInPicture === "function";
  if (supportsPip) {
    document.documentElement.setAttribute("pip", "");
  }
}

function initResetButton(): void {
  const resetButton = document.getElementById("resetDefaults");
  const feedbackLink = document.getElementById("feedbackLink");

  if (resetButton) {
    resetButton.addEventListener("click", (e) => {
      e.preventDefault();

      STORAGE_KEYS.forEach((key) => {
        chrome.storage.sync.set({ [key]: DEFAULTS[key] });
      });

      document.querySelectorAll(".feature-card").forEach((card) => {
        card.classList.remove("active");
      });

      document
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          (checkbox as HTMLInputElement).checked =
            DEFAULTS[checkbox.id as SettingKey];
          const card = document.querySelector(
            `[data-feature="${checkbox.id}"]`
          );
          if (card && (checkbox as HTMLInputElement).checked) {
            card.classList.add("active");
          }
        });

      document.documentElement.setAttribute("refresh", "");
    });
  }

  if (feedbackLink) {
    feedbackLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({
        url: "https://github.com/samjandris/BetterYT/issues",
      });
    });
  }
}

const VERSION = "0.0.29";
