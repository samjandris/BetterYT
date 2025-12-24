/**
 * Mini Player Module
 *
 * Implements a floating mini player that appears when the user scrolls past
 * the main video player on YouTube watch pages. The mini player stays visible
 * in the corner while browsing comments/related videos.
 *
 * Key behaviors:
 * - Activates when scrolling past the player bounds
 * - Moves the actual video element (not a copy) between containers
 * - Handles SponsorBlock integration by moving its overlay too
 * - Supports both legacy and "modern" YouTube player layouts
 */

import { SELECTORS, Helper } from "../utils";

function isWatchPage(): boolean {
  return Helper.getUrl().pathname.startsWith("/watch");
}

// YouTube has two mini player layouts - legacy and "modern" (has 'modern' attribute).
// This helper returns the correct elements for whichever layout is active.
function getMiniPlayerElements() {
  const root = SELECTORS.MINI_PLAYER.ROOT();
  const isModern = root?.hasAttribute("modern");

  return {
    root,
    container: isModern
      ? SELECTORS.MINI_PLAYER.MODERN.CONTAINER()
      : SELECTORS.MINI_PLAYER.CONTAINER(),
    title: isModern
      ? SELECTORS.MINI_PLAYER.MODERN.TITLE()
      : SELECTORS.MINI_PLAYER.TITLE(),
    channel: isModern
      ? SELECTORS.MINI_PLAYER.MODERN.CHANNEL()
      : SELECTORS.MINI_PLAYER.CHANNEL(),
    infoBar: isModern
      ? SELECTORS.MINI_PLAYER.MODERN.INFO_BAR()
      : SELECTORS.MINI_PLAYER.INFO_BAR(),
  };
}

function ensureAttr(el: HTMLElement | null, attr: string): void {
  if (el && !el.hasAttribute(attr)) el.setAttribute(attr, "");
}

function removeAttr(el: HTMLElement | null, attr: string): void {
  el?.removeAttribute(attr);
}

function ensureClass(el: HTMLElement | null, className: string): void {
  if (el && !el.classList.contains(className)) el.classList.add(className);
}

function removeClass(el: HTMLElement | null, className: string): void {
  el?.classList.remove(className);
}

function reparent(
  el: HTMLElement | null,
  newParent: HTMLElement | null,
  prepend = false
): void {
  if (el && newParent && el.parentElement !== newParent) {
    prepend ? newParent.prepend(el) : newParent.appendChild(el);
  }
}

function syncText(
  target: HTMLElement | null,
  source: HTMLElement | null
): void {
  if (target && source && target.textContent !== source.textContent) {
    target.textContent = source.textContent;
  }
}

function calculateSeekTime(
  clientX: number,
  container: HTMLElement,
  video: HTMLVideoElement
): number {
  const x = clientX - container.getBoundingClientRect().x;
  return (x / container.offsetWidth) * video.duration;
}

// Activates mini player mode: moves video element to floating container,
// syncs metadata, and configures YouTube's internal player state
function showMiniPlayer() {
  ensureAttr(document.body, "betteryt-mini");
  if (Helper.isLive()) ensureAttr(document.body, "betteryt-live");

  const player = SELECTORS.PLAYER.PLAYER();
  const playerTitle = SELECTORS.PLAYER.TITLE();
  const playerChannel = SELECTORS.PLAYER.CHANNEL();
  const moviePlayer = SELECTORS.PLAYER.MOVIE_PLAYER();

  const mini = getMiniPlayerElements();

  reparent(player, mini.container, true);
  syncText(mini.title, playerTitle);
  syncText(mini.channel, playerChannel);

  if (mini.root) {
    ensureAttr(mini.root, "enabled");
    ensureAttr(mini.root, "active");
    // Prevent YouTube's native playlist UI from appearing in mini player
    removeAttr(mini.root, "has-playlist-data");
    removeAttr(mini.root, "expanded");
  }

  if (moviePlayer) {
    // These classes tell YouTube's player to use compact controls
    ensureClass(moviePlayer, "ytp-player-minimized");
    ensureClass(moviePlayer, "ytp-small-mode");
    removeClass(moviePlayer, "ytp-big-mode");
  }

  // Move SponsorBlock's segment overlay to our mini player progress bar
  reparent(
    SELECTORS.SPONSOR_BLOCK.CONTAINER(),
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER()
  );
}

