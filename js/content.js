class Helper {
  static onElementLoad(selectorRaw) {
    return new Promise((resolve) => {
      if (document.querySelector(selectorRaw)) {
        return resolve(document.querySelector(selectorRaw));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selectorRaw)) {
          observer.disconnect();
          resolve(document.querySelector(selectorRaw));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  static onElementsLoad(selectorList) {
    let ready = 0;
    return new Promise((resolve) => {
      function isReady() {
        if (ready === selectorList.length) {
          resolve();
        }
      }

      for (const selectorRaw of selectorList) {
        if (document.querySelector(selectorRaw)) {
          ready++;
          isReady();
        } else {
          const observer = new MutationObserver(() => {
            if (document.querySelector(selectorRaw)) {
              observer.disconnect();
              ready++;
              isReady();
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      }
    });
  }

  static onAttributeChange(
    selectorRaw,
    callback,
    settings = { attributes: true }
  ) {
    Helper.onElementLoad(selectorRaw).then(() => {
      const observer = new MutationObserver((mutationsList) => {
        callback(observer, mutationsList);
      });

      observer.observe(document.querySelector(selectorRaw), settings);
    });
  }

  static onChildElementChange(
    selectorRaw,
    callback,
    settings = {
      childList: true,
    }
  ) {
    Helper.onElementLoad(selectorRaw).then(() => {
      const observer = new MutationObserver((mutationsList) => {
        callback(observer, mutationsList);
      });

      observer.observe(document.querySelector(selectorRaw), settings);
    });
  }

  static fitResolution(boundingElement, aspectRatio) {
    let top = 0;
    let left = 0;
    let width = boundingElement.offsetHeight * aspectRatio;
    let height = boundingElement.offsetHeight;
    if (width > boundingElement.offsetWidth) {
      const ratio = width / boundingElement.offsetWidth;
      width = width / ratio;
      height = height / ratio;
      top = (boundingElement.offsetHeight - height) / 2;
    } else if (width < boundingElement.offsetWidth) {
      left = (boundingElement.offsetWidth - width) / 2;
    }

    return [top, left, width, height];
  }

  static abbreviateNumber(num) {
    const abbrev = ['K', 'M', 'B', 'T'];

    function round(n, precision) {
      const prec = Math.pow(10, precision);
      return Math.round(n * prec) / prec;
    }

    let base = Math.floor(Math.log(Math.abs(num)) / Math.log(1000));
    const suffix = abbrev[Math.min(2, base - 1)];
    base = abbrev.indexOf(suffix) + 1;
    return suffix ? round(num / Math.pow(1000, base), 0) + suffix : '' + num;
  }

  static isTheater() {
    return (
      SELECTORS.PAGE.WATCH_FLEXY().hasAttribute('theater') &&
      !this.isFullscreen() &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isFullscreen() {
    return (
      SELECTORS.PAGE.WATCH_FLEXY().hasAttribute('fullscreen') &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isLive() {
    return (
      SELECTORS.CHAT.SHOW_HIDE() !== null &&
      SELECTORS.PLAYER.CONTROLS.LIVE() !== null &&
      currentURL.pathname.startsWith('/watch')
    );
  }
}

SELECTORS = {
  RAW: {
    PAGE: {
      WATCH_FLEXY: 'ytd-watch-flexy',
      APP: 'ytd-app',
    },
    CHAT: {
      CHAT: '#chat',
      SHOW_HIDE: '#show-hide-button',
      OPEN_BUTTON:
        '#show-hide-button > ytd-toggle-button-renderer > a > tp-yt-paper-button > #text',
      REPLAY:
        '#chat > #item-list > yt-live-chat-item-list-renderer > #contents > #item-scroller > #item-offset > #items > yt-live-chat-viewer-engagement-message-renderer > #id > #content > #message',
      BODY: ['#chatframe', 'body'],
    },
    PLAYER: {
      PLAYER: '#ytd-player',
      MOVIE_PLAYER: '#movie_player',
      TITLE: 'h1.title.ytd-video-primary-info-renderer > yt-formatted-string',
      CHANNEL:
        '#channel-name.ytd-video-owner-renderer > #container > #text-container > #text > a',
      DISLIKE: 'yt-formatted-string.ytd-toggle-button-renderer',
      CONTAINER: '#player-container.ytd-watch-flexy',
      DEFAULT_CONTAINER: '#player-container-inner',
      THEATER_CONTAINER: '#player-theater-container',
      BOUNDS: '#player-container-inner, #player-theater-container',
      VIDEO: '#movie_player > div.html5-video-container > video',
      GRADIENT_TOP: '.ytp-gradient-top',
      GRADIENT_BOTTOM: '.ytp-gradient-bottom',
      CONTROLS: {
        TO_HIDE: [
          '.ytp-chrome-top',
          '.ytp-iv-player-content',
          'a[aria-label*="Previous"]',
          'a[aria-label*="Next"]',
          'div[class="ytp-chapter-container"]',
          'button[aria-label*="Autoplay"]',
          'button[aria-label*="Subtitles"]',
          'button[aria-label*="Settings"]',
          'button[aria-label*="Switch camera"]',
          'button[aria-label*="Theater mode (t)"]',
          'button[aria-label*="Play on TV"]',
          'button[aria-label*="AirPlay"]',
          'button[title*="Full screen"]',
          '#ytp-caption-window-container',
        ],
        CONTAINER: '#movie_player > div.ytp-chrome-bottom',
        CONTROLS: '.ytp-chrome-controls',
        PROGRESS_BAR: {
          CONTAINER: '.ytp-chrome-bottom .ytp-progress-bar-container',
          CHAPTERS: {
            CONTAINER: '.ytp-chapters-container',
          },
          SCRUBBER: {
            CONTAINER: '.ytp-scrubber-container',
          },
        },
        FULLSCREEN: 'button[title*=" screen (f)"]',
        THEATER: 'button[aria-label*="(t)"]',
        LIVE: '.ytp-live-badge.ytp-button',
      },
    },
    MINI_PLAYER: {
      ROOT: 'ytd-miniplayer',
      CONTAINER: '#player-container.ytd-miniplayer',
      TITLE: '.miniplayer-title',
      CHANNEL: '#owner-name.ytd-miniplayer',
    },
    RELATED: '#related',
    COMMENTS: '#comments',
    PLAYLIST: '#secondary-inner > #playlist',
    COLUMN_LEFT: '#primary-inner',
    COLUMN_RIGHT: '#secondary-inner',
    BETTERYT: {
      MINI_PLAYER: {
        CONTROLS: {
          PROGRESS_BAR: {
            CONTAINER: '.betteryt.ytp-progress-bar-container',
            SLIDER: '.betteryt.ytp-progress-bar',
            CHAPTERS: {
              CONTAINER: '.betteryt.ytp-chapters-container',
            },
            SCRUBBER: {
              CONTAINER: '.betteryt.ytp-scrubber-container',
            },
          },
        },
        GRADIENT_BOTTOM: '.betteryt.ytp-gradient-bottom',
      },
    },
  },
  PAGE: {
    WATCH_FLEXY: () => document.querySelector(SELECTORS.RAW.PAGE.WATCH_FLEXY),
    APP: () => document.querySelector(SELECTORS.RAW.PAGE.APP),
  },
  CHAT: {
    CHAT: () => document.querySelector(SELECTORS.RAW.CHAT.CHAT),
    SHOW_HIDE: () => document.querySelector(SELECTORS.RAW.CHAT.SHOW_HIDE),
    OPEN_BUTTON: () => document.querySelector(SELECTORS.RAW.CHAT.OPEN_BUTTON),
    REPLAY: () => document.querySelector(SELECTORS.RAW.CHAT.REPLAY),
    BODY: () =>
      document
        .querySelector(SELECTORS.RAW.CHAT.BODY[0])
        .contentDocument.querySelector(SELECTORS.RAW.CHAT.BODY[1]),
  },
  PLAYER: {
    PLAYER: () => document.querySelector(SELECTORS.RAW.PLAYER.PLAYER),
    MOVIE_PLAYER: () =>
      document.querySelector(SELECTORS.RAW.PLAYER.MOVIE_PLAYER),
    TITLE: () => document.querySelector(SELECTORS.RAW.PLAYER.TITLE),
    CHANNEL: () => document.querySelector(SELECTORS.RAW.PLAYER.CHANNEL),
    DISLIKE: () => document.querySelectorAll(SELECTORS.RAW.PLAYER.DISLIKE)[1],
    CONTAINER: () => document.querySelector(SELECTORS.RAW.PLAYER.CONTAINER),
    DEFAULT_CONTAINER: () =>
      document.querySelector(SELECTORS.RAW.PLAYER.DEFAULT_CONTAINER),
    THEATER_CONTAINER: () =>
      document.querySelector(SELECTORS.RAW.PLAYER.THEATER_CONTAINER),
    BOUNDS: () => {
      for (const selector of document.querySelectorAll(
        SELECTORS.RAW.PLAYER.BOUNDS
      )) {
        if (selector.offsetHeight > 0) {
          return selector;
        }
      }
    },
    VIDEO: () => document.querySelector(SELECTORS.RAW.PLAYER.VIDEO),
    GRADIENT_TOP: () =>
      document.querySelector(SELECTORS.RAW.PLAYER.GRADIENT_TOP),
    GRADIENT_BOTTOM: () =>
      document.querySelector(SELECTORS.RAW.PLAYER.GRADIENT_BOTTOM),
    CONTROLS: {
      TO_HIDE: () => SELECTORS.RAW.PLAYER.CONTROLS.TO_HIDE,
      CONTAINER: () =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.CONTAINER),
      CONTROLS: () =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.CONTROLS),
      PROGRESS_BAR: {
        CONTAINER: () =>
          document.querySelector(
            SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER
          ),
        CHAPTERS: {
          CONTAINER: () =>
            document.querySelector(
              SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER
            ),
        },
        SCRUBBER: {
          CONTAINER: () =>
            document.querySelector(
              SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER
            ),
        },
      },
      FULLSCREEN: () =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.FULLSCREEN),
      THEATER: () =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.THEATER),
      LIVE: () => document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.LIVE),
    },
  },
  MINI_PLAYER: {
    ROOT: () => document.querySelector(SELECTORS.RAW.MINI_PLAYER.ROOT),
    CONTAINER: () =>
      document.querySelector(SELECTORS.RAW.MINI_PLAYER.CONTAINER),
    TITLE: () => document.querySelector(SELECTORS.RAW.MINI_PLAYER.TITLE),
    CHANNEL: () => document.querySelector(SELECTORS.RAW.MINI_PLAYER.CHANNEL),
  },
  RELATED: () => document.querySelector(SELECTORS.RAW.RELATED),
  COMMENTS: () => document.querySelector(SELECTORS.RAW.COMMENTS),
  PLAYLIST: () => document.querySelector(SELECTORS.RAW.PLAYLIST),
  COLUMN_LEFT: () => document.querySelector(SELECTORS.RAW.COLUMN_LEFT),
  COLUMN_RIGHT: () => document.querySelector(SELECTORS.RAW.COLUMN_RIGHT),
  BETTERYT: {
    MINI_PLAYER: {
      CONTROLS: {
        PROGRESS_BAR: {
          CONTAINER: () =>
            document.querySelector(
              SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER
            ),
          SLIDER: () =>
            document.querySelector(
              SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER
            ),
          CHAPTERS: {
            CONTAINER: () =>
              document.querySelector(
                SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR
                  .CHAPTERS.CONTAINER
              ),
          },
          SCRUBBER: {
            CONTAINER: () =>
              document.querySelector(
                SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR
                  .SCRUBBER.CONTAINER
              ),
          },
        },
      },
      GRADIENT_BOTTOM: () =>
        document.querySelector(
          SELECTORS.RAW.BETTERYT.MINI_PLAYER.GRADIENT_BOTTOM
        ),
    },
  },
};

MiniPlayer = () => {
  function showMiniPlayer() {
    if (!document.body.hasAttribute('betteryt-mini'))
      document.body.setAttribute('betteryt-mini', '');

    if (
      SELECTORS.PLAYER.PLAYER().parentElement !==
      SELECTORS.MINI_PLAYER.CONTAINER()
    )
      SELECTORS.MINI_PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());

    SELECTORS.MINI_PLAYER.TITLE().textContent =
      SELECTORS.PLAYER.TITLE().textContent;
    SELECTORS.MINI_PLAYER.CHANNEL().textContent =
      SELECTORS.PLAYER.CHANNEL().textContent;

    if (!SELECTORS.MINI_PLAYER.ROOT().hasAttribute('enabled'))
      SELECTORS.MINI_PLAYER.ROOT().setAttribute('enabled', '');
    if (!SELECTORS.MINI_PLAYER.ROOT().hasAttribute('active'))
      SELECTORS.MINI_PLAYER.ROOT().setAttribute('active', '');

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
    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('has-no-data');
    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('closed');

    if (
      SELECTORS.PLAYER.PLAYER().parentElement !== SELECTORS.PLAYER.CONTAINER()
    )
      SELECTORS.PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());

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

      if (i.style.marginRight) {
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
        if (totalWidth > SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth) {
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
  window.addEventListener('onUrlChange', () => {
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
    }
  });

  // 'onViewModeChange' is needed to fix problem where exiting fullscreen when in mini player does not auto expand
  window.addEventListener('onViewModeChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      doPlayer();
    }
  });

  // wait for changes to the video so we can check if video aspect ratio changes
  Helper.onElementsLoad([
    SELECTORS.RAW.PAGE.WATCH_FLEXY,
    SELECTORS.RAW.MINI_PLAYER.CONTAINER,
  ]).then(() => {
    Helper.onAttributeChange(
      SELECTORS.RAW.PAGE.WATCH_FLEXY,
      () => {
        if (currentURL.pathname.startsWith('/watch')) {
          const videoWidth = getComputedStyle(
            SELECTORS.PAGE.WATCH_FLEXY()
          ).getPropertyValue('--ytd-watch-flexy-width-ratio');
          const videoHeight = getComputedStyle(
            SELECTORS.PAGE.WATCH_FLEXY()
          ).getPropertyValue('--ytd-watch-flexy-height-ratio');

          const [top, left, width, height] = Helper.fitResolution(
            SELECTORS.MINI_PLAYER.CONTAINER(),
            videoWidth / videoHeight
          );

          document.body.style.setProperty('--mini-video-top', top + 'px');
          document.body.style.setProperty('--mini-video-left', left + 'px');
          document.body.style.setProperty('--mini-video-width', width + 'px');
          document.body.style.setProperty('--mini-video-height', height + 'px');

          // WILL NOT WORK IF MINI PLAYER IS DISABLED IN SETTINGS
          SELECTORS.PAGE.APP().style.setProperty(
            '--ytd-app-fullerscreen-scrollbar-width',
            getComputedStyle(SELECTORS.PAGE.WATCH_FLEXY()).getPropertyValue(
              '--ytd-watch-flexy-scrollbar-width'
            )
          );
        }
      },
      { attributes: true, attributeFilter: ['style'] }
    );
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

NewComments = () => {
  function handleComments() {
    if (window.innerWidth < 1014) {
      document.body.removeAttribute('betteryt-comments-fixed');
      if (SELECTORS.RELATED().parentElement !== SELECTORS.COLUMN_LEFT())
        SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.RELATED());

      if (SELECTORS.COMMENTS().parentElement !== SELECTORS.COLUMN_LEFT())
        SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.COMMENTS());
    } else {
      if (!Helper.isTheater() && !Helper.isFullscreen() && !Helper.isLive()) {
        if (!document.body.hasAttribute('betteryt-comments-fixed'))
          document.body.setAttribute('betteryt-comments-fixed', '');

        if (SELECTORS.COMMENTS().parentElement !== SELECTORS.COLUMN_RIGHT())
          SELECTORS.COLUMN_RIGHT().appendChild(SELECTORS.COMMENTS());

        if (SELECTORS.RELATED().parentElement !== SELECTORS.COLUMN_LEFT())
          SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.RELATED());
      } else {
        document.body.removeAttribute('betteryt-comments-fixed');
      }
    }
  }

  window.addEventListener('resize', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      handleComments();
    }
  });

  window.addEventListener('onViewModeChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      handleComments();
    }
  });

  window.addEventListener('onUrlChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      handleComments();
    }
  });

  if (currentURL.pathname.startsWith('/watch')) {
    Helper.onElementsLoad([
      SELECTORS.RAW.COMMENTS,
      SELECTORS.RAW.RELATED,
      SELECTORS.RAW.COLUMN_LEFT,
      SELECTORS.RAW.COLUMN_RIGHT,
    ]).then(() => {
      handleComments();
    });
  }
};

