const { ObjectId } = require("mongodb");
const { Game, categories, emoji } = require("../models/Game");
const { Router } = require("express");

const gamesRouter = new Router();

gamesRouter.get("/gamedata/:id", (req, res, next) => {
  const { gamesCollection } = require("../server.js");
  const gameID = req.params.id;
  gamesCollection.findOne({ _id: ObjectId(gameID) }).then((game) => {
    if (!game.categories) game.categories = [];
    res.render("gamedata.html", {
      instruction: game.instruction,
      description: game.description,
      categories: game.categories.map((cat) => ({ e: emoji(cat), c: cat })),
      gameID: game._id,
      creatorPseudo: game.creatorPseudo || "",
      creatorID: game.creatorID || "",
    });
  });
});

gamesRouter.get("/", (req, res, next) => {
  res.render("allgames.html", {
    userID: req.session.userID,
    userID_query: req.query.userID_query,
    userName: req.query.userPseudo_query,
    categories: Object.entries(categories).map((list) => ({
      e: list[1],
      c: list[0],
    })),
  });
});

gamesRouter.get("/new", (req, res, next) => {
  if (req.session.userID) {
    res.render("addgame.html");
  } else {
    res.redirect("/signin");
  }
});

gamesRouter.post("/new", (req, res, next) => {
  const { gamesCollection } = require("../server.js");
  gamesCollection.insertOne(
    new Game(
      req.session.pseudo,
      req.session.userID,
      req.body.instruction,
      req.body.description,
      req.body.categories
    )
  );

  res.redirect("/games");
});

gamesRouter.get("/findgames", async (req, res, next) => {
  let searchQuery = req.query.search_query;
  let filterQuery = req.query.filter_query;
  let userIDQuery = req.query.userID_query;
  if (!filterQuery && !searchQuery) {
    return getAllGames(userIDQuery)
      .then((found) => res.json(found))
      .catch((err) => res.status(400).json({ Error: err.toString() }));
  } else {
    if (filterQuery && !searchQuery) {
      return getFilteredGames(filterQuery, userIDQuery)
        .then((found) => res.json(found))
        .catch((err) => res.status(400).json({ Error: err.toString() }));
    } else if (searchQuery && !filterQuery) {
      return getSearchedGames(searchQuery, userIDQuery)
        .then((found) => res.json(found))
        .catch((err) => res.status(400).json({ Error: err.toString() }));
    } else {
      return getFilteredSearchedGames(filterQuery, searchQuery, userIDQuery)
        .then((found) => res.json(found))
        .catch((err) => res.status(400).json({ Error: err.toString() }));
    }
  }
});

function getAllGames(userIDQuery) {
  const { gamesCollection } = require("../server.js");
  if (userIDQuery) {
    return gamesCollection.find({ creatorID: userIDQuery }).toArray();
  } else {
    return gamesCollection.find().toArray();
  }
}

function getSearchedGames(searchQuery, userIDQuery) {
  const { gamesCollection } = require("../server.js");
  if (userIDQuery) {
    return gamesCollection
      .find(
        {
          creatorID: userIDQuery,
          $text: { $search: searchQuery, $language: "en" },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .toArray();
  } else {
    return gamesCollection
      .find(
        { $text: { $search: searchQuery, $language: "en" } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .toArray();
  }
}

function getFilteredGames(filterQuery, userIDQuery) {
  const { gamesCollection } = require("../server.js");
  let selectedCategories = filterQuery.split(",");
  if (userIDQuery) {
    return gamesCollection
      .find({
        creatorID: userIDQuery,
        categories: { $all: selectedCategories },
      })
      .toArray();
  } else {
    return gamesCollection
      .find({ categories: { $all: selectedCategories } })
      .toArray();
  }
}

function getFilteredSearchedGames(filterQuery, searchQuery, userIDQuery) {
  const { gamesCollection } = require("../server.js");
  let selectedCategories = filterQuery.split(",");
  if (userIDQuery) {
    return gamesCollection
      .find({
        creatorID: userIDQuery,
        categories: { $all: selectedCategories },
        $text: { $search: searchQuery, $language: "en" },
      })
      .sort({ score: { $meta: "textScore" } })
      .toArray();
  } else {
    return gamesCollection
      .find({
        categories: { $all: selectedCategories },
        $text: { $search: searchQuery, $language: "en" },
      })
      .sort({ score: { $meta: "textScore" } })
      .toArray();
  }
}

module.exports = {
  gamesRouter,
};
