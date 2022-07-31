pip = () => {
  const testVideo = document.createElement('video');
  if (testVideo.requestPictureInPicture)
    document.body.setAttribute('betteryt-pip', '');
};

chrome.storage.sync.get(STORAGE_DEFAULT, (data) => {
  if (data.pipButton) {
    pip();
  }
});
