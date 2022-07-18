class Helper {
  static onElementLoad(selectorRaw) {
    return new Promise((resolve) => {
      if (document.querySelector(selectorRaw)) {
        return resolve(document.querySelector(selectorRaw));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selectorRaw)) {
          resolve(document.querySelector(selectorRaw));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  static onAttributeChange(selectorRaw, callback) {
    Helper.onElementLoad(selectorRaw).then(() => {
      const observer = new MutationObserver((mutationsList) => {
        callback(observer, mutationsList);
      });

      observer.observe(document.querySelector(selectorRaw), {
        attributes: true,
      });
    });
  }

  static onAttributeChangeSubtree(selectorRaw, callback) {
    Helper.onElementLoad(selectorRaw).then(() => {
      const observer = new MutationObserver((mutationsList) => {
        callback(observer, mutationsList);
      });

      observer.observe(document.querySelector(selectorRaw), {
        childList: true,
        subtree: true,
        attributes: true,
      });
    });
  }

  static onChildElementChange(selectorRaw, callback) {
    Helper.onElementLoad(selectorRaw).then(() => {
      const observer = new MutationObserver((mutationsList) => {
        callback(observer, mutationsList);
      });

      observer.observe(document.querySelector(selectorRaw), {
        childList: true,
      });
    });
  }

  static fitResolution(boundingElement, aspectRatio) {
    var top = 0;
    var left = 0;
    var width = boundingElement.offsetHeight * aspectRatio;
    var height = boundingElement.offsetHeight;
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
      var prec = Math.pow(10, precision);
      return Math.round(n * prec) / prec;
    }

    var base = Math.floor(Math.log(Math.abs(num)) / Math.log(1000));
    var suffix = abbrev[Math.min(2, base - 1)];
    base = abbrev.indexOf(suffix) + 1;
    return suffix ? round(num / Math.pow(1000, base), 0) + suffix : '' + num;
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
    },
  },
};

MiniPlayer = () => {
  var resRatio = null;

  function showMiniPlayer() {
    const player = SELECTORS.PLAYER.PLAYER();
    const playerV = SELECTORS.PLAYER.VIDEO();
    const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();

    player.style.width = SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth + 'px';
    player.style.height = SELECTORS.MINI_PLAYER.CONTAINER().offsetHeight + 'px';

    const [top, left, width, height] = Helper.fitResolution(
      SELECTORS.MINI_PLAYER.CONTAINER(),
      resRatio
    );

    playerV.style.top = top + 'px';
    playerV.style.left = left + 'px';
    playerV.style.width = width + 'px';
    playerV.style.height = height + 'px';

    playerControls.style.width =
      SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth -
      SELECTORS.PLAYER.CONTROLS.CONTAINER().offsetLeft * 2 +
      'px';

    SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER().setAttribute(
      'hidden',
      ''
    );

    for (const controlSelector of SELECTORS.RAW.PLAYER.CONTROLS.TO_HIDE) {
      const control = document.querySelector(controlSelector);
      if (control) {
        control.setAttribute('hidden', '');
      }
    }

    SELECTORS.MINI_PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());
    SELECTORS.MINI_PLAYER.TITLE().textContent =
      SELECTORS.PLAYER.TITLE().textContent;
    SELECTORS.MINI_PLAYER.CHANNEL().textContent =
      SELECTORS.PLAYER.CHANNEL().textContent;
    SELECTORS.MINI_PLAYER.ROOT().setAttribute('enabled', '');
    SELECTORS.MINI_PLAYER.ROOT().setAttribute('active', '');

    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER().removeAttribute(
      'hidden'
    );

    if (
      !SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains(
        'ytp-player-minimized'
      ) ||
      !SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-small-mode')
    ) {
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-player-minimized');
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-small-mode');

      if (SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-big-mode')) {
        SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-big-mode');
        SELECTORS.PLAYER.GRADIENT_TOP().setAttribute('hidden', '');
        SELECTORS.PLAYER.GRADIENT_BOTTOM().setAttribute('hidden', '');
      }
    }
  }

  function showFullPlayer() {
    const player = SELECTORS.PLAYER.PLAYER();
    const playerV = SELECTORS.PLAYER.VIDEO();
    const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();
    player.removeAttribute('style');

    const [top, left, width, height] = Helper.fitResolution(
      SELECTORS.PLAYER.PLAYER(),
      resRatio
    );

    playerV.style.top = top + 'px';
    playerV.style.left = left + 'px';
    playerV.style.width = width + 'px';
    playerV.style.height = height + 'px';
    playerControls.style.width =
      SELECTORS.PLAYER.CONTAINER().offsetWidth -
      SELECTORS.PLAYER.CONTROLS.CONTAINER().offsetLeft * 2 +
      'px';
    SELECTORS.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER().removeAttribute(
      'hidden'
    );
    for (const controlSelector of SELECTORS.RAW.PLAYER.CONTROLS.TO_HIDE) {
      const control = document.querySelector(controlSelector);
      if (control) {
        control.removeAttribute('hidden');
      }
    }

    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('active');
    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('enabled');
    SELECTORS.PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());

    if (
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains(
        'ytp-player-minimized'
      ) ||
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-small-mode')
    ) {
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-player-minimized');
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-small-mode');

      if (
        SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-fullscreen') &&
        !SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-big-mode')
      ) {
        SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-big-mode');
        if (
          SELECTORS.PLAYER.GRADIENT_TOP().hasAttribute('hidden') ||
          SELECTORS.PLAYER.GRADIENT_BOTTOM().hasAttribute('hidden')
        ) {
          SELECTORS.PLAYER.GRADIENT_TOP().removeAttribute('hidden');
          SELECTORS.PLAYER.GRADIENT_BOTTOM().removeAttribute('hidden');
        }
      }

      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER().setAttribute(
        'hidden',
        ''
      );
    }
  }

  function doPlayer() {
    // this check is to stop the player from breaking if doPlayer() is called before resRatio is ready
    if (SELECTORS.PLAYER.BOUNDS() && SELECTORS.PAGE.APP() && resRatio) {
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

  var pointerDown = false;
  function createProgressBar() {
    var progressBarContainer = document.createElement('div');
    progressBarContainer.classList = 'betteryt ytp-progress-bar-container';
    progressBarContainer.setAttribute('hidden', '');
    progressBarContainer.setAttribute('data-layer', '4');

    var progressBar = document.createElement('div');
    progressBar.classList = 'betteryt ytp-progress-bar';
    progressBar.setAttribute('role', 'slider');

    progressBar.addEventListener('pointerup', () => {
      pointerDown = false;
    });
    progressBar.addEventListener('pointerdown', (e) => {
      pointerDown = true;

      let x =
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
        let x =
          e.clientX -
          SELECTORS.MINI_PLAYER.CONTAINER().getBoundingClientRect().x;

        SELECTORS.PLAYER.VIDEO().currentTime =
          (x / SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth) *
          SELECTORS.PLAYER.VIDEO().duration;

        updateProgressBar();
      }
    });

    var chaptersContainer = document.createElement('div');
    chaptersContainer.classList = 'betteryt ytp-chapters-container';

    var scrubberContainer = document.createElement('div');
    scrubberContainer.classList = 'betteryt ytp-scrubber-container';

    var scrubberButton = document.createElement('div');
    scrubberButton.classList =
      'betteryt ytp-scrubber-button ytp-swatch-background-color';

    var scrubberIndicator = document.createElement('div');
    scrubberIndicator.classList = 'betteryt ytp-scrubber-pull-indicator';

    scrubberButton.appendChild(scrubberIndicator);
    scrubberContainer.appendChild(scrubberButton);

    progressBar.appendChild(chaptersContainer);
    progressBar.appendChild(scrubberContainer);
    progressBarContainer.appendChild(progressBar);

    SELECTORS.PLAYER.MOVIE_PLAYER().appendChild(progressBarContainer);

    createChapters();
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
      let chapter = document.createElement('div');
      chapter.classList =
        'betteryt ytp-chapter-hover-container ytp-exp-chapter-hover-container';

      chapter.style.width =
        Math.round(
          (parseInt(i.style.width.replace('px', '')) /
            parseInt(
              SELECTORS.PLAYER.CONTROLS.CONTROLS().style.width.replace('px', '')
            )) *
            SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth
        ) + 'px';

      if (i.style.marginRight) {
        chapter.style.marginRight = '2px';
      }

      let chapterProgressPadding = document.createElement('div');
      chapterProgressPadding.classList = 'betteryt ytp-progress-bar-padding';

      let chapterProgressList = document.createElement('div');
      chapterProgressList.classList = 'betteryt ytp-progress-list';

      let chapterPlayProgress = document.createElement('div');
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
    }

    findWidth();
  }

  function updateProgressBar() {
    let newX =
      (SELECTORS.PLAYER.VIDEO().currentTime /
        SELECTORS.PLAYER.VIDEO().duration) *
      SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth;

    SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER().style.transform =
      'translateX(' + newX + 'px)';

    let width = 0;
    for (const i of SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER()
      .children) {
      let chapterElement = i.children[1].children[0];
      width += parseInt(i.style.width.replace('px', ''));

      if (i.style.marginRight) {
        width += parseInt(i.style.marginRight.replace('px', ''));
      }

      if (newX >= width) {
        chapterElement.style.transform = 'scaleX(1)';
      } else {
        let equation =
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
      Helper.onElementLoad(SELECTORS.RAW.PLAYER.VIDEO).then(() => {
        doPlayer();
        createChapters();
      });
    } else {
      SELECTORS.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER().setAttribute(
        'hidden',
        ''
      );
    }
  });

  // 'onViewModeChange' is needed to fix problem where exiting fullscreen when in mini player does not auto expand
  window.addEventListener('onViewModeChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      doPlayer();
    }
  });

  // wait for changes to the video so we can check if video aspect ratio changes
  Helper.onAttributeChange(SELECTORS.RAW.PLAYER.VIDEO, () => {
    if (currentURL.pathname.startsWith('/watch')) {
      resRatio =
        SELECTORS.PLAYER.VIDEO().offsetWidth /
        SELECTORS.PLAYER.VIDEO().offsetHeight;
    }
  });

  Helper.onElementLoad(SELECTORS.RAW.PLAYER.VIDEO).then(() => {
    createProgressBar();

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
  });

  Helper.onAttributeChangeSubtree(
    SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER,
    (_, e) => {
      let toUpdate = false;
      for (const i of e) {
        if (
          i.attributeName === 'style' &&
          i.target.classList[0].includes('chapter') &&
          i.target.style.width !== '100%'
        ) {
          toUpdate = true;
        }
      }

      if (toUpdate) {
        doPlayer();
        createChapters();
      }
    }
  );
};

