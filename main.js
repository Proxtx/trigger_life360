import { genModule } from "@proxtx/combine/combine.js";
import { genCombine } from "@proxtx/combine-rest/request.js";
import fs from "fs/promises";

export class Trigger {
  userPlaces = {};
  userActionTrigger = {};

  constructor(config, folder) {
    this.config = config;
    this.folder = folder;
    (async () => {
      this.api = await genCombine(
        this.config.apiUrl + "/",
        "public/data.js",
        genModule
      );

      this.html = await fs.readFile(this.folder + "index.html", "utf8");
      this.handler = await fs.readFile(this.folder + "handler.js", "utf8");
    })();
  }

  getSelectionGui = async () => {
    let userPlaces = await this.api.getUserPlaces(this.config.pwd);
    let users = Object.keys(userPlaces);
    let places = {};
    for (let user in userPlaces) {
      if (userPlaces[user]) places[userPlaces[user]] = true;
    }
    places = Object.keys(places);

    return { html: this.html, handler: this.handler, data: { users, places } };
  };

  triggers = async (data, actionName) => {
    let userPlaces = await this.api.getUserPlaces(this.config.pwd);
    if (!userPlaces || userPlaces.success === false) return false;
    let identifier = data.user + actionName;
    if (this.userPlaces[identifier] == userPlaces[data.user]) return false;
    if (data.movement == "arrives" && userPlaces[data.user] == data.place) {
      this.userActionTrigger = {};
      this.userPlaces[identifier] = userPlaces[data.user];
      return true;
    }
    if (
      data.movement == "leaves" &&
      this.userPlaces[identifier] == data.place
    ) {
      if (this.userActionTrigger[identifier] > 1) {
        this.userActionTrigger = {};
        this.userPlaces[identifier] = userPlaces[data.user];
        return true;
      } else {
        this.userActionTrigger[identifier]
          ? this.userActionTrigger++
          : (this.userActionTrigger = 1);
        return false;
      }
    }

    this.userPlaces[identifier] = userPlaces[data.user];
  };
}
