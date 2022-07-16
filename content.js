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
    const abbrev = ['K', 'M', 'B', 'T']; // could be an array of strings: [' m', ' Mo', ' Md']

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
        CONTROLS: '#movie_player > div.ytp-chrome-bottom',
        TIME_BAR:
          '#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container',
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
    CONTROLS: {
      TO_HIDE: () => SELECTORS.RAW.PLAYER.CONTROLS.TO_HIDE,
      CONTROLS: () =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.CONTROLS),
      TIME_BAR: () =>
        document.querySelector(SELECTORS.RAW.PLAYER.CONTROLS.TIME_BAR),
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
};

MiniPlayer = () => {
  var resRatio = null;

  // ytp-player-minimized ytp-small-mode ytp-menu-shown
  var miniPlayerClasses =
    'html5-video-player ytp-transparent ytp-exp-bottom-control-flexbox ytp-exp-ppp-update ytp-fit-cover-video ytp-fine-scrubbing-exp ytp-hide-info-bar ytp-iv-drawer-enabled ytp-autonav-endscreen-cancelled-state playing-mode ytp-heat-map ytp-autohide ytp-menu-shown ytp-player-minimized ytp-small-mode';

  // ytp-large-width-mode
  var fullPlayerClasses =
    'html5-video-player ytp-transparent ytp-exp-bottom-control-flexbox ytp-exp-ppp-update ytp-fit-cover-video ytp-fine-scrubbing-exp ytp-hide-info-bar ytp-iv-drawer-enabled ytp-autonav-endscreen-cancelled-state ytp-heat-map ytp-large-width-mode playing-mode ytp-autohide';

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
      playerControls.offsetLeft * 2 +
      'px';

    SELECTORS.PLAYER.CONTROLS.TIME_BAR().setAttribute('hidden', '');

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
    // SELECTORS.PLAYER.MOVIE_PLAYER().class = miniPlayerClasses;
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
      playerControls.offsetLeft * 2 +
      'px';
    SELECTORS.PLAYER.CONTROLS.TIME_BAR().removeAttribute('hidden');
    for (const controlSelector of SELECTORS.RAW.PLAYER.CONTROLS.TO_HIDE) {
      const control = document.querySelector(controlSelector);
      if (control) {
        control.removeAttribute('hidden');
      }
    }

    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('active');
    SELECTORS.MINI_PLAYER.ROOT().removeAttribute('enabled');
    SELECTORS.PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());
    // SELECTORS.PLAYER.MOVIE_PLAYER().class = fullPlayerClasses;
  }

  function doPlayer() {
    // this check is to stop the player from breaking if doPlayer() is called before resRatio is ready
    if (SELECTORS.PLAYER.BOUNDS() && resRatio) {
      if (window.scrollY >= SELECTORS.PLAYER.BOUNDS().offsetHeight) {
        showMiniPlayer();
      } else {
        showFullPlayer();
      }
    }
  }

  window.addEventListener('scroll', () => {
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

  // this might be needed to solve strange bug where sometimes video does not maximize fully when expanding from mini player
  window.addEventListener('onUrlChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      Helper.onElementLoad(SELECTORS.RAW.PLAYER.VIDEO).then(() => {
        doPlayer();
      });
    }
  });

  window.addEventListener('onToggleTheater', () => {
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
