import { SELECTORS, Helper } from '../utils';

function showMiniPlayer() {
  if (!document.body.hasAttribute('betteryt-mini'))
    document.body.setAttribute('betteryt-mini', '');

  if (!document.body.hasAttribute('betteryt-live') && Helper.isLive())
    document.body.setAttribute('betteryt-live', '');

  const playerElement = SELECTORS.PLAYER.PLAYER();
  const playerTitleElement = SELECTORS.PLAYER.TITLE();
  const playerChannelElement = SELECTORS.PLAYER.CHANNEL();

  const miniPlayerRootElement = SELECTORS.MINI_PLAYER.ROOT();
  let miniPlayerContainerElement = SELECTORS.MINI_PLAYER.CONTAINER();
  let miniPlayerTitleElement = SELECTORS.MINI_PLAYER.TITLE();
  let miniPlayerChannelElement = SELECTORS.MINI_PLAYER.CHANNEL();

  if (miniPlayerRootElement?.hasAttribute('modern')) {
    miniPlayerContainerElement = SELECTORS.MINI_PLAYER.MODERN.CONTAINER();
    miniPlayerTitleElement = SELECTORS.MINI_PLAYER.MODERN.TITLE();
    miniPlayerChannelElement = SELECTORS.MINI_PLAYER.MODERN.CHANNEL();
  }

  // Mini player video
  if (
    playerElement &&
    miniPlayerContainerElement &&
    playerElement.parentElement !== miniPlayerContainerElement
  )
    miniPlayerContainerElement.appendChild(playerElement);

  // Mini player title and channel
  if (
    miniPlayerTitleElement &&
    playerTitleElement &&
    miniPlayerTitleElement.textContent !== playerTitleElement.textContent
  )
    miniPlayerTitleElement.textContent = playerTitleElement.textContent;
  if (
    miniPlayerChannelElement &&
    playerChannelElement &&
    miniPlayerChannelElement.textContent !== playerChannelElement.textContent
  )
    miniPlayerChannelElement.textContent = playerChannelElement.textContent;

  // Mini player enabled and active
  if (miniPlayerRootElement) {
    if (!miniPlayerRootElement.hasAttribute('enabled'))
      miniPlayerRootElement.setAttribute('enabled', '');
    if (!miniPlayerRootElement.hasAttribute('active'))
      miniPlayerRootElement.setAttribute('active', '');
    if (miniPlayerRootElement.hasAttribute('has-playlist-data'))
      miniPlayerRootElement.removeAttribute('has-playlist-data');
    if (miniPlayerRootElement.hasAttribute('expanded'))
      miniPlayerRootElement.removeAttribute('expanded');
  }

  const playerMoviePlayerElement = SELECTORS.PLAYER.MOVIE_PLAYER();
  if (playerMoviePlayerElement) {
    if (!playerMoviePlayerElement.classList.contains('ytp-player-minimized'))
      playerMoviePlayerElement.classList.add('ytp-player-minimized');

    if (!playerMoviePlayerElement.classList.contains('ytp-small-mode'))
      playerMoviePlayerElement.classList.add('ytp-small-mode');

    if (playerMoviePlayerElement.classList.contains('ytp-big-mode')) {
      playerMoviePlayerElement.classList.remove('ytp-big-mode');
    }
  }

  // Sponsorblock
  const sponsorBlockContainerElement = SELECTORS.SPONSOR_BLOCK.CONTAINER();
  const miniPlayerProgressBarContainerElement =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER();

  if (
    sponsorBlockContainerElement &&
    miniPlayerProgressBarContainerElement &&
    sponsorBlockContainerElement.parentElement !==
      miniPlayerProgressBarContainerElement
  )
    miniPlayerProgressBarContainerElement.appendChild(
      sponsorBlockContainerElement
    );
}

