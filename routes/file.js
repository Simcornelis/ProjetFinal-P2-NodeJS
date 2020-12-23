const { Router } = require("express");
const mongodb = require("mongodb");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const fileRouter = new Router();

/**
 * Multer is a middleware to handle files.
 * We define a unique name to a file and store it in
 * the './ppic/' folder.
 */
var storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./ppic/"),
  filename: (req, file, cb) => {
    const rand = Math.ceil(Math.random() * 1000);
    const ext = file.originalname.split(".").reverse()[0];
    cb(null, `${Date.now()}_${rand}.${ext}`);
  },
});
var upload = multer({ storage: storage });

fileRouter.post("/", makePpicDir, upload.single("file"));
/**
 * Take a saved picture's file and compress it.
 * Then suppress the initial stored file and store the compressed file.
 */
fileRouter.post("/", function (req, res, next) {
  if (!req.file) return res.sendStatus(400);
  if (!fs.existsSync("ppic")) fs.mkdirSync("./ppic"); // create ppic dir

  const output = "p" + req.file.filename.split(".")[0] + ".jpg";

  // req.file.path is set by the middleware in req, it's the path of what it saved
  sharp(req.file.path) // compress image
    .resize(512, 512, { fit: "cover" }) // crop
    .jpeg({ quality: 80 }) // jpeg compression ratio 80%
    .toFile("./ppic/" + output)
    .then(() => {
      console.log("[FILE] " + output + " has been saved.");
      try {
        fs.unlinkSync(req.file.path); // delete uncompressed version
      } catch (err) {
        console.error(err);
      }
      req.session.ppic = "/ppic/" + output;
      updatePictureInDBAndFile(output, req.session.userID);
    })
    .then(() => res.status(200).json({ filename: output }))
    .catch((err) => {
      console.log("[error] " + err);
      res.sendStatus(500);
    });
});

fileRouter.delete("/", function (req, res) {
  updatePictureInDBAndFile(null, req.session.userID)
    .then(() => {
      req.session.ppic = null;
      console.log("[FILE] " + req.session.pseudo + "'s ppic deleted.");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("[error] " + err);
      res.sendStatus(500);
    });
});

function updatePictureInDBAndFile(output, userID) {
  const usersCollection = require("../server.js").usersCollection;
  usersCollection.findOne({ _id: mongodb.ObjectId(userID) }).then((user) => {
    if (user && user.ppic && !user.ppic.includes("http")) {
      try {
        fs.unlinkSync("ppic/" + user.ppic); // delete old ppic
      } catch (err) {
        console.error(err.message);
      }
    }
  });
  return usersCollection.updateOne(
    { _id: mongodb.ObjectId(userID) },
    { $set: { ppic: output } }
  );
}

function makePpicDir(req, res, next) {
  if (!fs.existsSync("ppic")) fs.mkdirSync("./ppic");
  next();
}
module.exports = {
  fileRouter,
};
