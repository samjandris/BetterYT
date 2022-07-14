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
      CONTAINER: '#player-container.ytd-watch-flexy',
      BOUNDS: '#player-theater-container, #player-container-inner',
      VIDEO: '#movie_player > div.html5-video-container > video',
      CONTROLS: {
        TO_HIDE: [
          'a[aria-label*="Previous"]',
          'a[aria-label*="Next"]',
          'div[class="ytp-chapter-container"]',
          'button[aria-label*="Autoplay"]',
          'button[aria-label*="Subtitles"]',
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
    CONTAINER: () => document.querySelector(SELECTORS.RAW.PLAYER.CONTAINER),
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

var resRatio = 0;

// ytp-player-minimized ytp-small-mode ytp-menu-shown
var miniPlayerClasses =
  'html5-video-player ytp-transparent ytp-exp-bottom-control-flexbox ytp-exp-ppp-update ytp-fit-cover-video ytp-fine-scrubbing-exp ytp-hide-info-bar ytp-iv-drawer-enabled ytp-autonav-endscreen-cancelled-state playing-mode ytp-heat-map ytp-autohide ytp-menu-shown ytp-player-minimized ytp-small-mode';

// ytp-large-width-mode
var fullPlayerClasses =
  'html5-video-player ytp-transparent ytp-exp-bottom-control-flexbox ytp-exp-ppp-update ytp-fit-cover-video ytp-fine-scrubbing-exp ytp-hide-info-bar ytp-iv-drawer-enabled ytp-autonav-endscreen-cancelled-state ytp-heat-map ytp-large-width-mode playing-mode ytp-autohide';

// returns a resolution that abides by the aspect ratio provided and fit within the bounding elements boundaries
function fitResolution(boundingElement, aspectRatio) {
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

function miniPlayer() {
  // const player = SELECTORS.PLAYER.PLAYER();
  // const playerV = SELECTORS.PLAYER.VIDEO();
  // const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();
  // const hoverBar = SELECTORS.PLAYER.CONTROLS.TIME_BAR();

  // player.style.position = 'fixed';
  // player.style.bottom = '10px';
  // player.style.right = '10px';
  // player.style.width = '400px';
  // player.style.height = '225px';
  // player.style.zIndex = 9999999;

  // playerV.style.top = '0px';
  // playerV.style.left = '0px';
  // playerV.style.width =
  //   SELECTORS.COLUMN_RIGHT().offsetWidth + 'px';
  // playerV.style.height =
  //   SELECTORS.COLUMN_RIGHT().offsetWidth / (16 / 9) + 'px';
  // playerControls.style.width =
  //   player.offsetWidth - playerControls.offsetLeft * 2 + 'px';

  // hoverBar.setAttribute('hidden', '');

  // for (const controlSelector of SELECTORS.PLAYER.CONTROLS.TO_HIDE) {
  //   const control = document.querySelector(controlSelector);
  //   if (control) {
  //     control.setAttribute('hidden', '');
  //   }
  // }

  //   window.dispatchEvent(new Event('resize'));

  // Site Wide Mini Player Tests
  const player = SELECTORS.PLAYER.PLAYER();
  const playerV = SELECTORS.PLAYER.VIDEO();
  const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();

  player.style.width = SELECTORS.MINI_PLAYER.CONTAINER().offsetWidth + 'px';
  player.style.height = SELECTORS.MINI_PLAYER.CONTAINER().offsetHeight + 'px';

  const [top, left, width, height] = fitResolution(
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
  // SELECTORS.PLAYER.MOVIE_PLAYER().class = miniPlayerClasses;
  SELECTORS.MINI_PLAYER.ROOT().setAttribute('enabled', '');
  SELECTORS.MINI_PLAYER.ROOT().setAttribute('active', '');

  // var playerV2 = document.evaluate(
  //     '//*[@id="primary"]/div/div[1]/div/div/div',
  //     document,
  //     null,
  //     XPathResult.FIRST_ORDERED_NODE_TYPE,
  //     null
  //   ).singleNodeValue;
  //   var playerCon = document.evaluate(
  //     '/html/body/ytd-app/ytd-miniplayer/div[2]/div/div[1]/div[1]/div',
  //     document,
  //     null,
  //     XPathResult.FIRST_ORDERED_NODE_TYPE,
  //     null
  //   ).singleNodeValue;
  //   document
  //     .querySelector('body > ytd-app')
  //     .setAttribute('miniplayer-is-active', '');
  //   document
  //     .querySelector('body > ytd-app > ytd-miniplayer')
  //     .setAttribute('enabled', '');
  //   document
  //     .querySelector('body > ytd-app > ytd-miniplayer')
  //     .setAttribute('active', '');
  //   playerCon.appendChild(player);
}

function fullPlayer() {
  // const player = SELECTORS.PLAYER.PLAYER();
  // const playerV = SELECTORS.PLAYER.VIDEO();
  // const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();
  // const hoverBar = SELECTORS.PLAYER.CONTROLS.TIME_BAR();
  // player.removeAttribute('style');
  // window.dispatchEvent(new Event('resize'));
  // playerV.style.width = player.offsetWidth - playerV.offsetLeft * 2 + 'px';
  // playerV.style.height = player.offsetHeight - playerV.offsetTop * 2 + 'px';
  // playerControls.style.width =
  //   player.offsetWidth - playerControls.offsetLeft * 2 + 'px';
  // hoverBar.removeAttribute('hidden');
  // for (const controlSelector of SELECTORS.PLAYER.CONTROLS.TO_HIDE) {
  //   const control = document.querySelector(controlSelector);
  //   if (control) {
  //     control.removeAttribute('hidden');
  //   }
  // }
  //   window.dispatchEvent(new Event('resize'));

  // Site Wide Mini Player Tests
  const player = SELECTORS.PLAYER.PLAYER();
  const playerV = SELECTORS.PLAYER.VIDEO();
  const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();
  player.removeAttribute('style');
  // window.dispatchEvent(new Event('resize'));

  const [top, left, width, height] = fitResolution(
    SELECTORS.PLAYER.PLAYER(),
    resRatio
  );

  playerV.style.top = top + 'px';
  playerV.style.left = left + 'px';
  playerV.style.width = width + 'px';
  playerV.style.height = height + 'px';
  playerControls.style.width =
    player.offsetWidth - playerControls.offsetLeft * 2 + 'px';
  SELECTORS.PLAYER.CONTROLS.TIME_BAR().removeAttribute('hidden');
  for (const controlSelector of SELECTORS.RAW.PLAYER.CONTROLS.TO_HIDE) {
    const control = document.querySelector(controlSelector);
    if (control) {
      control.removeAttribute('hidden');
    }
  }
  // window.dispatchEvent(new Event('resize'));

  SELECTORS.MINI_PLAYER.ROOT().removeAttribute('active');
  SELECTORS.MINI_PLAYER.ROOT().removeAttribute('enabled');
  SELECTORS.PLAYER.CONTAINER().appendChild(SELECTORS.PLAYER.PLAYER());
  // SELECTORS.PLAYER.MOVIE_PLAYER().class = fullPlayerClasses;

  // var playerV2 = document.evaluate(
  //     '/html/body/ytd-app/ytd-miniplayer/div[2]/div/div[1]/div[1]/div/ytd-player',
  //     document,
  //     null,
  //     XPathResult.FIRST_ORDERED_NODE_TYPE,
  //     null
  //   ).singleNodeValue;
  //   var playerCon = document.evaluate(
  //     '//*[@id="primary"]/div/div[1]/div/div/div',
  //     document,
  //     null,
  //     XPathResult.FIRST_ORDERED_NODE_TYPE,
  //     null
  //   ).singleNodeValue;
  //   player.style.top = '0px';
  //   player.style.left = '0px';
  //   player.style.width = 'calc(100%)';
  //   player.style.height = 'calc(100%)';
  //   player.style.zIndex = 9999999;
  //   playerV.style.width = 'calc(100vw)';
  //   playerV.style.height = 'calc(100vh)';
  //   document
  //     .querySelector('body > ytd-app')
  //     .removeAttribute('miniplayer-is-active');
  //   document
  //     .querySelector('body > ytd-app > ytd-miniplayer')
  //     .removeAttribute('enabled');
  //   document
  //     .querySelector('body > ytd-app > ytd-miniplayer')
  //     .removeAttribute('active');
  //   document.querySelector('#player-container').appendChild(player);
}

var newCommentsEnabled = false;
chrome.storage.sync.get('experimentalComments', (data) => {
  newCommentsEnabled = data.experimentalComments;
});

var currentState = 'default';

var el = document.createElement('div');
el.style.overflow = 'auto';
el.style.position = 'fixed';
el.setAttribute('hidden', '');

function defaultComments() {
  SELECTORS.COLUMN_RIGHT().appendChild(SELECTORS.RELATED());
  SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.COMMENTS());

  el.setAttribute('hidden', '');
  currentState = 'default';
}

function newComments() {
  if (newCommentsEnabled) {
    SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.RELATED());

    el.appendChild(SELECTORS.COMMENTS());
    SELECTORS.COLUMN_RIGHT().appendChild(el);
    el.removeAttribute('hidden');
    currentState = 'new';
  }
}

function resizeUpdate() {
  el.style.width = SELECTORS.COLUMN_RIGHT().offsetWidth + 'px';

  // check if we are in theater mode, fullscreen, or a live chat replay is expanded
  if (
    SELECTORS.PLAYER.CONTROLS.FULLSCREEN().title == 'Exit full screen (f)' ||
    SELECTORS.PLAYER.CONTROLS.THEATER().title == 'Default view (t)' ||
    (SELECTORS.CHAT.CHAT() &&
      SELECTORS.CHAT.BODY() &&
      SELECTORS.CHAT.BODY().childElementCount > 0) ||
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
      defaultComments();
    }
  } else {
    if (window.innerWidth <= 1016) {
      if (currentState === 'new') {
        defaultComments();
      }
    } else {
      if (currentState === 'default') {
        newComments();
      }
    }
  }
}

function setupPage() {
  resRatio =
    SELECTORS.PLAYER.VIDEO().offsetWidth /
    SELECTORS.PLAYER.VIDEO().offsetHeight;
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

var oldRef = window.location.href;
setInterval(() => {
  if (oldRef !== window.location.href) {
    if (window.location.href.includes('watch')) {
      setTimeout(() => {
        setupPage();
        resizeUpdate();
      }, 750);
    }

    oldRef = window.location.href;
  }
}, 50);

if (window.location.href.includes('watch')) {
  window.onscroll = () => {
    if (window.scrollY >= SELECTORS.PLAYER.BOUNDS().offsetHeight) {
      miniPlayer();
    } else {
      fullPlayer();
    }
  };

  window.addEventListener('resize', () => {
    resizeUpdate();
  });

  waitForElm('#comments').then(() => {
    console.log('YouTube Enhancements Loaded!');

    setupPage();

    // theater mode
    SELECTORS.PLAYER.CONTROLS.THEATER().addEventListener('click', () =>
      setTimeout(() => {
        resizeUpdate();
      }, 100)
    );

    // fullscreen
    SELECTORS.PLAYER.CONTROLS.FULLSCREEN().addEventListener('click', () =>
      setTimeout(() => {
        resizeUpdate();
      }, 100)
    );

    // key press for fullscreen and theater
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyT' || e.code === 'KeyF') {
        setTimeout(() => {
          resizeUpdate();
        }, 100);
      }
    });

    // live chat button click
    waitForElm(SELECTORS.RAW.CHAT.SHOW_HIDE).then((elm) => {
      SELECTORS.CHAT.SHOW_HIDE().addEventListener('click', () =>
        setTimeout(() => {
          resizeUpdate();
        }, 200)
      );

      resizeUpdate();
    });

    resizeUpdate();

    console.log('YouTube Enhancements Active!');
  });
}