function showFullPlayer() {
  const miniPlayerRootElement = SELECTORS.MINI_PLAYER.ROOT();
  const playerElement = SELECTORS.PLAYER.PLAYER();
  const playerContainerElement = SELECTORS.PLAYER.CONTAINER();
  const playerMoviePlayerElement = SELECTORS.PLAYER.MOVIE_PLAYER();

  document.body.removeAttribute('betteryt-mini');
  document.body.removeAttribute('betteryt-live');

  if (miniPlayerRootElement) {
    miniPlayerRootElement.removeAttribute('has-no-data');
    miniPlayerRootElement.removeAttribute('closed');
    miniPlayerRootElement.removeAttribute('active');
    miniPlayerRootElement.removeAttribute('enabled');
  }

  if (
    playerElement &&
    playerContainerElement &&
    playerElement.parentElement !== playerContainerElement
  )
    playerContainerElement.appendChild(playerElement);

  // Sponsorblock
  const sponsorBlockContainerElement = SELECTORS.SPONSOR_BLOCK.CONTAINER();
  const playerProgressBarContainerElement =
    SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER();
  if (
    sponsorBlockContainerElement &&
    playerProgressBarContainerElement &&
    sponsorBlockContainerElement.parentElement !==
      playerProgressBarContainerElement
  )
    playerProgressBarContainerElement.appendChild(sponsorBlockContainerElement);

  if (playerMoviePlayerElement) {
    playerMoviePlayerElement.classList.remove('ytp-player-minimized');
    playerMoviePlayerElement.classList.remove('ytp-small-mode');

    if (
      playerMoviePlayerElement.classList.contains('ytp-fullscreen') &&
      !playerMoviePlayerElement.classList.contains('ytp-big-mode')
    )
      playerMoviePlayerElement.classList.add('ytp-big-mode');
  }
}

function doPlayer() {
  const playerBoundsElement = SELECTORS.PLAYER.BOUNDS();
  const pageAppElement = SELECTORS.PAGE.APP();

  if (playerBoundsElement && pageAppElement) {
    if (
      window.scrollY >= playerBoundsElement.offsetHeight ||
      pageAppElement.scrollTop >= playerBoundsElement.offsetHeight
    ) {
      showMiniPlayer();
    } else {
      showFullPlayer();
    }
  }
}