// Restores video to main player container and resets YouTube player state
function showFullPlayer() {
  const mini = getMiniPlayerElements();
  const player = SELECTORS.PLAYER.PLAYER();
  const playerContainer = SELECTORS.PLAYER.CONTAINER();
  const moviePlayer = SELECTORS.PLAYER.MOVIE_PLAYER();

  removeAttr(document.body, "betteryt-mini");
  removeAttr(document.body, "betteryt-live");

  if (mini.root) {
    removeAttr(mini.root, "has-no-data");
    removeAttr(mini.root, "closed");
    removeAttr(mini.root, "active");
    removeAttr(mini.root, "enabled");
  }

  reparent(player, playerContainer);
  reparent(
    SELECTORS.SPONSOR_BLOCK.CONTAINER(),
    SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER()
  );

  if (moviePlayer) {
    removeClass(moviePlayer, "ytp-player-minimized");
    removeClass(moviePlayer, "ytp-small-mode");

    // Restore big mode only if player was in fullscreen
    if (moviePlayer.classList.contains("ytp-fullscreen")) {
      ensureClass(moviePlayer, "ytp-big-mode");
    }
  }
}

// Main scroll handler: determines whether to show mini or full player
// based on scroll position relative to the player bounds
function doPlayer() {
  const playerBounds = SELECTORS.PLAYER.BOUNDS();
  const pageApp = SELECTORS.PAGE.APP();

  if (!playerBounds || !pageApp) return;

  const scrolledPastPlayer =
    window.scrollY >= playerBounds.offsetHeight ||
    pageApp.scrollTop >= playerBounds.offsetHeight;

  scrolledPastPlayer ? showMiniPlayer() : showFullPlayer();
}

// Updates the progress bar position and chapter fill based on current video time
function updateProgressBar() {
  const video = SELECTORS.PLAYER.VIDEO();
  const progressBar =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER();
  const scrubberContainer =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER();
  const chaptersContainer =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();

  if (!video || !progressBar || !scrubberContainer || !chaptersContainer)
    return;

  const duration = video.duration;
  if (!duration || !isFinite(duration)) return;

  const progress = video.currentTime / duration;
  const containerWidth = progressBar.offsetWidth;
  const scrubberX = progress * containerWidth;

  scrubberContainer.style.transform = `translateX(${scrubberX}px)`;

  const chapters = Array.from(chaptersContainer.children) as HTMLElement[];

  if (chapters.length === 0) {
    return;
  }

  let accumulatedWidth = 0;
  for (const chapter of chapters) {
    const chapterProgress = chapter.querySelector(
      ".ytp-play-progress"
    ) as HTMLElement;
    if (!chapterProgress) continue;

    const chapterWidth = chapter.offsetWidth;
    const marginRight = parseFloat(getComputedStyle(chapter).marginRight) || 0;

    if (scrubberX >= accumulatedWidth + chapterWidth) {
      chapterProgress.style.transform = "scaleX(1)";
    } else if (scrubberX <= accumulatedWidth) {
      chapterProgress.style.transform = "scaleX(0)";
    } else {
      const chapterFillRatio = (scrubberX - accumulatedWidth) / chapterWidth;
      chapterProgress.style.transform = `scaleX(${chapterFillRatio})`;
    }

    accumulatedWidth += chapterWidth + marginRight;
  }
}

function handleProgressBarSeek(clientX: number) {
  const progressBar =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER();
  const video = SELECTORS.PLAYER.VIDEO();

  if (progressBar && video) {
    video.currentTime = calculateSeekTime(clientX, progressBar, video);
    updateProgressBar();
  }
}

