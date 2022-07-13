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
      VIDEO: '#movie_player > div.html5-video-container > video',
      CONTROLS: {
        TO_HIDE: [
          'a[aria-label*="Next"]',
          'div[class="ytp-chapter-container"]',
          'button[aria-label*="Autoplay"]',
          'button[aria-label*="Subtitles"]',
          'button[aria-label*="(t)"]',
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
    RELATED: '#related',
    COMMENTS: '#comments',
    PLAYLIST: '#playlist > #container',
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
    VIDEO: () => document.querySelector(SELECTORS.RAW.PLAYER.VIDEO),
    CONTROLS: {
      TO_HIDE: [
        'a[aria-label*="Next"]',
        'div[class="ytp-chapter-container"]',
        'button[aria-label*="Autoplay"]',
        'button[aria-label*="Subtitles"]',
        'button[aria-label*="(t)"]',
        'button[title*="Full screen"]',
        '#ytp-caption-window-container',
      ],
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
  RELATED: () => document.querySelector(SELECTORS.RAW.RELATED),
  COMMENTS: () => document.querySelector(SELECTORS.RAW.COMMENTS),
  PLAYLIST: () => document.querySelector(SELECTORS.RAW.PLAYLIST),
  COLUMN_LEFT: () => document.querySelector(SELECTORS.RAW.COLUMN_LEFT),
  COLUMN_RIGHT: () => document.querySelector(SELECTORS.RAW.COLUMN_RIGHT),
};

function miniPlayer() {
  const player = SELECTORS.PLAYER.PLAYER();
  const playerV = SELECTORS.PLAYER.VIDEO();
  const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();
  const hoverBar = SELECTORS.PLAYER.CONTROLS.TIME_BAR();

  player.style.position = 'fixed';
  player.style.bottom = '10px';
  player.style.right = '10px';
  player.style.width = '400px';
  player.style.height = '225px';
  player.style.zIndex = 9999999;

  // TODO: video is cropped in slightly

  playerV.style.top = '0px';
  playerV.style.left = '0px';
  playerV.style.width =
    document.querySelector('#secondary-inner').offsetWidth + 'px';
  playerV.style.height =
    document.querySelector('#secondary-inner').offsetWidth / (16 / 9) + 'px';
  playerControls.style.width =
    player.offsetWidth - playerControls.offsetLeft * 2 + 'px';

  hoverBar.setAttribute('hidden', '');

  for (const controlSelector of SELECTORS.PLAYER.CONTROLS.TO_HIDE) {
    const control = document.querySelector(controlSelector);
    if (control) {
      control.setAttribute('hidden', '');
    }
  }

  //   window.dispatchEvent(new Event('resize'));

  // Site Wide Mini Player Tests
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
  const player = SELECTORS.PLAYER.PLAYER();
  const playerV = SELECTORS.PLAYER.VIDEO();
  const playerControls = SELECTORS.PLAYER.CONTROLS.CONTROLS();
  const hoverBar = SELECTORS.PLAYER.CONTROLS.TIME_BAR();
  //   const player = document.querySelector('#ytd-player');
  //   const playerV = document.querySelector(
  //     '#movie_player > div.html5-video-container > video'
  //   );
  //   const playerControls = document.querySelector(
  //     '#movie_player > div.ytp-chrome-bottom'
  //   );
  //   const hoverBar = document.querySelector(
  //     '#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container'
  //   );

  player.removeAttribute('style');
  window.dispatchEvent(new Event('resize'));

  playerV.style.width = player.offsetWidth - playerV.offsetLeft * 2 + 'px';
  playerV.style.height = player.offsetHeight - playerV.offsetTop * 2 + 'px';
  playerControls.style.width =
    player.offsetWidth - playerControls.offsetLeft * 2 + 'px';

  hoverBar.removeAttribute('hidden');

  for (const controlSelector of SELECTORS.PLAYER.CONTROLS.TO_HIDE) {
    const control = document.querySelector(controlSelector);
    if (control) {
      control.removeAttribute('hidden');
    }
  }

  //   window.dispatchEvent(new Event('resize'));

  // Site Wide Mini Player Tests
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
  //   const related = document.querySelector('#related');
  //   const comments = document.querySelector('#comments');

  //   document.querySelector('#secondary-inner').appendChild(related);
  //   document.querySelector('#primary-inner').appendChild(comments);

  SELECTORS.COLUMN_RIGHT().appendChild(SELECTORS.RELATED());
  SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.COMMENTS());

  el.setAttribute('hidden', '');
  currentState = 'default';
}

function newComments() {
  if (newCommentsEnabled) {
    // const related = document.querySelector('#related');
    // const comments = document.querySelector('#comments');

    // document.querySelector('#primary-inner').appendChild(SELECTORS.RELATED());
    SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.RELATED());

    el.appendChild(SELECTORS.COMMENTS());
    SELECTORS.COLUMN_RIGHT().appendChild(el);
    el.removeAttribute('hidden');
    currentState = 'new';
  }
}

