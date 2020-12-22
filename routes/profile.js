const { Router, json } = require("express");
const express = require("express");
const session = require("express-session");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const { profile } = require("console");

const profileRouter = new Router();
profileRouter.use(express.json());

/**
 * Render the profile page of a user. If there is no params in the request and no user loged, redirect to the login page.
 */
profileRouter.get("/:id?", (req, res, next) => {
  if (!(req.params.id || req.session.userID)) {
    req.session.nextPage = "/profile";
    req.session.Error = "You have to log in first";
    return res.redirect(`/signin`);
  }

  const url = req.params.id || req.session.userID;
  const usersCollection = require("../server.js").usersCollection;

  usersCollection
    .findOne({ _id: ObjectId(url) })
    .then(loadProfile)
    .catch((err) => console.error("[ERROR] " + err));

  function loadProfile(user) {
    if (!user) throw new Error("User not found.");
    if (user.ppic && !user.ppic.includes("http"))
      user.ppic = "/ppic/" + user.ppic;
    res.render("profile.html", {
      userPseudo: user.pseudo,
      userEmail: user.email,
      userppic:
        user.ppic || (req.session.userID ? "/img/nopic.png" : "/img/noid.png"),
      userID: user._id,
      canChange: req.session.userID === user._id.toString(),
    });
  }
});

profileRouter.put("/changepseudo", async (req, res, next) => {
  let userID = req.session.userID;

  if (!userID) {
    req.session.nextPage = "/profile";
    req.session.Error = "You have to log in first";
    return res.redirect(`/signin`);
  }

  let newPseudo = req.query.query_pseudo;

  const usersCollection = require("../server.js").usersCollection;
  usersCollection
    .updateOne(
      {
        _id: ObjectId(userID),
      },
      { $set: { pseudo: newPseudo } }
    )
    .then(() => {
      req.session.userPseudo = newPseudo;
      console.log("Pseudo Changed");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("[error] " + err);
      res.sendStatus(500);
    });
});

module.exports = { profileRouter };
