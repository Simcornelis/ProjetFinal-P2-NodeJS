const { Router, json } = require("express");
const express = require("express");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const fs = require("fs");

const profileRouter = new Router();
profileRouter.use(express.json());

profileRouter.get("/", (req, res) => {
  if (req.session.userID) {
    return res.render("profile.html", {
      userPseudo: req.session.pseudo,
      userEmail: req.session.email,
      userID: req.session.userID,
      userppic: req.session.ppic,
    });
  }
  return res.redirect("/signin");
});

profileRouter.get("/:id?", (req, res, next) => {
  userID = ObjectId(req.params.id);
  console.log(userID);
  if (userID === req.session.userID) {
    res.redirect("/profile");
  } else {
    return getUserData(userID).then((userData) => {
      console.log(userData);
      res.render("profile.html", {
        userPseudo: userData.pseudo,
        userEmail: userData.email,
        userID: userID,
        userppic: userData.ppic,
      });
    });
  }
});

async function getUserData(userID) {
  const usersCollection = require("../server.js").usersCollection;
  return usersCollection.findOne({ _id: userID });
}

profileRouter.put("/pseudo", (req, res, next) => {
  const usersCollection = require("../server.js").usersCollection;
  return new Promise((resolve, reject) => {
    if (!req.session.userID) {
      reject(new Error("User not connected"));
    }
    resolve();
  })
    .then(() =>
      usersCollection.updateOne(
        { _id: ObjectId(req.session.userID) },
        { $set: { pseudo: req.body.pseudo } }
      )
    )
    .then(() => usersCollection.findOne({ _id: ObjectId(req.session.userID) }))
    .then(() => (req.session.pseudo = req.body.pseudo))
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(405).send(error.message));
});

profileRouter.put("/ppic", (req, res, next) => {
  const usersCollection = require("../server.js").usersCollection;
  return new Promise((resolve, reject) => {
    if (!req.session.userID) {
      reject(new Error("User not connected"));
    }
    if (!req.files) {
      reject(new Error("No file uploaded"));
    }
    resolve();
  })
    .then(() => usersCollection.findOne({ _id: ObjectId(req.session.userID) }))
    .then((user) => user.ppic)
    .then((path) => {
      if (path) {
        return fs.promises.unlink(`./ppic/${path}`);
      }
    })
    .then(() => `${req.session.userID}.${req.files.ppic.name.split(".").pop()}`)
    .then((name) => {
      req.files.ppic.mv(`./ppic/${name}`);
      return name;
    })
    .then((name) => {
      req.session.ppic = `./ppic/${name}`;
      return name;
    })
    .then((name) =>
      usersCollection.updateOne(
        { _id: ObjectId(req.session.userID) },
        { $set: { ppic: name } }
      )
    )
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(405).send(error.message));
});

profileRouter.delete("/ppic", (req, res, next) => {
  const usersCollection = require("../server.js").usersCollection;
  return new Promise((resolve, reject) => {
    if (!req.session.userID) {
      reject(new Error("User not connected"));
    }
    resolve();
  })
    .then(() => usersCollection.findOne({ _id: ObjectId(req.session.userID) }))
    .then((user) => user.ppic)
    .then((path) => {
      if (path) {
        return fs.promises.unlink(`./ppic/${path}`);
      }
    })
    .then(() =>
      usersCollection.updateOne(
        { _id: ObjectId(req.session.userID) },
        { $set: { ppic: null } }
      )
    )
    .then(() => (req.session.ppic = "/img/noid.png"))
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(405).send(error.message));
});

module.exports = { profileRouter };
