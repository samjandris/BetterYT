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
 */

import { SELECTORS, Helper } from "../utils";

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_MINIPLAYER_WIDTH = 400;
const CHAPTER_MARGIN_PX = 2;
const CHAPTER_LOAD_DELAY_MS = 100;

// =============================================================================
// State
// =============================================================================

let currentVideoElement: HTMLVideoElement | null = null;

// =============================================================================
// DOM Utilities
// =============================================================================

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

// =============================================================================
// Mini Player Layout Detection
// =============================================================================

function isWatchPage(): boolean {
  return Helper.getUrl().pathname.startsWith("/watch");
}

function getMiniPlayerElements() {
  return {
    root: SELECTORS.MINI_PLAYER.ROOT(),
    container: SELECTORS.MINI_PLAYER.CONTAINER(),
    title: SELECTORS.MINI_PLAYER.TITLE(),
    channel: SELECTORS.MINI_PLAYER.CHANNEL(),
    infoBar: SELECTORS.MINI_PLAYER.INFO_BAR(),
  };
}

function getMiniPlayerWidth(): number {
  const cssValue = getComputedStyle(document.documentElement).getPropertyValue(
    "--ytd-miniplayer-width"
  );
  return parseInt(cssValue) || DEFAULT_MINIPLAYER_WIDTH;
}

// =============================================================================
// Player State Management
// =============================================================================

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
    removeAttr(mini.root, "has-playlist-data");
    removeAttr(mini.root, "expanded");
  }

  if (moviePlayer) {
    ensureClass(moviePlayer, "ytp-player-minimized");
    ensureClass(moviePlayer, "ytp-small-mode");
    removeClass(moviePlayer, "ytp-big-mode");
  }

  reparent(
    SELECTORS.SPONSOR_BLOCK.CONTAINER(),
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER()
  );
}

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

    if (moviePlayer.classList.contains("ytp-fullscreen")) {
      ensureClass(moviePlayer, "ytp-big-mode");
    }
  }
}

function updatePlayerState() {
  const playerBounds = SELECTORS.PLAYER.BOUNDS();
  const pageApp = SELECTORS.PAGE.APP();

  if (!playerBounds || !pageApp) return;

  const scrolledPastPlayer =
    window.scrollY >= playerBounds.offsetHeight ||
    pageApp.scrollTop >= playerBounds.offsetHeight;

  scrolledPastPlayer ? showMiniPlayer() : showFullPlayer();
}

// =============================================================================
// Progress Bar
// =============================================================================

function calculateSeekTime(
  clientX: number,
  container: HTMLElement,
  video: HTMLVideoElement
): number {
  const x = clientX - container.getBoundingClientRect().x;
  return (x / container.offsetWidth) * video.duration;
}

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
  if (chapters.length === 0) return;

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

// =============================================================================
// Chapters
// =============================================================================

