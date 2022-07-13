// Extension event listeners are a little different from the patterns you may have seen in DOM or
// Node.js APIs. The below event listener registration can be broken in to 4 distinct parts:
//
// * chrome      - the global namespace for Chrome's extension APIs
// * runtime     – the namespace of the specific API we want to use
// * onInstalled - the event we want to subscribe to
// * addListener - what we want to do with this event
//
// See https://developer.chrome.com/docs/extensions/reference/events/ for additional details.

function reddenPage() {
  // var player = document.getElementById('//*[@id="movie_player"]/div[1]/video');
  var player = document.querySelector('#ytd-player');
  var playerVideo = document.evaluate(
    '//*[@id="movie_player"]/div[1]/video',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  console.log(playerVideo.style);
  player.style.position = 'fixed';
  // player.style.overflow = 'visible';
  player.style.bottom = '10px';
  player.style.right = '10px';
  player.style.width = '300px';
  player.style.height = '168px';
  player.style.zIndex = 9999999;
  // player.style.marginRight = '10vh';
  // player.style =
  //   'width: 100px; height: 100px; top: 50vh; left: 50vw; z-index: 99999;';
  // playerVideo.style =
  //   //   // 'position: sticky; width: 100px; height: 100px; margin-bottom: 10px; margin-right: 10px; z-index: 9999999;';
  //   'position: sticky; top: "calc(100vh-500px)"; width: 50%; height: 50%; z-index: 999999999;';
  // document.getElementById(
  //   '//*[@id="movie_player"]/div[1]/video'
  // ).style.width = 10;
  // document.getElementById('player').style.width = 5;
  // player.style.width = 50;
}

// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ['comments.js'],
//     // function: reddenPage,
//   });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ['content.js'],
//       // function: reddenPage,
//     });
//   }
// });

// "content_scripts": [
//   {
//     "js": ["index.js"],
//     "matches": ["*://*.youtube.com/*"]
//   }
// ],

// "background": {
//   "service_worker": "index.js"
// },
