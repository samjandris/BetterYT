import { SELECTORS, Helper } from '../utils';

function positionTheater() {
  const playerMoviePlayerElement = SELECTORS.PLAYER.MOVIE_PLAYER();
  const pageAppElement = SELECTORS.PAGE.APP();
  const chatFrameElement = SELECTORS.CHAT.FRAME();
  const chatElement = SELECTORS.CHAT.CHAT();

  if (
    Helper.isTheater() &&
    (Helper.isLive() || Helper.isReplay()) &&
    Helper.isChatOpen()
  ) {
    if (!document.body.hasAttribute('betteryt-theater'))
      document.body.setAttribute('betteryt-theater', '');
    if (
      playerMoviePlayerElement &&
      playerMoviePlayerElement.classList.contains('ytp-hide-info-bar')
    )
      playerMoviePlayerElement.classList.remove('ytp-hide-info-bar');

    if (pageAppElement) {
      pageAppElement.setAttribute('scrolling', '');

      if (pageAppElement.scrollTop > 0) {
        pageAppElement.removeAttribute('masthead-hidden');
      } else {
        pageAppElement.setAttribute('masthead-hidden', '');
      }
    }

    if (
      chatFrameElement &&
      chatElement &&
      chatFrameElement.contentDocument &&
      chatFrameElement.contentDocument.documentElement
    ) {
      chatFrameElement.contentDocument.documentElement.setAttribute('dark', '');

      chatElement.setAttribute('dark', '');
    }
  } else {
    document.body.removeAttribute('betteryt-theater');

    if (
      !document.documentElement.hasAttribute('dark') &&
      chatFrameElement &&
      chatElement &&
      chatFrameElement.contentDocument?.documentElement
    ) {
      chatFrameElement.contentDocument.documentElement.removeAttribute('dark');

      chatElement.removeAttribute('dark');
    }

    if (!Helper.isFullscreen() && pageAppElement && playerMoviePlayerElement) {
      pageAppElement.removeAttribute('scrolling');
      pageAppElement.removeAttribute('masthead-hidden');

      if (!playerMoviePlayerElement.classList.contains('ytp-hide-info-bar'))
        playerMoviePlayerElement.classList.add('ytp-hide-info-bar');
    }
  }

  if (chatFrameElement)
    chatFrameElement.onload = () => {
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

const pageAppElementListener = SELECTORS.PAGE.APP();
if (pageAppElementListener)
  pageAppElementListener.addEventListener('scroll', () => {
    if (Helper.getUrl().pathname.startsWith('/watch')) {
      positionTheater();
    }
  });

Helper.onElementLoad(SELECTORS.RAW.PAGE.WATCH_FLEXY).then(() => {
  const pageAppElement = SELECTORS.PAGE.APP();
  const watchFlexyElement = SELECTORS.PAGE.WATCH_FLEXY();
  if (pageAppElement && watchFlexyElement) {
    pageAppElement.style.setProperty(
      '--ytd-app-fullerscreen-scrollbar-width',
      getComputedStyle(watchFlexyElement).getPropertyValue(
        '--ytd-watch-flexy-scrollbar-width'
      )
    );
  }
});

if (Helper.getUrl().pathname.startsWith('/watch')) {
  Helper.onElementsLoad([
    SELECTORS.RAW.PLAYER.VIDEO,
    SELECTORS.RAW.CHAT.FRAME,
  ]).then(() => {
    positionTheater();
  });
}
