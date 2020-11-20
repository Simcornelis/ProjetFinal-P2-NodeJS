const express = require("express");
const session = require("express-session");
const consolidate = require("consolidate");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");

if (dotenv.config().error) throw new Error("Error while parsing .env file.");

const DB_URL = `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`;
const MongoClient = new mongodb.MongoClient(DB_URL, {
  useUnifiedTopology: true,
});

let db;
const app = express();
const cred = {
  key: fs.readFileSync("./utils/cert.key"),
  cert: fs.readFileSync("./utils/csr.key"),
  passphrase: process.env.CERT_PASS,
};

https
  .createServer(cred, app)
  .listen(process.env.PORT || 3000, process.env.HOST, () => {
    console.log("[LOG] Web server running!");
    MongoClient.connect(async (err, client) => {
      if (err) {
        console.error(`[ERROR] Couldn't connect to database server\n${err}`);
        return process.exit(-1);
      }
      console.log("[LOG] Connected to database server");
      db = client.db(process.env.DATABASE_NAME);
      module.exports.minigamesCollection = db.collection(
        process.env.DATABASE_MINIGAMES
      );
      module.exports.usersCollection = db.collection(
        process.env.DATABASE_USERS
      );
      module.exports.playlistsCollection = db.collection(
        process.env.DATABASE_PLAYLISTS
      );
      module.exports.partiesCollection = db.collection(
        process.env.DATABASE_PARTIES
      );
    });
  });

app.set("views", ["private/main", "private/signin", "private/signup"]); //Complete with the views

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

// app.use("/", express.static("private/main"));
// app.use("/signin", express.static("private/signin"));
// app.use("/signup", express.static("private/signup"));

// app.use("/", require("./routers/main.js").main);
// app.use("/signin", require("./routers/signin.js").signin);
// app.use("/signup", require("./routers/signup.js").signup);
