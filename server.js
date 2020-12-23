const express = require("express");
const session = require("express-session");
const consolidate = require("consolidate");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");

if (dotenv.config().error) throw new Error("Error while parsing .env file.");

const MONGO_URL = `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
const MongoClient = new mongodb.MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});

const app = express();
const credentials = {
  key: fs.readFileSync("./utils/cert.key"),
  cert: fs.readFileSync("./utils/csr.key"),
  passphrase: process.env.CERT_PASS,
};

module.exports.server = https
  .createServer(credentials, app)
  .listen(process.env.PORT, process.env.HOST, initServer);

function initServer() {
  console.log("[SERVER] Web server is running.");
  MongoClient.connect(async (err, client) => {
    if (err) {
      console.error(`[ERROR] Can't connect to database.\n${err}`);
      return process.exit(-1);
    }

    console.log("[SERVER] Database is running.");
    const database = client.db(process.env.DATABASE_NAME);

    database
      .collection(process.env.DATABASE_PARTIES)
      .deleteMany()
      .catch(console.error); // Clear parties if server restarts

    database
      .collection(process.env.DATABASE_PLAYLISTS)
      .deleteMany({ creatorID: null })
      .catch(console.error); // Clear unsaved playlists if server restarts

    module.exports = {
      gamesCollection: database.collection(process.env.DATABASE_GAMES),
      playlistsCollection: database.collection(process.env.DATABASE_PLAYLISTS),
      partiesCollection: database.collection(process.env.DATABASE_PARTIES),
      usersCollection: database.collection(process.env.DATABASE_USERS),
    };
  });
}

app.engine("html", consolidate.hogan);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  })
);

app.set("views", "private");
app.use(express.static("static"));
app.use("/ppic", express.static("./ppic"));

app.use(require("./routes/main.js").mainRouter);
app.use("/signin", require("./routes/signin.js").signinRouter);
app.use("/signup", require("./routes/signup.js").signupRouter);
app.use("/profile", require("./routes/profile.js").profileRouter);
app.use("/file", require("./routes/file.js").fileRouter);
app.use("/admin", require("./routes/admin.js").adminRouter);
app.use("/games", require("./routes/games.js").gamesRouter);
app.use("/party", require("./routes/party.js").partyRouter);
app.use("/playlists", require("./routes/playlists.js").playlistRouter);

// handle 404 not found error
app.use((req, res) => {
  res.status(404).send("404: Page not Found 🤔");
});

// handle 500 server error
app.use((error, req, res) => {
  console.error("[ERROR] " + error.message);
  res.status(500).send("500: Internal Server Error 🐛");
});
