const testVideo = document.createElement('video');
if (testVideo.requestPictureInPicture)
  document.body.setAttribute('betteryt-pip', '');
