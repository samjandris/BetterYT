import './events';
import { STORAGE_DEFAULT } from './utils';

chrome.storage.sync.get(STORAGE_DEFAULT, (data) => {
  if (data.miniPlayer) {
    import('../css/mini_player.scss');
    import('./modules/mini_player');
  }

  // Dislikes are broken at the moment, so they're disabled
  // if (data.returnDislikes) {
  //   import('./modules/dislikes');
  // }

  if (data.twitchTheater) {
    import('../css/theater.scss');
    import('./modules/theater');
  }

  if (data.pipButton) {
    import('../css/pip.scss');
    import('./modules/pip');
  }

  if (data.experimentalComments) {
    import('../css/comments.scss');
    import('./modules/comments');
  }
});