ReturnDislikes = () => {
  function updateDislikes() {
    Helper.onElementLoad(SELECTORS.RAW.PLAYER.DISLIKE).then(() => {
      fetch(
        'https://returnyoutubedislikeapi.com/votes?videoId=' +
          currentURL.searchParams.get('v')
      )
        .then((response) => response.json())
        .then((data) => {
          SELECTORS.PLAYER.DISLIKE().textContent = Helper.abbreviateNumber(
            data.dislikes
          );
        });
    });
  }

  window.addEventListener('onUrlChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      updateDislikes();
    }
  });

  if (currentURL.pathname.startsWith('/watch')) {
    updateDislikes();
  }
};

LiveTheater = () => {
  function positionTheater() {
    if (Helper.isTheater() && Helper.isLive()) {
      if (
        document.querySelector('#chatframe').contentDocument.body &&
        document
          .querySelector('#chatframe')
          .contentDocument.body.hasChildNodes()
      ) {
        if (!document.body.hasAttribute('betteryt-theater'))
          document.body.setAttribute('betteryt-theater', '');

        if (
          SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains(
            'ytp-hide-info-bar'
          )
        )
          SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-hide-info-bar');

        document
          .querySelector('#chatframe')
          .contentDocument.querySelector('html')
          .setAttribute('dark', '');

        SELECTORS.PAGE.APP().setAttribute('scrolling', '');

        if (SELECTORS.PAGE.APP().scrollTop > 0) {
          SELECTORS.PAGE.APP().removeAttribute('masthead-hidden');
        } else {
          SELECTORS.PAGE.APP().setAttribute('masthead-hidden', '');
        }

        return true;
      } else {
        // this is done to wait until live chat is fully loaded in as otherwise, it will not get dark mode
        setTimeout(() => {
          if (positionTheater()) {
            window.dispatchEvent(new Event('resize'));
          }
        });

        return false;
      }
    } else {
      document.body.removeAttribute('betteryt-theater');

      if (
        !document.querySelector('html').hasAttribute('dark') &&
        document.querySelector('#chatframe') &&
        document
          .querySelector('#chatframe')
          .contentDocument.querySelector('html')
      )
        document
          .querySelector('#chatframe')
          .contentDocument.querySelector('html')
          .removeAttribute('dark');

      if (!Helper.isFullscreen()) {
        SELECTORS.PAGE.APP().removeAttribute('scrolling');
        SELECTORS.PAGE.APP().removeAttribute('masthead-hidden');

        if (
          !SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains(
            'ytp-hide-info-bar'
          )
        )
          SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-hide-info-bar');
      }
    }
  }

  window.addEventListener('resize', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      positionTheater();
    }
  });

  window.addEventListener('onViewModeChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      positionTheater();
    }
  });

  window.addEventListener('onUrlChange', () => {
    // if (currentURL.pathname.startsWith('/watch')) {
    positionTheater();
    // } else {
    // document.body.removeAttribute('betteryt-theater');
    // }
  });

  SELECTORS.PAGE.APP().addEventListener('scroll', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      positionTheater();
    }
  });

  if (currentURL.pathname.startsWith('/watch')) {
    Helper.onElementsLoad([
      SELECTORS.RAW.PLAYER.VIDEO,
      'ytd-live-chat-frame',
      '#chatframe',
    ]).then(() => {
      positionTheater();
    });
  }
};

