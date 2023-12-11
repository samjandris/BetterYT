import { SELECTORS, Helper } from '../utils';

function handleComments() {
  const relatedElement = SELECTORS.RELATED();
  const commentsElement = SELECTORS.COMMENTS();
  const columnLeftElement = SELECTORS.COLUMN_LEFT();
  const columnRightElement = SELECTORS.COLUMN_RIGHT();

  if (window.innerWidth < 1014) {
    document.body.removeAttribute('betteryt-comments-fixed');
    if (
      relatedElement &&
      columnLeftElement &&
      relatedElement.parentElement !== columnLeftElement
    )
      columnLeftElement.appendChild(relatedElement);

    if (
      commentsElement &&
      columnLeftElement &&
      commentsElement.parentElement !== columnLeftElement
    )
      columnLeftElement.appendChild(commentsElement);
  } else {
    if (
      !Helper.isTheater() &&
      !Helper.isFullscreen() &&
      !Helper.isLive() &&
      !Helper.isReplay()
    ) {
      if (!document.body.hasAttribute('betteryt-comments-fixed'))
        document.body.setAttribute('betteryt-comments-fixed', '');
    } else {
      document.body.removeAttribute('betteryt-comments-fixed');
    }

    if (
      commentsElement &&
      columnRightElement &&
      commentsElement.parentElement !== columnRightElement
    )
      columnRightElement.appendChild(commentsElement);

    if (
      relatedElement &&
      columnLeftElement &&
      relatedElement.parentElement !== columnLeftElement
    )
      columnLeftElement.appendChild(relatedElement);
  }
}

window.addEventListener('resize', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    handleComments();
  }
});

window.addEventListener('onViewModeChange', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    handleComments();
  }
});

window.addEventListener('onUrlChange', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    handleComments();
  }
});

if (Helper.getUrl().pathname.startsWith('/watch')) {
  Helper.onElementsLoad([
    SELECTORS.RAW.COMMENTS,
    SELECTORS.RAW.RELATED,
    SELECTORS.RAW.COLUMN_LEFT,
    SELECTORS.RAW.COLUMN_RIGHT,
  ]).then(() => {
    handleComments();
  });
}
