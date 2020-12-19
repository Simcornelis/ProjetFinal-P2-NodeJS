const dotenv = require("dotenv");
const mongodb = require("mongodb");

if (dotenv.config().error) throw new Error("Error while parsing .env file.");

const MongoClient = new mongodb.MongoClient(
  `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`,
  { useUnifiedTopology: true }
);

let db;
let usersCollection; // REMOVE excess
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
    .then(() => createUsersCollection())
    .then(() => usersCollection.insertMany(require("./users.json")))
    .then(() => console.log("[LOG] Inserted users"))
    .then(() => minigamesCollection.insertMany(require("./games.json")))
    .then(() => console.log("[LOG] Inserted minigames"))
    .then(() => client.close())
    .then(() => console.log("[LOG] Database server closed."))
    .catch((err) => console.error(`[ERROR] Database server error: ${err}`));
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

function createUsersCollection() {
  return usersCollection.createIndex(
    {
      _id: "text",
      email: "text",
      pseudo: "text",
      password: "text",
      ppic: "text",
    }
  );
}
