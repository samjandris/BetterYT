import "../css/popup.scss";
import { STORAGE_DEFAULT } from "./utils";

// Localize all elements with data-locale attribute
document.querySelectorAll("[data-locale]").forEach((rawElem: Element) => {
  const element = rawElem as HTMLElement;

  if (element.dataset.locale)
    element.innerText = chrome.i18n.getMessage(element.dataset.locale);
});

// Setting IDs that map directly to storage keys
const SETTING_IDS = [
  "miniPlayer",
  "returnDislikes",
  "twitchTheater",
  "pipButton",
  "experimentalComments",
] as const;

const YOUTUBE_URL_PATTERNS = ["*://youtube.com/*", "*://*.youtube.com/*"];

// Load saved settings and set checkbox states
chrome.storage.sync.get(STORAGE_DEFAULT, (data: typeof STORAGE_DEFAULT) => {
  for (const id of SETTING_IDS) {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) el.checked = data[id];
  }
});

// Attach change listeners to all setting checkboxes
for (const id of SETTING_IDS) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("change", () => {
      chrome.storage.sync.set({
        [id]: (el as HTMLInputElement).checked,
      });
      document.documentElement.setAttribute("refresh", "");
    });
  }
}

// PiP feature detection
const testVideo = document.createElement("video");
if (testVideo.requestPictureInPicture!)
  document.documentElement.setAttribute("pip", "");

// Refresh YouTube tabs button
const refreshYoutubeTabsButton = document.getElementById("refreshYoutubeTabs");
if (refreshYoutubeTabsButton) {
  refreshYoutubeTabsButton.addEventListener("click", () => {
    chrome.tabs.query({ url: YOUTUBE_URL_PATTERNS }, (tabs) => {
      if (chrome.runtime.lastError) {
        window.close();
        return;
      }

      for (const tab of tabs) {
        if (tab.id !== undefined) chrome.tabs.reload(tab.id);
      }

      window.close();
    });
  });
}
