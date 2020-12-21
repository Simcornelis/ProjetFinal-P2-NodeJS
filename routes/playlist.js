const { Router, json } = require("express");
const express = require("express");
const session = require("express-session");
const { ObjectId } = require("mongodb");

const playlistRouter = new Router();
playlistRouter.use(express.json());

playlistRouter.post("/", (req, res, next) => {
	return new Promise((resolve, reject) => {
		if (!req.session.userID) {
			reject(new Error("User not connected"));
		}
		resolve();
	})
	.then(() => {
		if(!req.body.title || !req.body.title.trim()) {
			throw new Error("Playlist needs a title");
		}
	})
	.then(() => {
		if(!req.body.games || !Array.isArray(req.body.games) || req.body.games.length === 0) {
			throw new Error("Cannot create empty playlists");
		}
	})
	/*
	.then(() => {
		const {gamesCollection} = require("../server.js");
		return gamesCollection.indexExists({_id: {
			$in: req.body.games.map((element) => ObjectId(element))
		}});
	})
	.then((result) => {
		if(!result) {
			throw new Error("Invalid game id");
		}
	})
	*/
	.then(() => {
		const {playlistsCollection} = require("../server.js");
		return playlistsCollection.insertOne({
			title: req.body.title,
			creator_id: req.session.userID,
			game_id: req.body.games,
		});
	})
	.then(() => res.sendStatus(200))
	.catch((error) => res.status(405).send(error.message));
});

module.exports = {
	playlistRouter,
}