function createMiniPlayer() {
  // progress bar for miniplayer
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'betteryt ytp-progress-bar-container';
  progressBarContainer.setAttribute('data-layer', '4');

  const progressBar = document.createElement('div');
  progressBar.className = 'betteryt ytp-progress-bar';
  progressBar.setAttribute('role', 'slider');

  let pointerDown = false;
  progressBar.addEventListener('pointerup', () => {
    pointerDown = false;
  });

  progressBar.addEventListener('pointerdown', (e) => {
    pointerDown = true;

    const miniPlayerRootElement = SELECTORS.MINI_PLAYER.ROOT();
    let miniPlayerContainerElement = SELECTORS.MINI_PLAYER.CONTAINER();
    const playerVideoElement = SELECTORS.PLAYER.VIDEO();

    if (miniPlayerRootElement?.hasAttribute('modern'))
      miniPlayerContainerElement = SELECTORS.MINI_PLAYER.MODERN.CONTAINER();

    if (miniPlayerContainerElement && playerVideoElement) {
      const x =
        e.clientX - miniPlayerContainerElement.getBoundingClientRect().x;

      playerVideoElement.currentTime =
        (x / miniPlayerContainerElement.offsetWidth) *
        playerVideoElement.duration;
    }

    updateProgressBar();
  });

  progressBar.addEventListener('pointerleave', () => {
    pointerDown = false;
  });

  progressBar.addEventListener('pointermove', (e) => {
    const miniPlayerRootElement = SELECTORS.MINI_PLAYER.ROOT();
    let miniPlayerContainerElement = SELECTORS.MINI_PLAYER.CONTAINER();
    const playerVideoElement = SELECTORS.PLAYER.VIDEO();

    if (miniPlayerRootElement?.hasAttribute('modern'))
      miniPlayerContainerElement = SELECTORS.MINI_PLAYER.MODERN.CONTAINER();

    if (pointerDown && miniPlayerContainerElement && playerVideoElement) {
      const x =
        e.clientX - miniPlayerContainerElement.getBoundingClientRect().x;

      playerVideoElement.currentTime =
        (x / miniPlayerContainerElement.offsetWidth) *
        playerVideoElement.duration;

      updateProgressBar();
    }
  });

  const chaptersContainer = document.createElement('div');
  chaptersContainer.className = 'betteryt ytp-chapters-container';

  const scrubberContainer = document.createElement('div');
  scrubberContainer.className = 'betteryt ytp-scrubber-container';

  const scrubberButton = document.createElement('div');
  scrubberButton.className =
    'betteryt ytp-scrubber-button ytp-swatch-background-color';

  const scrubberIndicator = document.createElement('div');
  scrubberIndicator.className = 'betteryt ytp-scrubber-pull-indicator';

  scrubberButton.appendChild(scrubberIndicator);
  scrubberContainer.appendChild(scrubberButton);

  progressBar.appendChild(chaptersContainer);
  progressBar.appendChild(scrubberContainer);
  progressBarContainer.appendChild(progressBar);

  // gradient for controls in miniplayer
  const gradientBottom = document.createElement('div');
  gradientBottom.className = 'betteryt ytp-gradient-bottom';

  const playerMoviePlayerElement = SELECTORS.PLAYER.MOVIE_PLAYER();
  if (playerMoviePlayerElement) {
    playerMoviePlayerElement.appendChild(progressBarContainer);
    playerMoviePlayerElement.appendChild(gradientBottom);
  }

  createChapters();

  // scroll up when clicking info bar
  const miniPlayerRootElement = SELECTORS.MINI_PLAYER.ROOT();
  let miniPlayerInfoBarElement = SELECTORS.MINI_PLAYER.INFO_BAR();
  const pageAppElement = SELECTORS.PAGE.APP();

  if (miniPlayerRootElement?.hasAttribute('modern'))
    miniPlayerInfoBarElement = SELECTORS.MINI_PLAYER.MODERN.INFO_BAR();

  if (miniPlayerInfoBarElement && pageAppElement) {
    miniPlayerInfoBarElement.addEventListener('click', () => {
      if (Helper.getUrl().pathname.startsWith('/watch')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        pageAppElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

function createChapters() {
  const betterMiniPlayerChaptersContainerElement =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();
  const playerChaptersContainerElement =
    SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();
  const playerControlsContainerElement = SELECTORS.PLAYER.CONTROLS.CONTAINER();

  const miniPlayerRootElement = SELECTORS.MINI_PLAYER.ROOT();
  let miniPlayerContainerElement = SELECTORS.MINI_PLAYER.CONTAINER();

  if (miniPlayerRootElement?.hasAttribute('modern'))
    miniPlayerContainerElement = SELECTORS.MINI_PLAYER.MODERN.CONTAINER();

  if (
    !betterMiniPlayerChaptersContainerElement ||
    !playerChaptersContainerElement ||
    !playerControlsContainerElement ||
    !miniPlayerContainerElement
  )
    return;

  while (betterMiniPlayerChaptersContainerElement.firstChild) {
    betterMiniPlayerChaptersContainerElement.removeChild(
      betterMiniPlayerChaptersContainerElement.firstChild
    );
  }

  for (const i of Array.from(
    playerChaptersContainerElement.children
  ) as HTMLElement[]) {
    const chapter = document.createElement('div');
    chapter.className =
      'betteryt ytp-chapter-hover-container ytp-exp-chapter-hover-container';

    chapter.style.width =
      Math.round(
        (parseInt(i.style.width.replace('px', '')) /
          playerControlsContainerElement.offsetWidth) *
          miniPlayerContainerElement.offsetWidth
      ) + 'px';

    if (
      i.style.marginRight &&
      playerChaptersContainerElement.childElementCount > 1
    ) {
      chapter.style.marginRight = '2px';
    }

    const chapterProgressPadding = document.createElement('div');
    chapterProgressPadding.className = 'betteryt ytp-progress-bar-padding';
    chapterProgressPadding.style.height = '5px';

    const chapterProgressList = document.createElement('div');
    chapterProgressList.className = 'betteryt ytp-progress-list';

    const chapterPlayProgress = document.createElement('div');
    chapterPlayProgress.className =
      'betteryt ytp-play-progress ytp-swatch-background-color';
    chapterPlayProgress.style.left = (
      i.children[1].children[0] as HTMLElement
    ).style.left;
    chapterPlayProgress.style.transform = (
      i.children[1].children[0] as HTMLElement
    ).style.transform;

    chapterProgressList.appendChild(chapterPlayProgress);
    chapter.appendChild(chapterProgressPadding);
    chapter.appendChild(chapterProgressList);
    betterMiniPlayerChaptersContainerElement.appendChild(chapter);
  }

  function findWidth() {
    let totalWidth = 0;

    if (
      !betterMiniPlayerChaptersContainerElement ||
      !miniPlayerContainerElement
    )
      return;

    for (const i of Array.from(
      betterMiniPlayerChaptersContainerElement.children
    ) as HTMLElement[]) {
      totalWidth += parseFloat(i.style.width.replace('px', ''));

      if (i.style.marginRight) {
        totalWidth += parseInt(i.style.marginRight.replace('px', ''));
      }
    }

    for (const i of Array.from(
      betterMiniPlayerChaptersContainerElement.children
    ) as HTMLElement[]) {
      if (
        totalWidth > miniPlayerContainerElement.offsetWidth &&
        parseFloat(i.style.width.replace('px', '')) > 0
      ) {
        i.style.width = parseFloat(i.style.width.replace('px', '')) - 1 + 'px';
        totalWidth -= 1;
      }
    }

    if (totalWidth > miniPlayerContainerElement.offsetWidth) {
      findWidth();
    }

    return totalWidth;
  }

  const finalWidth = findWidth() ?? 0;

  // check if createChapters() was called before chapters were ready for inspection and if so, call it again until it is ready
  if (finalWidth < miniPlayerContainerElement.offsetWidth) {
    setTimeout(() => {
      createChapters();
    });
  }
}

function updateProgressBar() {
  const playerVideoElement = SELECTORS.PLAYER.VIDEO();
  const miniPlayerRootElement = SELECTORS.MINI_PLAYER.ROOT();
  let miniPlayerContainerElement = SELECTORS.MINI_PLAYER.CONTAINER();
  const betterMiniPlayerScrubberContainerElement =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER();
  const betterMiniPlayerChaptersContainerElement =
    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER();

  if (miniPlayerRootElement?.hasAttribute('modern'))
    miniPlayerContainerElement = SELECTORS.MINI_PLAYER.MODERN.CONTAINER();

  if (
    !playerVideoElement ||
    !miniPlayerContainerElement ||
    !betterMiniPlayerScrubberContainerElement ||
    !betterMiniPlayerChaptersContainerElement
  )
    return;

  const newX =
    (playerVideoElement.currentTime / playerVideoElement.duration) *
    miniPlayerContainerElement.offsetWidth;

  betterMiniPlayerScrubberContainerElement.style.transform =
    'translateX(' + newX + 'px)';

  let width = 0;
  for (const i of Array.from(
    betterMiniPlayerChaptersContainerElement.children
  ) as HTMLElement[]) {
    const chapterElement = i.children[1].children[0] as HTMLElement;
    width += parseInt(i.style.width.replace('px', ''));

    if (i.style.marginRight) {
      width += parseInt(i.style.marginRight.replace('px', ''));
    }

    if (newX >= width) {
      chapterElement.style.transform = 'scaleX(1)';
    } else {
      const equation =
        1 - (width - newX) / parseInt(i.style.width.replace('px', ''));
      chapterElement.style.transform =
        'scaleX(' + (equation > 0 ? equation : 0) + ')';
    }
  }
}

window.addEventListener('scroll', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    doPlayer();
  }
});

const pageAppElementListener = SELECTORS.PAGE.APP();
if (pageAppElementListener)
  pageAppElementListener.addEventListener('scroll', () => {
    if (Helper.getUrl().pathname.startsWith('/watch')) {
      doPlayer();
    }
  });

window.addEventListener('resize', () => {
  const playerMoviePlayerElement = SELECTORS.PLAYER.MOVIE_PLAYER();
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    if (
      playerMoviePlayerElement &&
      playerMoviePlayerElement.ariaLabel &&
      !playerMoviePlayerElement.ariaLabel.includes('Fullscreen')
    ) {
      doPlayer();
    }
  }
});

// this is needed to solve strange bug where sometimes video does not maximize fully when expanding from mini player
window.addEventListener('onPageChange', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    Helper.onElementsLoad([
      SELECTORS.RAW.PLAYER.VIDEO,
      SELECTORS.RAW.MINI_PLAYER.CONTAINER,
      SELECTORS.RAW.MINI_PLAYER.MODERN.CONTAINER,
      SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER,
      SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
    ]).then(() => {
      doPlayer();
      createChapters();
    });
  } else {
    document.body.removeAttribute('betteryt-mini');
    document.body.removeAttribute('betteryt-live');
  }
});

