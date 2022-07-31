dislikes = () => {
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

  window.addEventListener('onPageChange', () => {
    if (currentURL.pathname.startsWith('/watch')) {
      updateDislikes();
    }
  });

  if (currentURL.pathname.startsWith('/watch')) {
    updateDislikes();
  }
};

chrome.storage.sync.get(STORAGE_DEFAULT, (data) => {
  if (data.returnDislikes) {
    dislikes();
  }
});
