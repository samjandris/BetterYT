const SELECTORS = {
  RAW: {
    PAGE: {
      APP: 'ytd-app',
      WATCH_FLEXY: 'ytd-watch-flexy',
      NAVIGATION_PROGRESS: 'yt-page-navigation-progress',
    },
    CHAT: {
      CHAT: '#chat',
      FRAME: '#chatframe',
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
      TITLE:
        'ytd-watch-flexy h1.title.ytd-video-primary-info-renderer > yt-formatted-string',
      CHANNEL:
        'ytd-watch-flexy #channel-name.ytd-video-owner-renderer > #container > #text-container > #text > a',
      DISLIKE: 'yt-formatted-string.ytd-toggle-button-renderer',
      CONTAINER: '#player-container.ytd-watch-flexy',
      DEFAULT_CONTAINER: '#player-container-inner',
      THEATER_CONTAINER: '#player-wide-container',
      BOUNDS: '#player-container-inner, #player-wide-container',
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
          SLIDER:
            '.ytp-chrome-bottom .ytp-progress-bar-container .ytp-progress-bar',
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
        TIME_DISPLAY: '.ytp-chrome-bottom .ytp-time-display',
      },
    },
    MINI_PLAYER: {
      ROOT: 'ytd-miniplayer',
      CONTAINER: '#player-container.ytd-miniplayer',
      INFO_BAR: '#info-bar',
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
    SPONSOR_BLOCK: {
      CONTAINER: '#previewbar',
    },
  },
  PAGE: {
    APP: () => document.querySelector(SELECTORS.RAW.PAGE.APP),
    WATCH_FLEXY: () => document.querySelector(SELECTORS.RAW.PAGE.WATCH_FLEXY),
    NAVIGATION_PROGRESS: () =>
      document.querySelector(SELECTORS.RAW.PAGE.NAVIGATION_PROGRESS),
  },
  CHAT: {
    CHAT: () => document.querySelector(SELECTORS.RAW.CHAT.CHAT),
    FRAME: () => document.querySelector(SELECTORS.RAW.CHAT.FRAME),
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
        SLIDER: () =>
          document.querySelector(
            SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.SLIDER
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
      TIME_DISPLAY: () =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.TIME_DISPLAY),
    },
  },
  MINI_PLAYER: {
    ROOT: () => document.querySelector(SELECTORS.RAW.MINI_PLAYER.ROOT),
    CONTAINER: () =>
      document.querySelector(SELECTORS.RAW.MINI_PLAYER.CONTAINER),
    INFO_BAR: () => document.querySelector(SELECTORS.RAW.MINI_PLAYER.INFO_BAR),
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
  SPONSOR_BLOCK: {
    CONTAINER: () =>
      document.querySelector(SELECTORS.RAW.SPONSOR_BLOCK.CONTAINER),
  },
};

const STORAGE_DEFAULT = {
  miniPlayer: true,
  returnDislikes: false,
  twitchTheater: true,
  pipButton: true,
  experimentalComments: false,
};

var currentURL = new URL(window.location.href);
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

  static getUrl() {
    return currentURL;
  }

  static setUrl(newUrl) {
    currentURL = newUrl;
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
      SELECTORS.PLAYER.CONTROLS.TIME_DISPLAY().classList.contains('ytp-live') &&
      SELECTORS.CHAT.SHOW_HIDE() !== null &&
      SELECTORS.PLAYER.CONTROLS.LIVE() !== null &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isReplay() {
    return (
      !SELECTORS.PLAYER.CONTROLS.TIME_DISPLAY().classList.contains(
        'ytp-live'
      ) &&
      SELECTORS.CHAT.SHOW_HIDE() !== null &&
      SELECTORS.PLAYER.CONTROLS.LIVE() !== null &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isChatOpen() {
    return (
      SELECTORS.CHAT.FRAME() !== null &&
      SELECTORS.CHAT.FRAME().offsetHeight > 0 &&
      currentURL.pathname.startsWith('/watch')
    );
  }
}

export { SELECTORS, STORAGE_DEFAULT, Helper };
