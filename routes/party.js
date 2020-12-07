const { Party } = require("../models/Party");
const { server } = require("../server");
const { Router } = require("express");
const socketIO = require("socket.io");
const consolidate = require("consolidate");

const partyRouter = new Router();
const io = socketIO(server);

partyRouter.get("/:partyCode?", (req, res, next) => {
  if (!req.params.partyCode) return res.redirect("/");
  res.render("party.html", {
    partyCode: req.params.partyCode,
    pseudo: req.session.pseudo,
    userID: req.session.userID,
  });
});

io.on("connection", (socket) => {
  const { partiesCollection } = require("../server.js");

  socket.on("new-user", (partyCode, username, userID, team) => {
    if (!partyCode || !username) return;

    partiesCollection
      .findOne({ partyCode })
      .then((found) => assignParty(found, partyCode))
      .then((party) => addPlayerToParty(party, socket, username, userID, team))
      .then(updatePartyDB)
      .catch((error) => console.error("[ERROR] " + error.stack));
  });

  socket.on("next-game", (partyCode) => {
    if (!partyCode) return;

    getPartyDB(partyCode)
      .then((party) => sendNextGame(party, socket))
      .catch((error) => {
        console.error("[ERROR] " + error.stack);
        socket.emit("message", error.message);
      });
  });

  socket.on("change-team", (partyCode, newTeam) => {
    if (!partyCode || !newTeam) return;
    getPartyDB(partyCode)
      .then((party) => {
        party.teamChange(socket.id, newTeam);
        io.to(partyCode).emit("players-update", party.getPlayers());
        return party;
      })
      .then(updatePartyDB)
      .catch((error) => console.error("[ERROR] " + error.stack));
  });

  socket.on("disconnect", () => {
    getUserPartiesDB(socket.id)
      .map((party) => Object.assign(new Party(), party))
      .forEach((party) => disconnectPlayer(party, socket));
  });
});

// New user functions

function assignParty(party, partyCode) {
  if (party) return Object.assign(new Party(), party);
  else return new Party(partyCode);
}

function addPlayerToParty(party, socket, username, userID) {
  if (party.isSocketUsed(socket) || (userID && party.isUserConnected(userID))) {
    socket.emit("already-connected");
    throw new Error("User already connected.");
  }

  party.connect(socket.id, username, userID);
  socket.join(party.partyCode);
  io.to(party.getAdmin().socketID).emit("you-are-now-admin");
  io.to(party.partyCode).emit("players-update", party.getPlayers());
  console.log(party.getTeams()); // REMOVE
  return party;
}

// Next game functions

function sendNextGame(party, socket) {
  if (party.getAdmin().socketID !== socket.id) {
    socket.emit("you-are-not-admin");
    throw new Error("You are not admin.");
  }

  console.log("[PARTY:" + party.partyCode + "] next game.");
  consolidate
    .hogan("./private/party_settings.xml", { testerio: "Yolo" })
    .then((html) => io.to(party.partyCode).emit("game", html))
    .catch(console.error);
}

function disconnectPlayer(party, socket) {
  party.disconnect(socket.id);
  if (party.isEmpty()) return removePartyDB(party);
  io.to(party.getAdmin().socketID).emit("you-are-now-admin");
  io.to(party.partyCode).emit("players-update", party.getPlayers());
  updatePartyDB(party);
}

// DB functions

function updatePartyDB(party) {
  const { partiesCollection } = require("../server.js");
  partiesCollection
    .replaceOne({ partyCode: party.partyCode }, party, {
      upsert: true, // if not found, inserts a new document
    })
    .catch((error) => console.error("[ERROR] " + error.stack));
}

function getPartyDB(partyCode) {
  const { partiesCollection } = require("../server.js");
  return partiesCollection
    .findOne({ partyCode })
    .then((party) => {
      if (!party) throw new Error("Party not found.");
      return party;
    })
    .then((party) => Object.assign(new Party(), party));
}

function getUserPartiesDB(socket) {
  const { partiesCollection } = require("../server.js");
  return partiesCollection.find({
    players: { $elemMatch: { socketID: socket } },
  });
}

function removePartyDB(party) {
  const { partiesCollection } = require("../server.js");
  partiesCollection
    .deleteOne({ partyCode: party.partyCode })
    .catch((error) => console.error("[ERROR] " + error.stack));
}

module.exports = { partyRouter };
