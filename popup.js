chrome.storage.sync.get('experimentalComments', (data) => {
  document.getElementById('experimentalComments').checked =
    data.experimentalComments;
});

document
  .getElementById('experimentalComments')
  .addEventListener('change', () => {
    console.log(document.getElementById('experimentalComments').checked);
    chrome.storage.sync.set({
      experimentalComments: document.getElementById('experimentalComments')
        .checked,
    });
  });
