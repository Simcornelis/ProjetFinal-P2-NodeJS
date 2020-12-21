const { Router } = require("express");
require("./helpers/party-socket").runSocketIO();

const partyRouter = new Router();

partyRouter.get("/:partyCode?", (req, res, next) => {
  if (!req.params.partyCode) return res.redirect("/");
  res.render("party.html", {
    partyCode: req.params.partyCode,
    pseudo: req.session.pseudo,
    userID: req.session.userID,
  });
});

module.exports = { partyRouter };
