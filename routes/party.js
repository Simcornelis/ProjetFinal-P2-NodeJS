const { Router } = require("express");
const socketIO = require("socket.io");
const server = require("../server.js").server;

const io = socketIO(server);
const partyRouter = new Router();

const players = {};

// TODO change params to session isAdmin or other...
partyRouter.get("/:admin?", (req, res, next) => {
  if (req.params.admin === "admin") res.render("admin_party.html");
  else res.render("party.html");
});

io.on("connection", (socket) => {
  socket.on("new-user", (username) => {
    players[socket.id] = username;
    io.emit("all-players", Object.values(players));
  });

  socket.on("next-game", () => {
    console.log("next-game on server");
    io.emit("message", "next game has started");
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("all-players", Object.values(players));
  });
});

module.exports = {
  partyRouter,
};
