const { Router } = require("express");
const { getGameDB } = require("./helpers/party-db");

const playlistRouter = new Router();

playlistRouter.get("/allPlaylists", (req, res, next) => {
  const { playlistsCollection } = require("../server");

  let data = {
    userID: req.session.userID,
    userID_query: req.query.userID_query,
    userName: req.query.userPseudo_query,
  };

  playlistsCollection
    .find({ creatorID: req.query.userID_query })
    .toArray()
    .then(getAllGamesDB)
    .then((playlists) => {
      data.playlists = playlists;
      res.render("allplaylists.html", data);
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/");
    });
});

playlistRouter.get("/", (req, res, next) => {
  if (req.session.userID) {
    res.render("createplaylist.html");
  } else {
    res.redirect("/signin");
  }
});

playlistRouter.post("/createplaylist", (req, res, next) => {
  return new Promise((resolve, reject) => {
    if (!req.session.userID) {
      reject(new Error("User not connected"));
    }
    resolve();
  })
    .then(() => {
      if (!req.body.title || !req.body.title.trim()) {
        throw new Error("Playlist needs a title");
      }
    })
    .then(() => {
      if (
        !req.body.games ||
        !Array.isArray(req.body.games) ||
        req.body.games.length === 0
      ) {
        throw new Error("Cannot create empty playlists");
      }
    })
    .then(() => {
      const { playlistsCollection } = require("../server.js");
      return playlistsCollection.insertOne({
        title: req.body.title,
        creatorID: req.session.userID,
        gameIDs: req.body.games,
      });
    })
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(405).send(error.message));
});

playlistRouter.get("/findplaylists", async (req, res, next) => {
  let userIDQuery = req.query.userID_query;
  let creator_idQuery = req.query.creatorID;
  if (!creator_idQuery) {
    return getAllPlaylists(userIDQuery)
      .then((found) => res.json(found))
      .catch((err) => res.status(400).json({ Error: err.toString() }));
  } else {
    return getMyPlaylists(creator_idQuery, userIDQuery)
      .then((found) => res.json(found))
      .catch((err) => res.status(400).json({ Error: err.toString() }));
  }
});

function getAllPlaylists(userIDQuery) {
  const { playlistsCollection } = require("../server.js");
  if (userIDQuery)
    return playlistsCollection.find({ creatorID: userIDQuery }).toArray();
  else return playlistsCollection.find().toArray();
}

function getMyPlaylists(creator_idQuery, userIDQuery) {
  const { playlistsCollection } = require("../server.js");
  let selectedCategories = creator_idQuery.split(",");
  if (userIDQuery) {
    return playlistsCollection
      .find({
        creatorID: userIDQuery,
        categories: { $all: selectedCategories },
      })
      .toArray();
  } else {
    return playlistsCollection
      .find({ categories: { $all: selectedCategories } })
      .toArray();
  }
}

/**
 * Gets all games of all given playlists
 */
async function getAllGamesDB(playlists) {
  return await Promise.all(
    playlists.map(async (playlist) => ({
      title: playlist.title,
      id: playlist._id,
      games: await Promise.all(
        playlist.gameIDs.map(async (id) => ({
          gameID: id,
          instruction: (await getGameDB(id)).instruction,
        }))
      ),
    }))
  );
}

module.exports = { playlistRouter };
