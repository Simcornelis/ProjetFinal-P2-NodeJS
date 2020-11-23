const { Router } = require("express");

const mainRouter = new Router();

mainRouter.get("/", renderMain);

/**
 * Renders the main page with the user's session data.
 */
function renderMain(req, res) {
  res.status(200).render("main.html", {
    ppic: profilePicture(req),
    name: req.session.name,
    id: req.session.id,
  });
}

/**
 * Determines wich profile picture should be rendered.
 * @param {object} req http GET request
 */
function profilePicture(req) {
  if (!req.session.ppic) req.session.ppic = "noid.png";
  var ppic = req.session.ppic;
  if (!ppic.includes("http"))
    ppic = req.protocol + "://" + req.get("host") + "/ppic/" + ppic;
  return ppic;
}

module.exports = {
  mainRouter,
  profilePicture,
};
