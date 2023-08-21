import { SELECTORS, Helper } from '../utils';

function positionTheater() {
  if (
    Helper.isTheater() &&
    (Helper.isLive() || Helper.isReplay()) &&
    Helper.isChatOpen()
  ) {
    if (!document.body.hasAttribute('betteryt-theater'))
      document.body.setAttribute('betteryt-theater', '');

    if (SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-hide-info-bar'))
      SELECTORS.PLAYER.MOVIE_PLAYER().classList.remove('ytp-hide-info-bar');

    SELECTORS.PAGE.APP().setAttribute('scrolling', '');

    if (SELECTORS.PAGE.APP().scrollTop > 0) {
      SELECTORS.PAGE.APP().removeAttribute('masthead-hidden');
    } else {
      SELECTORS.PAGE.APP().setAttribute('masthead-hidden', '');
    }

    if (
      SELECTORS.CHAT.FRAME().contentDocument &&
      SELECTORS.CHAT.FRAME().contentDocument.documentElement
    ) {
      SELECTORS.CHAT.FRAME().contentDocument.documentElement.setAttribute(
        'dark',
        ''
      );

      SELECTORS.CHAT.CHAT().setAttribute('dark', '');
    }
  } else {
    document.body.removeAttribute('betteryt-theater');

    if (
      !document.documentElement.hasAttribute('dark') &&
      SELECTORS.CHAT.FRAME() &&
      SELECTORS.CHAT.FRAME().contentDocument.documentElement
    ) {
      SELECTORS.CHAT.FRAME().contentDocument.documentElement.removeAttribute(
        'dark'
      );

      SELECTORS.CHAT.CHAT().removeAttribute('dark');
    }

    if (!Helper.isFullscreen()) {
      SELECTORS.PAGE.APP().removeAttribute('scrolling');
      SELECTORS.PAGE.APP().removeAttribute('masthead-hidden');

      if (
        !SELECTORS.PLAYER.MOVIE_PLAYER().classList.contains('ytp-hide-info-bar')
      )
        SELECTORS.PLAYER.MOVIE_PLAYER().classList.add('ytp-hide-info-bar');
    }
  }

  if (SELECTORS.CHAT.FRAME())
    SELECTORS.CHAT.FRAME().onload = () => {
      positionTheater();
      window.dispatchEvent(new Event('resize'));
    };

  if (Helper.isChatOpen()) {
    document.body.setAttribute('betteryt-theater-button', '');
  } else {
    document.body.removeAttribute('betteryt-theater-button');
  }
}

window.addEventListener('resize', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    positionTheater();
  }
});

window.addEventListener('onViewModeChange', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    positionTheater();
  }
});

window.addEventListener('onPageChange', () => {
  positionTheater();
});

SELECTORS.PAGE.APP().addEventListener('scroll', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    positionTheater();
  }
});

Helper.onElementLoad(SELECTORS.RAW.PAGE.WATCH_FLEXY).then(() => {
  SELECTORS.PAGE.APP().style.setProperty(
    '--ytd-app-fullerscreen-scrollbar-width',
    getComputedStyle(SELECTORS.PAGE.WATCH_FLEXY()).getPropertyValue(
      '--ytd-watch-flexy-scrollbar-width'
    )
  );
});

if (Helper.getUrl().pathname.startsWith('/watch')) {
  Helper.onElementsLoad([
    SELECTORS.RAW.PLAYER.VIDEO,
    SELECTORS.RAW.CHAT.FRAME,
  ]).then(() => {
    positionTheater();
  });
}