// Creates the custom progress bar and gradient overlay for the mini player
function createMiniPlayer() {
  const moviePlayer = SELECTORS.PLAYER.MOVIE_PLAYER();
  if (!moviePlayer) return;

  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "betteryt ytp-progress-bar-container";
  progressBarContainer.setAttribute("data-layer", "4");

  const progressBar = document.createElement("div");
  progressBar.className = "betteryt ytp-progress-bar";
  progressBar.setAttribute("role", "slider");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", "100");
  progressBar.setAttribute("aria-valuenow", "0");

  const chaptersContainer = document.createElement("div");
  chaptersContainer.className = "betteryt ytp-chapters-container";

  const scrubberContainer = document.createElement("div");
  scrubberContainer.className = "betteryt ytp-scrubber-container";

  const scrubberButton = document.createElement("div");
  scrubberButton.className = "betteryt ytp-scrubber-button";
  scrubberContainer.appendChild(scrubberButton);

  progressBar.appendChild(chaptersContainer);
  progressBar.appendChild(scrubberContainer);
  progressBarContainer.appendChild(progressBar);

  let pointerDown = false;

  progressBar.addEventListener("pointerdown", (e) => {
    pointerDown = true;
    progressBar.setPointerCapture(e.pointerId);
    handleProgressBarSeek(e.clientX);
  });

  progressBar.addEventListener("pointermove", (e) => {
    if (pointerDown) handleProgressBarSeek(e.clientX);
  });

  progressBar.addEventListener("pointerup", (e) => {
    pointerDown = false;
    progressBar.releasePointerCapture(e.pointerId);
  });

  progressBar.addEventListener("pointercancel", () => (pointerDown = false));

  const gradientBottom = document.createElement("div");
  gradientBottom.className = "betteryt ytp-gradient-bottom";

  moviePlayer.appendChild(progressBarContainer);
  moviePlayer.appendChild(gradientBottom);

  const mini = getMiniPlayerElements();
  const pageApp = SELECTORS.PAGE.APP();

  if (mini.infoBar && pageApp) {
    // Clicking the info bar (title/channel area) scrolls back to main player
    mini.infoBar.addEventListener("click", () => {
      if (isWatchPage()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        pageApp.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
}

function createChapters() {
  const miniChaptersContainer =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();
  const playerChaptersContainer =
    SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();
  const progressBar =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER();
  const playerControlsContainer = SELECTORS.PLAYER.CONTROLS.CONTAINER();

  if (!miniChaptersContainer || !progressBar) return;

  miniChaptersContainer.innerHTML = "";

  const miniWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--ytd-miniplayer-width"
    ) || "400"
  );

  // If no player chapters container exists, create single full-width bar
  if (!playerChaptersContainer || !playerControlsContainer) {
    const singleChapter = createChapterElement("100%", false);
    miniChaptersContainer.appendChild(singleChapter);
    return;
  }

  const playerChapters = Array.from(
    playerChaptersContainer.children
  ) as HTMLElement[];

  // Check if video has actual chapters (multiple segments with explicit widths)
  // Videos without chapters have a single child with no inline width style
  const hasValidChapters =
    playerChapters.length > 1 ||
    (playerChapters.length === 1 &&
      playerChapters[0].style.width &&
      parseFloat(playerChapters[0].style.width) > 0);

  if (!hasValidChapters) {
    const singleChapter = createChapterElement("100%", false);
    miniChaptersContainer.appendChild(singleChapter);
    return;
  }

  // Calculate total source width from inline styles (more reliable than offsetWidth during navigation)
  let totalSourceWidth = 0;
  for (const chapter of playerChapters) {
    totalSourceWidth += parseFloat(chapter.style.width) || 0;
  }

  if (totalSourceWidth === 0) {
    const singleChapter = createChapterElement("100%", false);
    miniChaptersContainer.appendChild(singleChapter);
    return;
  }

  const hasMultipleChapters = playerChapters.length > 1;
  const marginCount = hasMultipleChapters ? playerChapters.length - 1 : 0;
  const availableMiniWidth = miniWidth - marginCount * 2;

  for (let i = 0; i < playerChapters.length; i++) {
    const sourceChapter = playerChapters[i];
    const sourceWidth = parseFloat(sourceChapter.style.width) || 0;
    const scaledWidth = Math.round(
      (sourceWidth / totalSourceWidth) * availableMiniWidth
    );
    const hasMargin = hasMultipleChapters && i < playerChapters.length - 1;

    const chapter = createChapterElement(`${scaledWidth}px`, hasMargin);
    miniChaptersContainer.appendChild(chapter);
  }

  adjustChapterWidths(miniChaptersContainer, miniWidth);
}

function createChapterElement(width: string, hasMargin: boolean): HTMLElement {
  const chapter = document.createElement("div");
  chapter.className = "betteryt ytp-chapter-hover-container";
  chapter.style.width = width;
  if (hasMargin) chapter.style.marginRight = "2px";

  const padding = document.createElement("div");
  padding.className = "betteryt ytp-progress-bar-padding";

  const progressList = document.createElement("div");
  progressList.className = "betteryt ytp-progress-list";

  const playProgress = document.createElement("div");
  playProgress.className =
    "betteryt ytp-play-progress ytp-swatch-background-color";
  playProgress.style.transform = "scaleX(0)";

  progressList.appendChild(playProgress);
  chapter.appendChild(padding);
  chapter.appendChild(progressList);

  return chapter;
}

function adjustChapterWidths(
  container: HTMLElement,
  targetWidth: number
): void {
  const chapters = Array.from(container.children) as HTMLElement[];
  let totalWidth = 0;

  for (const chapter of chapters) {
    totalWidth += parseFloat(chapter.style.width) || 0;
    if (chapter.style.marginRight) {
      totalWidth += parseFloat(chapter.style.marginRight) || 0;
    }
  }

  let maxIterations = 1000;
  while (totalWidth > targetWidth && maxIterations > 0) {
    maxIterations--;
    let madeProgress = false;

    for (const chapter of chapters) {
      const currentWidth = parseFloat(chapter.style.width) || 0;
      if (currentWidth > 1 && totalWidth > targetWidth) {
        chapter.style.width = `${currentWidth - 1}px`;
        totalWidth -= 1;
        madeProgress = true;
      }
    }

    if (!madeProgress) break;
  }
}

function onWatchPageScroll() {
  if (isWatchPage()) doPlayer();
}

function onWatchPageResize() {
  const moviePlayer = SELECTORS.PLAYER.MOVIE_PLAYER();
  // Don't trigger in fullscreen - the player fills the screen regardless
  if (
    isWatchPage() &&
    moviePlayer?.ariaLabel &&
    !moviePlayer.ariaLabel.includes("Fullscreen")
  ) {
    doPlayer();
  }
}

window.addEventListener("scroll", onWatchPageScroll);

const pageApp = SELECTORS.PAGE.APP();
pageApp?.addEventListener("scroll", onWatchPageScroll);
window.addEventListener("resize", onWatchPageResize);

// Needed to solve bug where video doesn't maximize fully when expanding from mini player
window.addEventListener("onPageChange", () => {
  if (isWatchPage()) {
    Helper.onElementsLoad([
      SELECTORS.RAW.PLAYER.VIDEO,
      SELECTORS.RAW.MINI_PLAYER.CONTAINER,
      SELECTORS.RAW.MINI_PLAYER.MODERN.CONTAINER,
      SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER,
    ]).then(() => {
      doPlayer();
      createChapters();
    });
  } else {
    removeAttr(document.body, "betteryt-mini");
    removeAttr(document.body, "betteryt-live");
  }
});

// Fixes problem where exiting fullscreen when in mini player doesn't auto expand
window.addEventListener("onViewModeChange", () => {
  if (isWatchPage()) doPlayer();
});

// Initial setup after required elements are available
Helper.onElementsLoad([
  SELECTORS.RAW.PLAYER.VIDEO,
  SELECTORS.RAW.MINI_PLAYER.CONTAINER,
  // TODO: Modern player seems to be renamed to normal container now, could most likely remove
  // SELECTORS.RAW.MINI_PLAYER.MODERN.CONTAINER,
  SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER,
]).then(() => {
  createMiniPlayer();
  createChapters();

  const video = SELECTORS.PLAYER.VIDEO();
  if (video) {
    video.addEventListener("timeupdate", () => {
      const scrubberContainer =
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER();
      const slider =
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER();

      if (scrubberContainer && slider) {
        slider.setAttribute("aria-valuemin", "0");
        slider.setAttribute("aria-valuemax", video.duration.toString());
        slider.setAttribute("aria-valuenow", video.currentTime.toString());
        updateProgressBar();
      }
    });

    video.addEventListener("loadedmetadata", () => {
      if (isWatchPage()) {
        setTimeout(createChapters, 100);
      }
    });
  }

  Helper.onChildElementChange(
    SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
    () => {
      if (isWatchPage()) {
        doPlayer();
        createChapters();
      }
    }
  );

  // On first load, title/channel elements add extra string nodes that need cleanup
  Helper.onChildElementChange(SELECTORS.RAW.MINI_PLAYER.TITLE, () => {
    const titleEl = SELECTORS.MINI_PLAYER.TITLE();
    if (titleEl && titleEl.childNodes.length >= 2 && titleEl.lastChild) {
      titleEl.textContent = titleEl.lastChild.textContent;
    }
  });

  Helper.onChildElementChange(SELECTORS.RAW.MINI_PLAYER.CHANNEL, () => {
    const channelEl = SELECTORS.MINI_PLAYER.CHANNEL();
    if (channelEl && channelEl.childNodes.length >= 2 && channelEl.lastChild) {
      channelEl.textContent = channelEl.lastChild.textContent;
    }
  });

  Helper.onAttributeChange(
    SELECTORS.RAW.MINI_PLAYER.ROOT,
    () => {
      if (isWatchPage()) doPlayer();
    },
    // These attributes trigger when YouTube tries to show playlist in mini player
    {
      attributes: true,
      attributeFilter: ["has-playlist-data", "expanded"],
    }
  );
});