function createChapterElement(width: string, hasMargin: boolean): HTMLElement {
  const chapter = document.createElement("div");
  chapter.className = "betteryt ytp-chapter-hover-container";
  chapter.style.width = width;
  if (hasMargin) chapter.style.marginRight = `${CHAPTER_MARGIN_PX}px`;

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

function createSingleChapter(container: HTMLElement): void {
  const singleChapter = createChapterElement("100%", false);
  container.appendChild(singleChapter);
}

function createChapters() {
  const miniChaptersContainer =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();
  const playerChaptersContainer =
    SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();
  const progressBar =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER();

  if (!miniChaptersContainer || !progressBar) return;

  miniChaptersContainer.innerHTML = "";

  const miniWidth = getMiniPlayerWidth();

  if (!playerChaptersContainer) {
    createSingleChapter(miniChaptersContainer);
    return;
  }

  const playerChapters = Array.from(
    playerChaptersContainer.children
  ) as HTMLElement[];

  // Videos without chapters have a single child with no inline width style
  const hasValidChapters =
    playerChapters.length > 1 ||
    (playerChapters.length === 1 &&
      playerChapters[0].style.width &&
      parseFloat(playerChapters[0].style.width) > 0);

  if (!hasValidChapters) {
    createSingleChapter(miniChaptersContainer);
    return;
  }

  // Calculate total source width from inline styles (more reliable than offsetWidth during navigation)
  let totalSourceWidth = 0;
  for (const chapter of playerChapters) {
    totalSourceWidth += parseFloat(chapter.style.width) || 0;
  }

  if (totalSourceWidth === 0) {
    createSingleChapter(miniChaptersContainer);
    return;
  }

  const hasMultipleChapters = playerChapters.length > 1;
  const marginCount = hasMultipleChapters ? playerChapters.length - 1 : 0;
  const availableMiniWidth = miniWidth - marginCount * CHAPTER_MARGIN_PX;

  let usedWidth = 0;
  for (let i = 0; i < playerChapters.length; i++) {
    const sourceChapter = playerChapters[i];
    const sourceWidth = parseFloat(sourceChapter.style.width) || 0;
    const isLastChapter = i === playerChapters.length - 1;
    const hasMargin = hasMultipleChapters && !isLastChapter;

    let scaledWidth: number;
    if (isLastChapter) {
      scaledWidth = availableMiniWidth - usedWidth;
    } else {
      scaledWidth = Math.round(
        (sourceWidth / totalSourceWidth) * availableMiniWidth
      );
      usedWidth += scaledWidth;
    }

    const chapter = createChapterElement(`${scaledWidth}px`, hasMargin);
    miniChaptersContainer.appendChild(chapter);
  }
}

// =============================================================================
// Mini Player Creation
// =============================================================================

function createProgressBar(moviePlayer: HTMLElement): void {
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
}

function setupInfoBarClickHandler(): void {
  const mini = getMiniPlayerElements();
  const pageApp = SELECTORS.PAGE.APP();

  if (mini.infoBar && pageApp) {
    mini.infoBar.addEventListener("click", () => {
      if (isWatchPage()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        pageApp.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
}

function createMiniPlayer() {
  const moviePlayer = SELECTORS.PLAYER.MOVIE_PLAYER();
  if (!moviePlayer) return;

  createProgressBar(moviePlayer);
  setupInfoBarClickHandler();
}

// =============================================================================
// Video Event Listeners
// =============================================================================

function setupVideoListeners() {
  const video = SELECTORS.PLAYER.VIDEO();
  if (!video) return;

  if (video === currentVideoElement) return;

  currentVideoElement = video;

  video.addEventListener("timeupdate", () => {
    const currentVideo = SELECTORS.PLAYER.VIDEO();
    const scrubberContainer =
      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER();
    const slider =
      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER();

    if (currentVideo && scrubberContainer && slider) {
      slider.setAttribute("aria-valuemin", "0");
      slider.setAttribute("aria-valuemax", currentVideo.duration.toString());
      slider.setAttribute("aria-valuenow", currentVideo.currentTime.toString());
      updateProgressBar();
    }
  });

  video.addEventListener("loadedmetadata", () => {
    resetProgressBar();
    if (isWatchPage()) {
      setTimeout(createChapters, CHAPTER_LOAD_DELAY_MS);
    }
  });
}

function resetProgressBar() {
  const scrubberContainer =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER();
  if (scrubberContainer) {
    scrubberContainer.style.transform = "translateX(0px)";
  }

  const chaptersContainer =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();
  if (chaptersContainer) {
    const progressFills =
      chaptersContainer.querySelectorAll(".ytp-play-progress");
    progressFills.forEach((fill) => {
      (fill as HTMLElement).style.transform = "scaleX(0)";
    });
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function onScroll() {
  if (isWatchPage()) updatePlayerState();
}

function onResize() {
  const moviePlayer = SELECTORS.PLAYER.MOVIE_PLAYER();
  if (
    isWatchPage() &&
    moviePlayer?.ariaLabel &&
    !moviePlayer.ariaLabel.includes("Fullscreen")
  ) {
    updatePlayerState();
  }
}

function onPageChange() {
  if (isWatchPage()) {
    Helper.onElementsLoad([
      SELECTORS.RAW.PLAYER.VIDEO,
      SELECTORS.RAW.MINI_PLAYER.CONTAINER,
      SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER,
    ]).then(() => {
      updatePlayerState();
      createChapters();
      setupVideoListeners();
    });
  } else {
    showFullPlayer();
    resetProgressBar();
    currentVideoElement = null;
  }
}

function onViewModeChange() {
  if (isWatchPage()) updatePlayerState();
}

// =============================================================================
// Mutation Observers
// =============================================================================

function setupChaptersObserver(): void {
  Helper.onChildElementChange(
    SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
    () => {
      if (isWatchPage()) {
        updatePlayerState();
        createChapters();
      }
    }
  );
}

function setupTitleCleanupObserver(): void {
  Helper.onChildElementChange(SELECTORS.RAW.MINI_PLAYER.TITLE, () => {
    const titleEl = SELECTORS.MINI_PLAYER.TITLE();
    if (titleEl && titleEl.childNodes.length >= 2 && titleEl.lastChild) {
      titleEl.textContent = titleEl.lastChild.textContent;
    }
  });
}

function setupChannelCleanupObserver(): void {
  Helper.onChildElementChange(SELECTORS.RAW.MINI_PLAYER.CHANNEL, () => {
    const channelEl = SELECTORS.MINI_PLAYER.CHANNEL();
    if (channelEl && channelEl.childNodes.length >= 2 && channelEl.lastChild) {
      channelEl.textContent = channelEl.lastChild.textContent;
    }
  });
}

function setupPlaylistAttributeObserver(): void {
  Helper.onAttributeChange(
    SELECTORS.RAW.MINI_PLAYER.ROOT,
    () => {
      if (isWatchPage()) updatePlayerState();
    },
    {
      attributes: true,
      attributeFilter: ["has-playlist-data", "expanded"],
    }
  );
}

// =============================================================================
// Initialization
// =============================================================================

function registerGlobalEventListeners(): void {
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onResize);
  window.addEventListener("onPageChange", onPageChange);
  window.addEventListener("onViewModeChange", onViewModeChange);

  const pageApp = SELECTORS.PAGE.APP();
  pageApp?.addEventListener("scroll", onScroll);
}

function init(): void {
  registerGlobalEventListeners();

  Helper.onElementsLoad([
    SELECTORS.RAW.PLAYER.VIDEO,
    SELECTORS.RAW.MINI_PLAYER.CONTAINER,
    SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER,
  ]).then(() => {
    createMiniPlayer();
    createChapters();
    setupVideoListeners();

    setupChaptersObserver();
    setupTitleCleanupObserver();
    setupChannelCleanupObserver();
    setupPlaylistAttributeObserver();
  });
}

init();
