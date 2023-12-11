import { SELECTORS, Helper } from '../utils';

function updateDislikes() {
  Helper.onElementLoad(SELECTORS.RAW.PLAYER.DISLIKE).then(() => {
    fetch(
      'https://returnyoutubedislikeapi.com/votes?videoId=' +
        Helper.getUrl().searchParams.get('v')
    )
      .then((response) => response.json())
      .then((data) => {
        const playerDislikeElement = SELECTORS.PLAYER.DISLIKE();
        if (playerDislikeElement)
          playerDislikeElement.textContent = Helper.abbreviateNumber(
            data.dislikes
          );
      });
  });
}

window.addEventListener('onPageChange', () => {
  if (Helper.getUrl().pathname.startsWith('/watch')) {
    updateDislikes();
  }
});

if (Helper.getUrl().pathname.startsWith('/watch')) {
  updateDislikes();
}
