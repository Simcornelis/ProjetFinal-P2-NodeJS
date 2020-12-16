const dotenv = require("dotenv");
const mongodb = require("mongodb");
const fs = require("fs");
const cons = require("consolidate");

if (dotenv.config().error) throw new Error("Error while parsing .env file");

const MongoClient = new mongodb.MongoClient(
  `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`,
  { useUnifiedTopology: true }
);

let db;
let usersCollection;
let minigamesCollection;
let playlistsCollection;
let partiesCollection;

MongoClient.connect(async (err, client) => {
  if (err) {
    console.error(`[ERROR] Couldn't connect to database server\n${err}`);
    return process.exit(-1);
  }

  console.log("[LOG] Connected to database server");
  client.db(process.env.DATABASE_NAME).dropDatabase(); //reset
  db = client.db(process.env.DATABASE_NAME);
  linkCollectionVariables();
  createMiniGamesCollection()
    .then(() => {
      return client.close();
    })
    .then(() => {
      console.log("[LOG] Server Database Closed");
    })
    .catch((err) => {
      console.log("[LOG] ERROR: Server Database not closed properly : " + err);
    });
});

function linkCollectionVariables() {
  usersCollection = db.collection(process.env.DATABASE_USERS);
  minigamesCollection = db.collection(process.env.DATABASE_MINIGAMES);
  playlistsCollection = db.collection(process.env.DATABASE_PLAYLISTS);
  partiesCollection = db.collection(process.env.DATABASE_PARTIES);
}

function createMiniGamesCollection() {
  return minigamesCollection.createIndex(
    {
      _id: "text",
      creatorPseudo: "text",
      creatorID: "text",
      instruction: "text",
      description: "text",
      categories: "text",
    },
    { default_language: "english" }
  );
}
