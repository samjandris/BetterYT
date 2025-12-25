import "./events";
import { STORAGE_DEFAULT } from "./utils";

chrome.storage.sync.get(STORAGE_DEFAULT, (data) => {
  if (data.miniPlayer) {
    require("../css/mini_player.scss");
    require("./modules/mini_player");
  }

  if (data.returnDislikes) {
    require("./modules/dislikes");
  }

  if (data.twitchTheater) {
    require("../css/theater.scss");
    require("./modules/theater");
  }

  if (data.pipButton) {
    require("../css/pip.scss");
    require("./modules/pip");
  }

  if (data.experimentalComments) {
    require("../css/comments.scss");
    require("./modules/comments");
  }
});
