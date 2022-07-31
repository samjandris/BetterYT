import { SELECTORS, Helper } from './utils';

// create url event
// var Helper.getUrl() = new URL(window.location.href);
setInterval(() => {
  if (Helper.getUrl().href !== window.location.href) {
    Helper.setUrl(new URL(window.location.href));
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('onUrlChange', {
          detail: { url: Helper.getUrl() },
        })
      );

      // fix for delayed loading of navigation bar or already loaded page
      if (
        !SELECTORS.PAGE.NAVIGATION_PROGRESS() ||
        (SELECTORS.PAGE.NAVIGATION_PROGRESS() &&
          SELECTORS.PAGE.NAVIGATION_PROGRESS().getAttribute('aria-valuenow') ===
            '100')
      ) {
        Helper.onElementLoad(SELECTORS.RAW.PAGE.NAVIGATION_PROGRESS).then(
          () => {
            window.dispatchEvent(
              new CustomEvent('onPageChange', {
                detail: { url: Helper.getUrl() },
              })
            );

            window.dispatchEvent(new Event('resize'));
          }
        );
      }
    });
  }
}, 50);

// create page change event
Helper.onAttributeChange(
  SELECTORS.RAW.PAGE.NAVIGATION_PROGRESS,
  () => {
    if (
      SELECTORS.PAGE.NAVIGATION_PROGRESS().getAttribute('aria-valuenow') ===
      '100'
    ) {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('onPageChange', {
            detail: { url: Helper.getUrl() },
          })
        );

        window.dispatchEvent(new Event('resize'));
      });
    }
  },
  { attributes: true, attributeFilter: ['aria-valuenow'] }
);

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
