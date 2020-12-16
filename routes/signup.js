const { Router } = require("express");

const signupRouter = new Router();

signupRouter.get("/", (req, res, next) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("signup.html", {
    pseudo: req.session.pseudo || "",
    email: req.session.email || "",
    error: error,
  });
});

signupRouter.post("/", (req, res, next) => {
  const { usersCollection } = require("../server.js");
  const { email, pseudo, pass, cpass } = req.body;

  verifyEmailNotUsedYet(email, usersCollection)
    .then(() => checkPasswordConfirmation(pass, cpass))
    .then(() => insertUserInDB(email, pseudo, pass, usersCollection))
    .then((insertedId) => {
      setUserSession(req, pseudo, email, insertedId);
      console.log("[SIGNUP] " + email);
      res.redirect("/");
    })
    .catch((error) => {
      req.session.error = error.message;
      setUserSession(req, pseudo, email);
      console.log("[LOG] " + error);
      res.redirect("/signup");
    });
});

function verifyEmailNotUsedYet(email, collection) {
	return collection
		.findOne({ email })
		.then((found) => {
			if (found) {
				throw new Error("This email is already used for an other account !");
			}
	  	});
}

function checkPasswordConfirmation(password, passwordConfirmation) {
  if (password !== passwordConfirmation)
    throw new Error("Passwords don't match.");
}

function insertUserInDB(email, pseudo, password, collection) {
  return collection.insertOne({ email, pseudo, password, ppic: null}).insertedId;
}

function setUserSession(req, pseudo, email, userID) {
  req.session.pseudo = pseudo;
  req.session.email = email;
  req.session.ppic = "/img/noid.png";
  if (userID) req.session.userID = userID;
  req.session.cookie.maxAge = 3600000 * 48; // 2 days // TODO stayLogged
}

module.exports = {
  signupRouter,
};
