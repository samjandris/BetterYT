import { SELECTORS, Helper } from "../utils";

const API_URL = "https://returnyoutubedislikeapi.com/votes";

const CLASSES = {
  YOUTUBE: {
    BUTTON_TEXT: "yt-spec-button-shape-next__button-text-content",
    BUTTON_ICON: "yt-spec-button-shape-next__icon",
    ICON_BUTTON: "yt-spec-button-shape-next--icon-button",
    ICON_LEADING: "yt-spec-button-shape-next--icon-leading",
  },
  BETTERYT: {
    DISLIKE_COUNT: "betteryt-dislike-count",
  },
};

function createDislikeTextElement(): HTMLDivElement {
  const element = document.createElement("div");
  element.className = `${CLASSES.YOUTUBE.BUTTON_TEXT} ${CLASSES.BETTERYT.DISLIKE_COUNT}`;
  return element;
}

function injectDislikeCount(button: HTMLElement, count: number): void {
  let textElement = button.querySelector(
    `.${CLASSES.BETTERYT.DISLIKE_COUNT}`
  ) as HTMLElement | null;

  if (!textElement) {
    textElement = createDislikeTextElement();

    const iconDiv = button.querySelector(`.${CLASSES.YOUTUBE.BUTTON_ICON}`);
    if (iconDiv) {
      iconDiv.after(textElement);
    } else {
      button.appendChild(textElement);
    }

    // Switch from icon-only to icon+text layout (matches like button styling)
    button.classList.remove(CLASSES.YOUTUBE.ICON_BUTTON);
    button.classList.add(CLASSES.YOUTUBE.ICON_LEADING);
  }

  textElement.textContent = Helper.abbreviateNumber(count);
}

async function fetchDislikeCount(videoId: string): Promise<number | null> {
  try {
    const response = await fetch(`${API_URL}?videoId=${videoId}`);
    const data = await response.json();
    return data.dislikes;
  } catch (error) {
    console.error("BetterYT: Failed to fetch dislike count", error);
    return null;
  }
}

async function updateDislikes(): Promise<void> {
  await Helper.onElementLoad(SELECTORS.RAW.PLAYER.DISLIKE_BUTTON);

  const videoId = Helper.getUrl().searchParams.get("v");
  if (!videoId) return;

  const dislikeCount = await fetchDislikeCount(videoId);
  if (dislikeCount === null) return;

  const dislikeButton = SELECTORS.PLAYER.DISLIKE_BUTTON();
  if (!dislikeButton) return;

  injectDislikeCount(dislikeButton, dislikeCount);
}

function onWatchPage(): void {
  if (Helper.getUrl().pathname.startsWith("/watch")) {
    updateDislikes();
  }
}

window.addEventListener("onPageChange", onWatchPage);

onWatchPage();