function resizeUpdate() {
  if (window.location.href.includes('watch')) {
    el.style.width = SELECTORS.COLUMN_RIGHT().offsetWidth + 'px';
    // document.querySelector('#secondary-inner').offsetWidth + 'px';

    // check if we are in theater mode, fullscreen, or a live chat replay is expanded
    if (
      SELECTORS.PLAYER.CONTROLS.FULLSCREEN().title == 'Exit full screen (f)' ||
      SELECTORS.PLAYER.CONTROLS.THEATER().title == 'Default view (t)' ||
      (SELECTORS.CHAT.CHAT() &&
        SELECTORS.CHAT.BODY() &&
        SELECTORS.CHAT.BODY().childElementCount > 0)
    ) {
      el.style.position = 'absolute';
      el.style.overflow = 'visible';
    } else {
      el.style.position = 'fixed';
      el.style.overflow = 'auto';
    }

    // check if we are at a live stream and switch back to default comment mode as this acts the same as new mode
    if (
      SELECTORS.CHAT.OPEN_BUTTON() &&
      !SELECTORS.CHAT.OPEN_BUTTON().textContent.includes('replay')
    ) {
      console.log('LIVE STREAM');
      defaultComments();
    } else {
      console.log('NOT LIVE STREAM');
      newComments();
    }

    if (window.innerWidth <= 1016) {
      if (currentState === 'new') {
        defaultComments();
      }
    } else {
      if (currentState === 'default') {
        //   newComments();
      }
    }

    // change comment box according to if 'SHOW CHAT' box is there
    if (SELECTORS.CHAT.CHAT()) {
      el.style.height =
        'calc(100vh - ' + (SELECTORS.CHAT.CHAT().offsetHeight + 115) + 'px)';
      // } else if (SELECTORS.PLAYLIST()) {
      // temp fix by using check if we are in theater, or fullscreen
      //   el.style.height =
      //     'calc(100vh - ' + (SELECTORS.PLAYLIST().offsetHeight + 115) + 'px)';
    } else {
      //   el.style.height = 'calc(100vh - 90px)';
      el.style.height = 'calc(100vh - 90px)';
    }
  }
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

window.onscroll = () => {
  if (window.scrollY >= 600) {
    miniPlayer();
  } else {
    fullPlayer();
  }
};

window.addEventListener('resize', () => {
  resizeUpdate();
});

var oldRef = window.location.href;
setInterval(() => {
  if (oldRef !== window.location.href) {
    oldRef = window.location.href;
    console.log('new ref');
    setTimeout(() => {
      // waitForElm('#comments').then((elm) => {
      console.log('ready');
      resizeUpdate();
      // });
    }, 750);
  }
}, 50);

if (window.location.href.includes('watch')) {
  waitForElm('#comments').then((elm) => {
    console.log('YouTube Enhancements Loaded!');

    // theater mode
    SELECTORS.PLAYER.CONTROLS.THEATER().addEventListener('click', () =>
      setTimeout(() => {
        resizeUpdate();
      }, 100)
    );

    // fullscreen
    SELECTORS.PLAYER.CONTROLS.FULLSCREEN().addEventListener('click', () =>
      setTimeout(() => {
        console.log('fullscreen');
        resizeUpdate();
      }, 100)
    );

    // SELECTORS.COLUMN_RIGHT().appendChild(el);

    // live chat button click
    waitForElm(SELECTORS.RAW.CHAT.SHOW_HIDE).then((elm) => {
      SELECTORS.CHAT.SHOW_HIDE().addEventListener('click', () =>
        setTimeout(() => {
          console.log('CHAT!');
          resizeUpdate();
        }, 200)
      );

      resizeUpdate();
    });

    resizeUpdate();

    console.log('YouTube Enhancements Active!');
  });
}
