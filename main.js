import { genModule } from "@proxtx/combine/combine.js";
import { genCombine } from "@proxtx/combine-rest/request.js";
import fs from "fs/promises";

export class Trigger {
  cashedUserPlaces = {};

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

  triggers = async (data, triggerConfig) => {
    let userPlaces = await this.api.getUserPlaces(this.config.pwd);
    if (!userPlaces || userPlaces.success === false)
      return this.cashedUserPlaces[triggerConfig.id];

    let triggering = userPlaces[data.user] == data.place;

    if (triggering != this.cashedUserPlaces[triggerConfig.id]) {
      await new Promise((r) => setTimeout(r, 60000));
      userPlaces = await this.api.getUserPlaces(this.config.pwd);
      triggering = userPlaces[data.user] == data.place;
    }

    let returnBool = triggering;

    /*if (this.cashedUserPlaces[triggerConfig.id] == triggering) {
      returnBool = triggering;
    }*/

    this.cashedUserPlaces[triggerConfig.id] = triggering;
    return returnBool;
  };
}
