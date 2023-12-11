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
      THEATER_CONTAINER: '#player-wide-container, #player-full-bleed-container',
      BOUNDS:
        '#player-container-inner, #player-wide-container, #player-full-bleed-container',
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
    APP: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PAGE.APP),
    WATCH_FLEXY: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PAGE.WATCH_FLEXY),
    NAVIGATION_PROGRESS: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PAGE.NAVIGATION_PROGRESS),
  },
  CHAT: {
    CHAT: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.CHAT.CHAT),
    FRAME: (): HTMLIFrameElement | null =>
      document.querySelector(SELECTORS.RAW.CHAT.FRAME),
    SHOW_HIDE: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.CHAT.SHOW_HIDE),
    OPEN_BUTTON: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.CHAT.OPEN_BUTTON),
    REPLAY: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.CHAT.REPLAY),
    BODY: (): HTMLElement | null =>
      // document
      //   .querySelector(SELECTORS.RAW.CHAT.BODY[0])
      SELECTORS.CHAT.FRAME()?.contentDocument?.querySelector(
        SELECTORS.RAW.CHAT.BODY[1]
      ) || null,
  },
  PLAYER: {
    PLAYER: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.PLAYER),
    MOVIE_PLAYER: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.MOVIE_PLAYER),
    TITLE: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.TITLE),
    CHANNEL: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.CHANNEL),
    DISLIKE: (): HTMLElement | null =>
      document.querySelectorAll(SELECTORS.RAW.PLAYER.DISLIKE)[1] as HTMLElement,
    CONTAINER: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.CONTAINER),
    DEFAULT_CONTAINER: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.DEFAULT_CONTAINER),
    THEATER_CONTAINER: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.THEATER_CONTAINER),
    BOUNDS: (): HTMLElement | null => {
      let selectedElement: HTMLElement | null = null;
      document
        .querySelectorAll(SELECTORS.RAW.PLAYER.BOUNDS)
        .forEach((selector: Element) => {
          if ((selector as HTMLElement).offsetHeight > 0 && !selectedElement) {
            selectedElement = selector as HTMLElement;
          }
        });

      return selectedElement!;
    },
    VIDEO: (): HTMLVideoElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.VIDEO),
    GRADIENT_TOP: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.GRADIENT_TOP),
    GRADIENT_BOTTOM: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.PLAYER.GRADIENT_BOTTOM),
    CONTROLS: {
      TO_HIDE: () => SELECTORS.RAW.PLAYER.CONTROLS.TO_HIDE,
      CONTAINER: (): HTMLElement | null =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.CONTAINER),
      CONTROLS: (): HTMLElement | null =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.CONTROLS),
      PROGRESS_BAR: {
        CONTAINER: (): HTMLElement | null =>
          document.querySelector(
            SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER
          ),
        SLIDER: (): HTMLElement | null =>
          document.querySelector(
            SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.SLIDER
          ),
        CHAPTERS: {
          CONTAINER: (): HTMLElement | null =>
            document.querySelector(
              SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.CHAPTERS.CONTAINER
            ),
        },
        SCRUBBER: {
          CONTAINER: (): HTMLElement | null =>
            document.querySelector(
              SELECTORS.RAW.PLAYER.CONTROLS.PROGRESS_BAR.SCRUBBER.CONTAINER
            ),
        },
      },
      FULLSCREEN: (): HTMLElement | null =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.FULLSCREEN),
      THEATER: (): HTMLElement | null =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.THEATER),
      LIVE: (): HTMLElement | null =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.LIVE),
      TIME_DISPLAY: (): HTMLElement | null =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.TIME_DISPLAY),
    },
  },
  MINI_PLAYER: {
    ROOT: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.MINI_PLAYER.ROOT),
    CONTAINER: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.MINI_PLAYER.CONTAINER),
    INFO_BAR: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.MINI_PLAYER.INFO_BAR),
    TITLE: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.MINI_PLAYER.TITLE),
    CHANNEL: (): HTMLElement | null =>
      document.querySelector(SELECTORS.RAW.MINI_PLAYER.CHANNEL),
  },
  RELATED: (): HTMLElement | null =>
    document.querySelector(SELECTORS.RAW.RELATED),
  COMMENTS: (): HTMLElement | null =>
    document.querySelector(SELECTORS.RAW.COMMENTS),
  PLAYLIST: (): HTMLElement | null =>
    document.querySelector(SELECTORS.RAW.PLAYLIST),
  COLUMN_LEFT: (): HTMLElement | null =>
    document.querySelector(SELECTORS.RAW.COLUMN_LEFT),
  COLUMN_RIGHT: (): HTMLElement | null =>
    document.querySelector(SELECTORS.RAW.COLUMN_RIGHT),
  BETTERYT: {
    MINI_PLAYER: {
      CONTROLS: {
        PROGRESS_BAR: {
          CONTAINER: (): HTMLElement | null =>
            document.querySelector(
              SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.CONTAINER
            ),
          SLIDER: (): HTMLElement | null =>
            document.querySelector(
              SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR.SLIDER
            ),
          CHAPTERS: {
            CONTAINER: (): HTMLElement | null =>
              document.querySelector(
                SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR
                  .CHAPTERS.CONTAINER
              ),
          },
          SCRUBBER: {
            CONTAINER: (): HTMLElement | null =>
              document.querySelector(
                SELECTORS.RAW.BETTERYT.MINI_PLAYER.CONTROLS.PROGRESS_BAR
                  .SCRUBBER.CONTAINER
              ),
          },
        },
      },
      GRADIENT_BOTTOM: (): HTMLElement | null =>
        document.querySelector(
          SELECTORS.RAW.BETTERYT.MINI_PLAYER.GRADIENT_BOTTOM
        ),
    },
  },
  SPONSOR_BLOCK: {
    CONTAINER: (): HTMLElement | null =>
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
  static onElementLoad(selectorRaw: string) {
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

  static onElementsLoad(selectorList: string[]) {
    let ready = 0;
    return new Promise<void>((resolve) => {
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
    selectorRaw: string,
    callback: (
      observer: MutationObserver,
      mutationsList: MutationRecord[]
    ) => void,
    settings = { attributes: true, attributeFilter: [] as string[] }
  ) {
    Helper.onElementLoad(selectorRaw).then(() => {
      const element = document.querySelector(selectorRaw);
      if (element) {
        const observer = new MutationObserver((mutationsList) => {
          callback(observer, mutationsList);
        });

        observer.observe(element, settings);
      }
    });
  }

  static onChildElementChange(
    selectorRaw: string,
    callback: (
      observer: MutationObserver,
      mutationsList: MutationRecord[]
    ) => void,
    settings = {
      childList: true,
    }
  ) {
    Helper.onElementLoad(selectorRaw).then(() => {
      const element = document.querySelector(selectorRaw);
      if (element) {
        const observer = new MutationObserver((mutationsList) => {
          callback(observer, mutationsList);
        });

        observer.observe(element, settings);
      }
    });
  }

  static abbreviateNumber(num: number) {
    const abbrev = ['K', 'M', 'B', 'T'];

    function round(n: number, precision: number) {
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

  static setUrl(newUrl: URL) {
    currentURL = newUrl;
  }

  static isTheater() {
    const pageWatchFlexyElement = SELECTORS.PAGE.WATCH_FLEXY();
    return (
      pageWatchFlexyElement &&
      pageWatchFlexyElement.hasAttribute('theater') &&
      !this.isFullscreen() &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isFullscreen() {
    const pageWatchFlexyElement = SELECTORS.PAGE.WATCH_FLEXY();
    return (
      pageWatchFlexyElement &&
      pageWatchFlexyElement.hasAttribute('fullscreen') &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isLive() {
    const playerTimeDisplayElement = SELECTORS.PLAYER.CONTROLS.TIME_DISPLAY();
    return (
      playerTimeDisplayElement &&
      playerTimeDisplayElement.classList.contains('ytp-live') &&
      SELECTORS.CHAT.SHOW_HIDE() !== null &&
      SELECTORS.PLAYER.CONTROLS.LIVE() !== null &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isReplay() {
    const playerTimeDisplayElement = SELECTORS.PLAYER.CONTROLS.TIME_DISPLAY();
    return (
      playerTimeDisplayElement &&
      !playerTimeDisplayElement.classList.contains('ytp-live') &&
      SELECTORS.CHAT.SHOW_HIDE() !== null &&
      SELECTORS.PLAYER.CONTROLS.LIVE() !== null &&
      currentURL.pathname.startsWith('/watch')
    );
  }

  static isChatOpen() {
    const chatFrameElement = SELECTORS.CHAT.FRAME();
    return (
      chatFrameElement &&
      chatFrameElement.offsetHeight > 0 &&
      currentURL.pathname.startsWith('/watch')
    );
  }
}

export { SELECTORS, STORAGE_DEFAULT, Helper };
