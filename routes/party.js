const { Router } = require("express");
const socketIO = require("socket.io");
const server = require("../server.js").server;

const io = socketIO(server);
const partyRouter = new Router();

partyRouter.get("/:admin?", (req, res, next) => {
  if (req.params.admin === "admin") res.render("admin_party.html");
  else res.render("party.html");
});

partyRouter.get("/admin", (req, res, next) => {
  res.render("admin_party.html");
});

io.on("connection", (socket) => {
  socket.on("next-game", () => {
    console.log("next-game on server");
    io.emit("message", "next game has started");
  });
});

module.exports = {
  partyRouter,
};
