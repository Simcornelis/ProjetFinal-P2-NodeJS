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
      .catch(handleError);
  });

  socket.on("next-game", (partyCode, oldGame) => {
    if (!partyCode) return;

    getPartyDB(partyCode)
      .then((party) => sendNextGame(party, socket, oldGame))
      .catch((error) => handleError(error, socket));
  });

  socket.on("open-settings", (partyCode) => {
    if (!partyCode) return;

    getPartyDB(partyCode)
      .then((party) => sendSettings(party, socket))
      .catch((error) => handleError(error, socket));
  });

  socket.on("change-team", (partyCode, newTeam) => {
    if (!partyCode || !newTeam) return;

    getPartyDB(partyCode)
      .then((party) => changePlayerTeam(party, socket, newTeam))
      .catch(handleError);
  });

  socket.on("set-ready-state", (partyCode, isReady) => {
    if (!partyCode) return;

    getPartyDB(partyCode)
      .then((party) => party.setReadyState(socket.id, isReady))
      .then(informPlayers)
      .then(updatePartyDB)
      .catch((error) => handleError(error, socket));
  });

  socket.on("back-to-party", (partyCode, toClose) => {
    if (!partyCode) return;

    getPartyDB(partyCode)
      .then((party) => backToParty(party, socket, toClose))
      .catch((error) => handleError(error, socket));
  });

  socket.on("disconnect", () => {
    getUserPartiesDB(socket.id)
      .map((party) => Object.assign(new Party(), party))
      .forEach((party) => disconnectPlayer(party, socket));
  });
});

// --- user --- //

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
  if (party.getOnlinePlayers().length <= 1) socket.emit("choose-team-name");
  informPlayers(party);
  return party;
}

function changePlayerTeam(party, socket, newTeam) {
  party.teamChange(socket.id, newTeam);
  informPlayers(party);
  updatePartyDB(party);
}

function informPlayers(party) {
  io.to(party.getAdmin().socketID).emit("you-are-admin");
  io.to(party.partyCode).emit("players-update", sortObject(party.getPlayers()));
  io.to(party.partyCode).emit("ready-players", party.getReadyPlayers());
  console.log(party.getTeams()); // REMOVE
  return party;
}

function backToParty(party, socket, toClose) {
  if (party.getAdmin().socketID !== socket.id) {
    socket.emit("you-are-not-admin");
    throw new Error("You are not admin.");
  }

  io.to(party.partyCode).emit("back-to-party", toClose);
}

function disconnectPlayer(party, socket) {
  party.disconnect(socket.id);
  if (party.isEmpty()) return removePartyDB(party);
  informPlayers(party);
  updatePartyDB(party);
}

// --- send html --- //

function sendNextGame(party, socket, oldGame) {
  if (party.getAdmin().socketID !== socket.id) {
    socket.emit("you-are-not-admin");
    throw new Error("You are not admin.");
  }

  party.level++;
  console.log(`[PARTY:${party.partyCode}] Level ${party.level}.`);
  // TODO load game data
  consolidate
    .hogan("./private/game.xml", { level: party.level })
    .then((html) => io.to(party.partyCode).emit("game", html, oldGame))
    .then(() => informPlayers(party))
    .then(updatePartyDB)
    .catch(handleError);
}

function sendSettings(party, socket) {
  // TODO load party settings
  if (party.getAdmin().socketID !== socket.id) {
    socket.emit("you-are-not-admin");
    throw new Error("You are not admin.");
  }

  consolidate
    .hogan("./private/party_settings.xml", {})
    .then((html) => io.to(socket.id).emit("settings", html))
    .catch(handleError);
}

// --- database --- //

function updatePartyDB(party) {
  const { partiesCollection } = require("../server.js");
  partiesCollection
    .replaceOne({ partyCode: party.partyCode }, party, {
      upsert: true, // if not found, inserts a new document
    })
    .catch(handleError);
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
    .catch(handleError);
}

// --- utilities --- //

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
}

function handleError(error, socket) {
  console.error("[ERROR] " + error.stack);
  if (socket) socket.emit("message", error.message);
}

module.exports = { partyRouter };
