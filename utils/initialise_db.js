const dotenv = require("dotenv");
const { ObjectId, MongoClient } = require("mongodb");

if (dotenv.config().error) throw new Error("Error while parsing .env file.");

const client = new MongoClient(
  `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`,
  { useUnifiedTopology: true }
);

client.connect(async (err, client) => {
  if (err) {
    console.error(`[ERROR] Couldn't connect to database server\n${err}`);
    return process.exit(-1);
  }

  const db = client.db(process.env.DATABASE_NAME);
  const gamesCollection = db.collection(process.env.DATABASE_GAMES);
  const usersCollection = db.collection(process.env.DATABASE_USERS);

  console.log("[LOG] Connected to database server");
  db.dropDatabase() // reset database
    .then(() => createGamesCollection(gamesCollection))
    .then(() => usersCollection.insertMany(assignObjectId(require("./users.json"))))
    .then(() => console.log("[LOG] Inserted users"))
    .then(() => gamesCollection.insertMany(assignObjectId(require("./games.json"))))
    .then(() => console.log("[LOG] Inserted games"))
    .then(() => client.close())
    .then(() => console.log("[LOG] Database server closed."))
    .catch((err) => console.error(`[ERROR] Database server error: ${err}`));
});

function createGamesCollection(gamesCollection) {
  return gamesCollection.createIndex(
    {
      _id: "text",
      creatorPseudo: "text",
      creatorID: "text",
      instruction: "text",
      description: "text",
    },
    { default_language: "english" }
  );
}

function createPlaylistsCollection(playlistsCollection) {
  return playlistsCollection.createIndex(
    {
      _id: "text",
      title: "text",
      creatorID: "text",
    },
    { default_language: "english" }
  );
}

function assignObjectId(collection) {
  return collection.map(
    (game) => Object.assign(game, { _id: ObjectId() }) // String to mongo's ObjectId
  );
}
