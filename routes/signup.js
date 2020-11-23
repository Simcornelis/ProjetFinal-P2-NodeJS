const { Router } = require("express");

const signupRouter = new Router();

signupRouter.get("/", renderSignup);

function renderSignup(req, res) {
  res.status(200).send("ok");
}

module.exports = {
  signupRouter,
};
