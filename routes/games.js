const mongodb = require("mongodb");
const game = require("../models/Game");
const { Router } = require("express");

const gamesRouter = new Router();

gamesRouter.get("/gamedata/:id?", (req, res, next) => {
  const minigamesCollection = require("../server.js").minigamesCollection;
  const gameID = req.params.id;
  minigamesCollection
    .findOne({ _id: mongodb.ObjectID(gameID) })
    .then((game) => {
      let categories = Array.isArray(game.categories)
        ? game.categories
        : [game.categories];
      //Always be an array (to not split the word)
      res.render("gamedata.html", {
        gameID: game._id,
        creatorPseudo: game.creatorPseudo || "Unknown creator",
        creatorID: game.creatorID,
        gameConsign: game.consign,
        gameDescription: game.description,
        category1: categories[0],
        category2: categories[1],
        category3: categories[2],
        category4: categories[3],
      });
    });
});

gamesRouter.get("/allgames", (req, res, next) => {
  res.render("allgames.html");
});

gamesRouter.get("/addgame", (req, res, next) => {
  res.render("addgame.html");
});

gamesRouter.post("/addgame", (req, res, next) => {
  const minigamesCollection = require("../server.js").minigamesCollection;
  minigamesCollection.insertOne(
    new game.Game(
      req.session.pseudo,
      req.session._id,
      req.body.consign,
      req.body.description,
      req.body.categories
    )
  );

  res.redirect("/");
});

gamesRouter.get("/findgames", async (req, res, next) => {
  const minigamesCollection = require("../server.js").minigamesCollection;
  return res.json(await minigamesCollection.find({}).toArray());
});

module.exports = {
  gamesRouter,
};
