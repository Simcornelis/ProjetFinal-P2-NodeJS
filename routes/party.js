const { server } = require("../server.js");
const { Router } = require("express");
const socketIO = require("socket.io");
const fs = require("fs");

const partyRouter = new Router();
const io = socketIO(server);

// TODO implem database interactions
const rooms = {};

partyRouter.get("/:room?", (req, res, next) => {
  if (!req.params.room) return res.redirect("/");
  req.session.isAdmin = rooms[req.params.room] === undefined;
  res.render("party.html", {
    room: req.params.room,
    isAdmin: req.session.isAdmin,
    pseudo: req.session.pseudo,
  });
});

io.on("connection", (socket) => {
  socket.on("new-user", (room, username) => {
    if (!room || !username) return;
    if (!rooms[room]) {
      rooms[room] = { admin: {}, players: {} };
      rooms[room].admin[socket.id] = username;
    }
    socket.join(room);
    rooms[room].players[socket.id] = username;
    io.to(room).emit("all-players", Object.values(rooms[room].players));
  });

  socket.on("next-game", (room) => {
    if (getAdmin(room) != socket.id) return socket.emit("you-are-not-admin");
    console.log("[ROOMS] " + room + ": next game.");
    io.to(room).emit("message", "Next game started.");
    fs.readFile("./private/party/game.xml", (error, fileContent) => {
      if (error) console.error("[ERROR] " + error);
      io.to(room).emit("game", fileContent.toString());
    });
  });

  socket.on("disconnect", () => {
    findUserRooms(socket).forEach((room) => {
      delete rooms[room].players[socket.id];
      if (roomIsEmpty(room)) return delete rooms[room];
      updateAdmin(room, socket.id);
      socket.to(room).emit("all-players", Object.values(rooms[room].players));
      io.to(getAdmin(room)).emit("you-are-now-admin");
    });
  });
});

function findUserRooms(socket) {
  return Object.entries(rooms).reduce((players, [player, room]) => {
    if (room.players[socket.id]) players.push(player);
    return players;
  }, []);
}

function roomIsEmpty(room) {
  return Object.values(rooms[room].players).length === 0;
}

function getAdmin(room) {
  return Object.keys(rooms[room].admin)[0];
}

function updateAdmin(room, oldPlayer) {
  if (getAdmin(room) !== oldPlayer) return;
  const newAdmin = Object.keys(rooms[room].players)[0];
  rooms[room].admin = {};
  rooms[room].admin[newAdmin] = rooms[room].players[newAdmin];
}

module.exports = {
  partyRouter,
};
