document
  .querySelector('#primary-inner')
  .appendChild(document.querySelector('#related'));
// document
//   .querySelector('#secondary-inner')
//   .appendChild(document.querySelector('#comments'));

var el = document.createElement('div');
el.style.overflow = 'auto';
el.style.position = 'fixed';
el.style.marginRight = '10px';
el.style.height = 'calc(100vh - 90px)';
el.appendChild(document.querySelector('#comments'));
document.querySelector('#secondary-inner').appendChild(el);

// document
//   .evaluate(
//     '//*[@id="comments"]/ytd-comments',
//     document,
//     null,
//     XPathResult.FIRST_ORDERED_NODE_TYPE,
//     null
//   )
//   .singleNodeValue.removeChild();

// document
//   .evaluate(
//     '//*[@id="secondary-inner"]/div[3]',
//     document,
//     null,
//     XPathResult.FIRST_ORDERED_NODE_TYPE,
//     null
//   )
//   .singleNodeValue.removeChild();
