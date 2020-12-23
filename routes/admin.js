const { Router } = require("express");

const adminRouter = new Router();

/**
 *            !!! ATTENTION DEVELOPPERS !!!
 *
 * All these routes are for developpement use only and should not
 * be accessible by the end user when the app is deployed.
 */

if (process.env.ENV === "development") {
  adminRouter.all("/", (req, res, next) => {
    if (req.session.email !== process.env.MASTER_USER_EMAIL)
      return res.redirect("/");
    next();
  });

  adminRouter.get("/users", (req, res) => {
    const { usersCollection } = require("../server.js");
    usersCollection
      .find()
      .toArray()
      .then((arr) => res.json(arr));
  });

  adminRouter.get("/games", (req, res) => {
    const { gamesCollection } = require("../server.js");
    gamesCollection
      .find()
      .toArray()
      .then((arr) => res.json(arr));
  });

  adminRouter.get("/playlists", (req, res) => {
    const { playlistsCollection } = require("../server.js");
    playlistsCollection
      .find()
      .toArray()
      .then((arr) => res.json(arr));
  });

  adminRouter.get("/parties", (req, res) => {
    const { partiesCollection } = require("../server.js");
    partiesCollection
      .find()
      .toArray()
      .then((arr) => res.json(arr));
  });

  adminRouter.delete("/users", (req, res) => {
    const { usersCollection } = require("../server.js");
    usersCollection.deleteMany().then(() => {
      res.redirect("/users");
    });
  });

  adminRouter.delete("/playlists", (req, res) => {
    const { playlistsCollection } = require("../server.js");
    playlistsCollection.deleteMany().then(() => {
      res.redirect("/playlists");
    });
  });

  adminRouter.delete("/playlists", (req, res) => {
    const { playlistsCollection } = require("../server.js");
    playlistsCollection.deleteMany().then(() => {
      res.redirect("/playlists");
    });
  });

  adminRouter.delete("/parties", (req, res) => {
    const { partiesCollection } = require("../server.js");
    partiesCollection.deleteMany().then(() => {
      res.redirect("/parties");
    });
  });
}

module.exports = { adminRouter };
