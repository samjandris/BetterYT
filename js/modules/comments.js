comments = () => {
  function handleComments() {
    if (window.innerWidth < 1014) {
      document.body.removeAttribute('betteryt-comments-fixed');
      if (SELECTORS.RELATED().parentElement !== SELECTORS.COLUMN_LEFT())
        SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.RELATED());

      if (SELECTORS.COMMENTS().parentElement !== SELECTORS.COLUMN_LEFT())
        SELECTORS.COLUMN_LEFT().appendChild(SELECTORS.COMMENTS());
    } else {
      if (
        !Helper.isTheater() &&
        !Helper.isFullscreen() &&
        !Helper.isLive() &&
        !Helper.isReplay()
      ) {
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

chrome.storage.sync.get(STORAGE_DEFAULT, (data) => {
  if (data.experimentalComments) {
    comments();
  }
});
