const { Router } = require("express");

const mainRouter = new Router();

mainRouter.get("/", renderMain);

/**
 * Renders the main page with the user's session data.
 */
function renderMain(req, res) {
  res.status(200).render("main.html", {
    ppic: req.session.ppic,
    pseudo: req.session.pseudo,
    email: req.session.email,
    userID: req.session.userID,
  });
}

mainRouter.get("/signout", (req, res, next) => {
  const email = req.session.email;
  req.session.destroy((error) => {
    if (error) return console.error("[LOG]", error);
    console.log("[SIGNOUT] " + email);
    res.redirect("/");
  });
});

module.exports = {
  mainRouter,
};
