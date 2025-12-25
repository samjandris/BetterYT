import "../css/popup.scss";
import { STORAGE_DEFAULT } from "./utils";

document.querySelectorAll("[data-locale]").forEach((rawElem: Element) => {
  const element = rawElem as HTMLElement;

  if (element.dataset.locale)
    element.innerText = chrome.i18n.getMessage(element.dataset.locale);
});

chrome.storage.sync.get(STORAGE_DEFAULT, (data: typeof STORAGE_DEFAULT) => {
  (document.getElementById("miniPlayer") as HTMLInputElement).checked =
    data.miniPlayer;
  (document.getElementById("returnDislikes") as HTMLInputElement).checked =
    data.returnDislikes;
  (document.getElementById("twitchTheater") as HTMLInputElement).checked =
    data.twitchTheater;
  (document.getElementById("pipButton") as HTMLInputElement).checked =
    data.pipButton;
  (
    document.getElementById("experimentalComments") as HTMLInputElement
  ).checked = data.experimentalComments;
});

const miniPlayerElement = document.getElementById("miniPlayer");
if (miniPlayerElement)
  miniPlayerElement.addEventListener("change", () => {
    chrome.storage.sync.set({
      miniPlayer: (miniPlayerElement as HTMLInputElement).checked,
    });

    document.documentElement.setAttribute("refresh", "");
  });

const returnDislikesElement = document.getElementById("returnDislikes");
if (returnDislikesElement)
  returnDislikesElement.addEventListener("change", () => {
    chrome.storage.sync.set({
      returnDislikes: (returnDislikesElement as HTMLInputElement).checked,
    });

    document.documentElement.setAttribute("refresh", "");
  });

const twitchTheaterElement = document.getElementById("twitchTheater");
if (twitchTheaterElement)
  twitchTheaterElement.addEventListener("change", () => {
    chrome.storage.sync.set({
      twitchTheater: (twitchTheaterElement as HTMLInputElement).checked,
    });

    document.documentElement.setAttribute("refresh", "");
  });

const testVideo = document.createElement("video");
if (testVideo.requestPictureInPicture!)
  document.documentElement.setAttribute("pip", "");

const pipButtonElement = document.getElementById("pipButton");
if (pipButtonElement)
  pipButtonElement.addEventListener("change", () => {
    chrome.storage.sync.set({
      pipButton: (pipButtonElement as HTMLInputElement).checked,
    });

    document.documentElement.setAttribute("refresh", "");
  });

const experimentalCommentsElement = document.getElementById(
  "experimentalComments"
);
if (experimentalCommentsElement)
  experimentalCommentsElement.addEventListener("change", () => {
    chrome.storage.sync.set({
      experimentalComments: (experimentalCommentsElement as HTMLInputElement)
        .checked,
    });

    document.documentElement.setAttribute("refresh", "");
  });