NewComments = () => {
  var currentState = 'default';

  var el = document.createElement('div');
  el.style.overflow = 'auto';
  el.style.position = 'fixed';
  el.setAttribute('hidden', '');

  function showDefaultComments() {
    SELECTORS.COLUMN_RIGHT().appendChild(SELECTORS.RELATED());
    SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.COMMENTS());

    el.setAttribute('hidden', '');
    currentState = 'default';
  }

  function showNewComments() {
    SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.RELATED());

    el.appendChild(SELECTORS.COMMENTS());
    SELECTORS.COLUMN_RIGHT().appendChild(el);
    el.removeAttribute('hidden');
    currentState = 'new';
  }

  function resizeUpdate() {
    el.style.width = SELECTORS.COLUMN_RIGHT().offsetWidth + 'px';

    // check if we are in theater mode, fullscreen, or a live chat replay is expanded
    if (
      SELECTORS.PLAYER.THEATER_CONTAINER().hasChildNodes() ||
      SELECTORS.CHAT.SHOW_HIDE() ||
      (SELECTORS.PLAYLIST() && !SELECTORS.PLAYLIST().hidden)
    ) {
      el.style.position = 'absolute';
      el.style.overflow = 'visible';
    } else {
      el.style.position = 'fixed';
      el.style.overflow = 'auto';
    }

    // change comment box according to if 'SHOW CHAT' box is there
    if (SELECTORS.CHAT.CHAT()) {
      el.style.height =
        'calc(100vh - ' + (SELECTORS.CHAT.CHAT().offsetHeight + 115) + 'px)';
    } else {
      el.style.height = 'calc(100vh - 90px)';
    }

    // check if we are at a live stream and switch back to default comment mode as this acts the same as new mode
    if (
      SELECTORS.CHAT.OPEN_BUTTON() &&
      !SELECTORS.CHAT.OPEN_BUTTON().textContent.includes('replay')
    ) {
      if (currentState === 'new') {
        showDefaultComments();
      }
    } else {
      if (window.innerWidth <= 1016) {
        if (currentState === 'new') {
          showDefaultComments();
        }
      } else {
        if (currentState === 'default') {
          showNewComments();
        }
      }
    }
  }

  window.addEventListener('resize', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      resizeUpdate();
    }
  });

  window.addEventListener('onUrlChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      Helper.onAttributeChange(SELECTORS.RAW.PLAYER.VIDEO, (o) => {
        resizeUpdate();
        o.disconnect();
      });
    }
  });

  window.addEventListener('onViewModeChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      resizeUpdate();
    }
  });

  if (currentURL.pathname.startsWith('/watch')) {
    Helper.onElementLoad(SELECTORS.RAW.CHAT.SHOW_HIDE).then(() => {
      resizeUpdate();
    });

    Helper.onElementLoad(SELECTORS.RAW.PLAYER.BOUNDS).then(() => {
      resizeUpdate();
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
    }, 0);
  }
}, 50);

// create theater mode event
Helper.onChildElementChange(SELECTORS.RAW.PLAYER.BOUNDS, () => {
  if (!SELECTORS.PLAYER.MOVIE_PLAYER().ariaLabel.includes('Fullscreen')) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('onToggleTheater'));
      window.dispatchEvent(new CustomEvent('onViewModeChange'));
    }, 0);
  }
});

// create fullscreen mode event
Helper.onAttributeChange(SELECTORS.RAW.PLAYER.MOVIE_PLAYER, (_, e) => {
  for (const i of e) {
    if (i.attributeName === 'aria-label') {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('onToggleFullscreen', {
            detail: {
              isFullscreen: i.target.ariaLabel.includes('Fullscreen'),
            },
          })
        );

        window.dispatchEvent(new CustomEvent('onViewModeChange'));
      }, 0);
    }
  }
});

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
});
