const { Router } = require("express");

const mainRouter = new Router();

mainRouter.get("/", (req, res) => {
  res.status(200).render("main.html", {
    userID: req.session.userID,
    ppic:
      req.session.ppic ||
      (req.session.userID ? "/img/nopic.png" : "/img/noid.png"),
  });
});

mainRouter.get("/signout", (req, res) => {
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