// create url event
var currentURL = new URL(window.location.href);
setInterval(() => {
  if (currentURL.href !== window.location.href) {
    currentURL = new URL(window.location.href);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('onUrlChange', {
          detail: { url: currentURL },
        })
      );
    });
  }
}, 50);

// create miniplayer mode event
Helper.onAttributeChange(
  'body',
  () => {
    window.dispatchEvent(
      new CustomEvent('onToggleMiniplayer', {
        detail: {
          isMiniplayer: document.body.hasAttribute('betteryt-mini'),
        },
      })
    );

    window.dispatchEvent(new CustomEvent('onViewModeChange'));
    window.dispatchEvent(new Event('resize'));
  },
  { attributes: true, attributeFilter: ['betteryt-mini'] }
);

// create theater mode event
Helper.onChildElementChange(SELECTORS.RAW.PLAYER.BOUNDS, () => {
  if (!Helper.isFullscreen()) {
    window.dispatchEvent(
      new CustomEvent('onToggleTheater', {
        detail: {
          isTheater: Helper.isTheater(),
        },
      })
    );

    window.dispatchEvent(new CustomEvent('onViewModeChange'));
    window.dispatchEvent(new Event('resize'));
  }
});

// create fullscreen mode event
Helper.onAttributeChange(
  SELECTORS.RAW.PLAYER.MOVIE_PLAYER,
  () => {
    window.dispatchEvent(
      new CustomEvent('onToggleFullscreen', {
        detail: {
          isFullscreen: Helper.isFullscreen(),
        },
      })
    );

    window.dispatchEvent(new CustomEvent('onViewModeChange'));
    window.dispatchEvent(new Event('resize'));
  },
  { attributes: true, attributeFilter: ['aria-label'] }
);

// check what is enabled
chrome.storage.sync.get((data) => {
  if (data.miniPlayer) {
    MiniPlayer();
  }

  if (data.returnDislikes) {
    ReturnDislikes();
  }

  if (data.experimentalComments) {
    NewComments();
  }

  if (data.twitchTheater) {
    LiveTheater();
  }
});
