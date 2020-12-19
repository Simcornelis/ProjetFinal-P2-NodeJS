const dotenv = require("dotenv");
const { ObjectId, MongoClient } = require("mongodb");

if (dotenv.config().error) throw new Error("Error while parsing .env file.");

const MongoClient = new MongoClient(
  `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`,
  { useUnifiedTopology: true }
);

const db = client.db(process.env.DATABASE_NAME);
const minigamesCollection = db.collection(process.env.DATABASE_MINIGAMES);

MongoClient.connect(async (err, client) => {
  if (err) {
    console.error(`[ERROR] Couldn't connect to database server\n${err}`);
    return process.exit(-1);
  }

  console.log("[LOG] Connected to database server");
  db.dropDatabase() // reset database
    .then(createMiniGamesCollection)
    .then(() =>
      minigamesCollection.insertMany(assignObjectId(require("./users.json")))
    )
    .then(() => console.log("[LOG] Inserted users"))
    .then(() =>
      minigamesCollection.insertMany(assignObjectId(require("./games.json")))
    )
    .then(() => console.log("[LOG] Inserted minigames"))
    .then(() => client.close())
    .then(() => console.log("[LOG] Database server closed."))
    .catch((err) => console.error(`[ERROR] Database server error: ${err}`));
});

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

function assignObjectId(collection) {
  return collection.map(
    (game) => Object.assign(game, { _id: ObjectId(game._id) }) // String to mongo's ObjectId
  );
}