// 'onViewModeChange' is needed to fix problem where exiting fullscreen when in mini player does not auto expand
window.addEventListener('onViewModeChange', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    doPlayer();
  }
});

Helper.onElementsLoad([
  SELECTORS.RAW.PLAYER.VIDEO,
  SELECTORS.RAW.MINI_PLAYER.CONTAINER,
  SELECTORS.RAW.MINI_PLAYER.MODERN.CONTAINER,
  SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
  SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER,
]).then(() => {
  createMiniPlayer();

  const playerVideoElement = SELECTORS.PLAYER.VIDEO();
  if (playerVideoElement)
    playerVideoElement.addEventListener('timeupdate', () => {
      const betterMiniPlayerScrubberContainerElement =
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER();
      const betterMiniPlayerSliderElement =
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER();

      if (
        betterMiniPlayerScrubberContainerElement &&
        betterMiniPlayerSliderElement
      ) {
        betterMiniPlayerSliderElement.setAttribute('aria-valuemin', '0');
        betterMiniPlayerSliderElement.setAttribute(
          'aria-valuemax',
          playerVideoElement.duration.toString()
        );
        betterMiniPlayerSliderElement.setAttribute(
          'aria-valuenow',
          playerVideoElement.currentTime.toString()
        );

        updateProgressBar();
      }
    });

  // this is used to update mini player chapters as the chapters on progress bar take a second to appear
  Helper.onChildElementChange(
    SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
    () => {
      if (Helper.getUrl().pathname.startsWith('/watch')) {
        doPlayer();
        createChapters();
      }
    }
  );

  // this is to fix mini player title as on first load it will add another string node
  Helper.onChildElementChange(SELECTORS.RAW.MINI_PLAYER.TITLE, () => {
    const miniPlayerTitleElement = SELECTORS.MINI_PLAYER.TITLE();
    if (
      miniPlayerTitleElement &&
      miniPlayerTitleElement.childNodes.length >= 2 &&
      miniPlayerTitleElement.lastChild
    ) {
      miniPlayerTitleElement.textContent =
        miniPlayerTitleElement.lastChild.textContent;
    }
  });

  // this is to fix mini player channel as on first load it will add another string node
  Helper.onChildElementChange(SELECTORS.RAW.MINI_PLAYER.CHANNEL, () => {
    const miniPlayerChannelElement = SELECTORS.MINI_PLAYER.CHANNEL();
    if (
      miniPlayerChannelElement &&
      miniPlayerChannelElement.childNodes.length >= 2 &&
      miniPlayerChannelElement.lastChild
    ) {
      miniPlayerChannelElement.textContent =
        miniPlayerChannelElement.lastChild.textContent;
    }
  });

  // this is to stop the playlist from showing up in the mini player
  Helper.onAttributeChange(
    SELECTORS.RAW.MINI_PLAYER.ROOT,
    () => {
      if (Helper.getUrl().pathname.startsWith('/watch')) {
        doPlayer();
      }
    },
    {
      attributes: true,
      attributeFilter: ['has-playlist-data', 'expanded'],
    }
  );
});
