const { Router } = require("express");

const signinRouter = new Router();

signinRouter.get("/", renderSignin);

function renderSignin(req, res) {
  res.status(200).send("ok");
}

module.exports = {
  signinRouter,
};
