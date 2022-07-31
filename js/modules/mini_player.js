miniPlayer = () => {
  function showMiniPlayer() {
    if (!document.body.hasAttribute('betteryt-mini'))
      document.body.setAttribute('betteryt-mini', '');

    if (!document.body.hasAttribute('betteryt-live') && Helper.isLive())
      document.body.setAttribute('betteryt-live', '');

    if (
      SELECTORS.PLAYER.PLAYER().parentElement !==
      SELECTORS.MINI_PLAYER.CONTAINER()
    )
      SELECTORS.MINI_PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());

    // Sponsorblock
    if (
      SELECTORS.SPONSOR_BLOCK.CONTAINER() &&
      SELECTORS.SPONSOR_BLOCK.CONTAINER().parentElement !==
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER()
    )
      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER().appendChild(
        SELECTORS.SPONSOR_BLOCK.CONTAINER()
      );

    SELECTORS.MINI_PLAYER.TITLE().textContent =
      SELECTORS.PLAYER.TITLE().textContent;
    SELECTORS.MINI_PLAYER.CHANNEL().textContent =
      SELECTORS.PLAYER.CHANNEL().textContent;

    if (!SELECTORS.MINI_PLAYER.ROOT().hasAttribute('enabled'))
      SELECTORS.MINI_PLAYER.ROOT().setAttribute('enabled', '');
    if (!SELECTORS.MINI_PLAYER.ROOT().hasAttribute('active'))
      SELECTORS.MINI_PLAYER.ROOT().setAttribute('active', '');
    if (SELECTORS.MINI_PLAYER.ROOT().hasAttribute('has-playlist-data'))
      SELECTORS.MINI_PLAYER.ROOT().removeAttribute('has-playlist-data');
    if (SELECTORS.MINI_PLAYER.ROOT().hasAttribute('expanded'))
      SELECTORS.MINI_PLAYER.ROOT().removeAttribute('expanded');

    if (
      !SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains(
        'ytp-player-minimized'
      )
    )
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-player-minimized');

    if (!SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-small-mode'))
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-small-mode');

    if (SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-big-mode')) {
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-big-mode');
    }
  }

  function showFullPlayer() {
    document.body.removeAttribute('betteryt-mini');
    document.body.removeAttribute('betteryt-live');
    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('has-no-data');
    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('closed');

    if (
      SELECTORS.PLAYER.PLAYER().parentElement !== SELECTORS.PLAYER.CONTAINER()
    )
      SELECTORS.PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());

    // Sponsorblock
    if (
      SELECTORS.SPONSOR_BLOCK.CONTAINER() &&
      SELECTORS.SPONSOR_BLOCK.CONTAINER().parentElement !==
        SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER()
    )
      SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER().appendChild(
        SELECTORS.SPONSOR_BLOCK.CONTAINER()
      );

    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('active');
    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('enabled');
    SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-player-minimized');
    SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-small-mode');

    if (
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-fullscreen') &&
      !SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-big-mode')
    ) {
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-big-mode');
    }
  }

  function doPlayer() {
    if (SELECTORS.PLAYER.BOUNDS() && SELECTORS.PAGE.APP()) {
      if (
        window.scrollY >= SELECTORS.PLAYER.BOUNDS().offsetHeight ||
        SELECTORS.PAGE.APP().scrollTop >= SELECTORS.PLAYER.BOUNDS().offsetHeight
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
    progressBarContainer.classList = 'betteryt ytp-progress-bar-container';
    progressBarContainer.setAttribute('data-layer', '4');

    const progressBar = document.createElement('div');
    progressBar.classList = 'betteryt ytp-progress-bar';
    progressBar.setAttribute('role', 'slider');

    let pointerDown = false;
    progressBar.addEventListener('pointerup', () => {
      pointerDown = false;
    });
    progressBar.addEventListener('pointerdown', (e) => {
      pointerDown = true;

      const x =
        e.clientX - SELECTORS.MINI_PLAYER.CONTAINER().getBoundingClientRect().x;

      SELECTORS.PLAYER.VIDEO().currentTime =
        (x / SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth) *
        SELECTORS.PLAYER.VIDEO().duration;

      updateProgressBar();
    });
    progressBar.addEventListener('pointerleave', () => {
      pointerDown = false;
    });
    progressBar.addEventListener('pointermove', (e) => {
      if (pointerDown) {
        const x =
          e.clientX -
          SELECTORS.MINI_PLAYER.CONTAINER().getBoundingClientRect().x;

        SELECTORS.PLAYER.VIDEO().currentTime =
          (x / SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth) *
          SELECTORS.PLAYER.VIDEO().duration;

        updateProgressBar();
      }
    });

    const chaptersContainer = document.createElement('div');
    chaptersContainer.classList = 'betteryt ytp-chapters-container';

    const scrubberContainer = document.createElement('div');
    scrubberContainer.classList = 'betteryt ytp-scrubber-container';

    const scrubberButton = document.createElement('div');
    scrubberButton.classList =
      'betteryt ytp-scrubber-button ytp-swatch-background-color';

    const scrubberIndicator = document.createElement('div');
    scrubberIndicator.classList = 'betteryt ytp-scrubber-pull-indicator';

    scrubberButton.appendChild(scrubberIndicator);
    scrubberContainer.appendChild(scrubberButton);

    progressBar.appendChild(chaptersContainer);
    progressBar.appendChild(scrubberContainer);
    progressBarContainer.appendChild(progressBar);

    SELECTORS.PLAYER.MOVIE_PLAYER().appendChild(progressBarContainer);

    createChapters();

    // gradient for controls in miniplayer
    const gradientBottom = document.createElement('div');
    gradientBottom.classList = 'betteryt ytp-gradient-bottom';

    SELECTORS.PLAYER.MOVIE_PLAYER().appendChild(gradientBottom);

    // scroll up when clicking info bar
    SELECTORS.MINI_PLAYER.INFO_BAR().addEventListener('click', () => {
      if (currentURL.pathname.startsWith('/watch')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        SELECTORS.PAGE.APP().scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  function createChapters() {
    while (
      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
        .firstChild
    ) {
      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER().removeChild(
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
          .firstChild
      );
    }

    for (const i of SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
      .children) {
      const chapter = document.createElement('div');
      chapter.classList =
        'betteryt ytp-chapter-hover-container ytp-exp-chapter-hover-container';

      chapter.style.width =
        Math.round(
          (parseInt(i.style.width.replace('px', '')) /
            SELECTORS.PLAYER.CONTROLS.CONTAINER().offsetWidth) *
            SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth
        ) + 'px';

      if (
        i.style.marginRight &&
        SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
          .childElementCount > 1
      ) {
        chapter.style.marginRight = '2px';
      }

      const chapterProgressPadding = document.createElement('div');
      chapterProgressPadding.classList = 'betteryt ytp-progress-bar-padding';
      chapterProgressPadding.style.height = '5px';

      const chapterProgressList = document.createElement('div');
      chapterProgressList.classList = 'betteryt ytp-progress-list';

      const chapterPlayProgress = document.createElement('div');
      chapterPlayProgress.classList =
        'betteryt ytp-play-progress ytp-swatch-background-color';
      chapterPlayProgress.style.left = i.children[1].children[0].style.left;
      chapterPlayProgress.style.transform =
        i.children[1].children[0].style.transform;

      chapterProgressList.appendChild(chapterPlayProgress);
      chapter.appendChild(chapterProgressPadding);
      chapter.appendChild(chapterProgressList);
      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER().appendChild(
        chapter
      );
    }

    function findWidth() {
      let totalWidth = 0;

      for (const i of SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
        .children) {
        totalWidth += parseFloat(i.style.width.replace('px', ''));

        if (i.style.marginRight) {
          totalWidth += parseInt(i.style.marginRight.replace('px', ''));
        }
      }

      for (const i of SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
        .children) {
        if (
          totalWidth > SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth &&
          parseFloat(i.style.width.replace('px', '')) > 0
        ) {
          i.style.width =
            parseFloat(i.style.width.replace('px', '')) - 1 + 'px';
          totalWidth -= 1;
        }
      }

      if (totalWidth > SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth) {
        findWidth();
      }

      return totalWidth;
    }

    const finalWidth = findWidth();

    // check if createChapters() was called before chapters were ready for inspection and if so, call it again until it is ready
    if (
      isNaN(finalWidth) ||
      finalWidth < SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth
    ) {
      setTimeout(() => {
        createChapters();
      });
    }
  }

  function updateProgressBar() {
    const newX =
      (SELECTORS.PLAYER.VIDEO().currentTime /
        SELECTORS.PLAYER.VIDEO().duration) *
      SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth;

    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER().style.transform =
      'translateX(' + newX + 'px)';

    let width = 0;
    for (const i of SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
      .children) {
      const chapterElement = i.children[1].children[0];
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
    if (currentURL.pathname.startsWith('/watch')) {
      doPlayer();
    }
  });

  SELECTORS.PAGE.APP().addEventListener('scroll', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      doPlayer();
    }
  });

  window.addEventListener('resize', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      if (!SELECTORS.PLAYER.MOVIE_PLAYER().ariaLabel.includes('Fullscreen')) {
        doPlayer();
      }
    }
  });

  // this is needed to solve strange bug where sometimes video does not maximize fully when expanding from mini player
  window.addEventListener('onPageChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      Helper.onElementsLoad([
        SELECTORS.RAW.PLAYER.VIDEO,
        SELECTORS.RAW.MINI_PLAYER.CONTAINER,
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
    if (currentURL.pathname.startsWith('/watch')) {
      doPlayer();
    }
  });

  Helper.onElementsLoad([
    SELECTORS.RAW.PLAYER.VIDEO,
    SELECTORS.RAW.MINI_PLAYER.CONTAINER,
    SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
    SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER,
  ]).then(() => {
    createMiniPlayer();

    SELECTORS.PLAYER.VIDEO().addEventListener('timeupdate', () => {
      if (
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER()
      ) {
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER().setAttribute(
          'aria-valuemin',
          0
        );
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER().setAttribute(
          'aria-valuemax',
          SELECTORS.PLAYER.VIDEO().duration
        );
        SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER().setAttribute(
          'aria-valuenow',
          SELECTORS.PLAYER.VIDEO().currentTime
        );

        updateProgressBar();
      }
    });

    // this is used to update mini player chapters as the chapters on progress bar take a second to appear
    Helper.onChildElementChange(
      SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
      () => {
        doPlayer();
        createChapters();
      }
    );
  });
};

chrome.storage.sync.get(STORAGE_DEFAULT, (data) => {
  if (data.miniPlayer) {
    miniPlayer();
  }
});
