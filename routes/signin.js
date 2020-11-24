const { Router } = require("express");

const signinRouter = new Router();

signinRouter.get("/", (req, res, next) => {
  res.render("signin.html");
});

signinRouter.post("/", (req, res, next) => {
  const usersCollection = require("../server.js").usersCollection;
  const email = req.body.email;
  const password = req.body.pass;

  verifyEmailInDB(email, usersCollection)
    .then((user) => {
      return verifyPasswordFromUser(password, user);
    })
    .then((user) => {
      return createUserSession(user.pseudo, user.email, req);
    })
    .then(() => {
      console.log("[LOG] User loged !");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("[LOG] " + error);
      res.redirect("/signin");
    });
});

function verifyEmailInDB(email, collection) {
  return new Promise((resolve, reject) => {
    collection.findOne({ email: email }).then((found) => {
      if (found) {
        resolve(found);
      } else {
        reject(new Error("This email not recognize"));
      }
    });
  });
}

function verifyPasswordFromUser(password, user) {
  return new Promise((resolve, reject) => {
    if (password === user.password) {
      resolve(user);
    }
    reject(new Error("Password don't correspond for this email !"));
  });
}

function createUserSession(pseudo, email, req) {
  req.session.pseudo = pseudo;
  req.session.email = email;
  req.session.cookie.maxAge = 3600000 * 48; // 2 days
}

module.exports = {
  signinRouter,
};
