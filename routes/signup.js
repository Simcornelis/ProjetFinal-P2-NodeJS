const { Router } = require("express");
const signupRouter = new Router();

signupRouter.get("/", (req, res, next) => {
  res.render("signup.html");
});

signupRouter.post("/", (req, res, next) => {
  const usersCollection = require("../server.js").usersCollection;
  const email = req.body.email;
  const pseudo = req.body.pseudo;
  const password = req.body.pass;
  const passwordConfirmation = req.body.cpass;

  checkPasswordConfirmation(password, passwordConfirmation)
    .then(() => {
      return verifyEmailNotUsedYet(email, usersCollection);
    })
    .then(() => {
      return insertUserInDB(email, pseudo, password, usersCollection);
    })
    .then(() => {
      return createUserSession(pseudo, email, req);
    })
    .then(() => {
      console.log("[LOG] User added to database !");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("[LOG] " + error);
      res.redirect("/signup");
    });
});

function checkPasswordConfirmation(password, passwordConfirmation) {
  return new Promise((resolve, reject) => {
    if (password != passwordConfirmation) {
      reject(new Error("Password and password's confirmation don't match !"));
    } else resolve();
  });
}

function verifyEmailNotUsedYet(email, collection) {
  return new Promise((resolve, reject) => {
    collection.findOne({ email: email }).then((found) => {
      if (found) {
        reject(new Error("This email is already used for an other account !"));
      } else {
        resolve();
      }
    });
  });
}

function createUserSession(pseudo, email, req) {
  req.session.pseudo = pseudo;
  req.session.email = email;
  req.session.cookie.maxAge = 3600000 * 48; // 2 days
}

function insertUserInDB(email, pseudo, password, collection) {
  collection.insertOne({ email: email, pseudo: pseudo, password: password });
}

module.exports = {
  signupRouter,
};
