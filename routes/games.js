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
        gameInstruction: game.instruction,
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
      req.body.instruction,
      req.body.description,
      req.body.categories
    )
  );

  res.redirect("/");
});

gamesRouter.get("/findgames", async (req, res, next) => {
  const minigamesCollection = require("../server.js").minigamesCollection;
  let searchQuery = req.query.search_query;
  let filterQuery = req.query.filter_query;
  if (!filterQuery && !searchQuery) {
    return res.json(await minigamesCollection.find({}).toArray());
  } else {
    if (filterQuery && !searchQuery) {
      return getFilteredGames(filterQuery)
        .then((found) => res.json(found))
        .catch((err) => res.status(400).json({ Error: err.toString() }));
    } else if (searchQuery && !filterQuery) {
      return getSearchedGames(searchQuery)
        .then((found) => res.json(found))
        .catch((err) => res.status(400).json({ Error: err.toString() }));
    } else {
      return getFilteredSearchedGames(filterQuery, searchQuery)
        .then((found) => res.json(found))
        .catch((err) => res.status(400).json({ Error: err.toString() }));
    }
  }
});

function getSearchedGames(searchQuery) {
  const minigamesCollection = require("../server.js").minigamesCollection;
  return minigamesCollection
    .find(
      { $text: { $search: searchQuery, $language: "en" } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .toArray();
}

function getFilteredGames(filterQuery) {
  const minigamesCollection = require("../server.js").minigamesCollection;
  let selectedCategories = filterQuery.split(",");
  return minigamesCollection
    .find({ categories: { $all: selectedCategories } })
    .toArray();
}

function getFilteredSearchedGames(filterQuery, searchQuery) {
  const minigamesCollection = require("../server.js").minigamesCollection;
  let selectedCategories = filterQuery.split(",");
  return minigamesCollection
    .find({
      categories: { $all: selectedCategories },
      $text: { $search: searchQuery, $language: "en" },
    })
    .sort({ score: { $meta: "textScore" } })
    .toArray();
}

module.exports = {
  gamesRouter,
};
