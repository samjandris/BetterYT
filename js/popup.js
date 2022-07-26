document.querySelectorAll('[data-locale]').forEach((element) => {
  element.innerText = chrome.i18n.getMessage(element.dataset.locale);
});

chrome.storage.sync.get((data) => {
  document.getElementById('miniPlayer').checked = data.miniPlayer;
  document.getElementById('returnDislikes').checked = data.returnDislikes;
  document.getElementById('twitchTheater').checked = data.twitchTheater;
  document.getElementById('experimentalComments').checked =
    data.experimentalComments;
});

document.getElementById('miniPlayer').addEventListener('change', () => {
  chrome.storage.sync.set({
    miniPlayer: document.getElementById('miniPlayer').checked,
  });

  document.documentElement.setAttribute('refresh', '');
});

document.getElementById('returnDislikes').addEventListener('change', () => {
  chrome.storage.sync.set({
    returnDislikes: document.getElementById('returnDislikes').checked,
  });

  document.documentElement.setAttribute('refresh', '');
});

document.getElementById('twitchTheater').addEventListener('change', () => {
  chrome.storage.sync.set({
    twitchTheater: document.getElementById('twitchTheater').checked,
  });

  document.documentElement.setAttribute('refresh', '');
});

document
  .getElementById('experimentalComments')
  .addEventListener('change', () => {
    chrome.storage.sync.set({
      experimentalComments: document.getElementById('experimentalComments')
        .checked,
    });

    document.documentElement.setAttribute('refresh', '');
  });
