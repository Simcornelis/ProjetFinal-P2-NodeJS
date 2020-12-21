const { server } = require("../../server");
const { Party } = require("../../models/Party");

const socketIO = require("socket.io");
exports.io = socketIO(server);

const send = require("./party-send");
const action = require("./party-actions");
const db = require("./party-db");

function runSocketIO() {
  const io = exports.io;

  io.on("connection", (socket) => {
    const { partiesCollection, playlistsCollection } = require("../../server");

    socket.on("new-user", (partyCode, username, userID, team) => {
      if (!partyCode || !username) return;

      partiesCollection
        .findOne({ partyCode })
        .then((found) => action.assignParty(found, partyCode))
        .then((party) =>
          action.addPlayerToParty(party, socket, username, userID, team)
        )
        .then(db.updatePartyDB)
        .catch((error) => action.handleError(error, socket));
    });

    socket.on("next-game", (partyCode, oldGame) => {
      if (!partyCode) return;

      db.getPartyDB(partyCode, socket)
        .then((party) => send.nextGame(party, socket, oldGame))
        .catch((error) => action.handleError(error, socket));
    });

    socket.on("open-settings", (partyCode) => {
      if (!partyCode) return;

      db.getPartyDB(partyCode, socket)
        .then((party) => send.settings(party, socket))
        .catch((error) => action.handleError(error, socket));
    });

    socket.on("change-team", (partyCode, newTeam) => {
      if (!partyCode || !newTeam) return;

      db.getPartyDB(partyCode, socket)
        .then((party) => action.changePlayerTeam(party, socket, newTeam))
        .catch((error) => action.handleError(error, socket));
    });

    socket.on("set-ready-state", (partyCode, isReady) => {
      if (!partyCode) return;

      db.getPartyDB(partyCode, socket)
        .then((party) => party.setReadyState(socket.id, isReady))
        .then(action.informPlayers)
        .then(db.updatePartyDB)
        .catch((error) => action.handleError(error, socket));
    });

    socket.on("back-to-party", (partyCode, toClose) => {
      if (!partyCode) return;

      db.getPartyDB(partyCode, socket)
        .then((party) => action.backToParty(party, socket, toClose))
        .then(db.updatePartyDB)
        .catch((error) => action.handleError(error, socket));
    });

    socket.on("update-settings", (partyCode, settings) => {
      if (!partyCode) return;

      db.getPartyDB(partyCode, socket)
        .then((party) => action.updateSettings(party, settings))
        .then(db.updatePartyDB)
        .catch((error) => action.handleError(error, socket));
    });

    socket.on("get-playlist", (userID) => {
      playlistsCollection
        .find({ creatorID: userID })
        .map((playlist) => playlist.title)
        .toArray()
        .then((playlists) => socket.emit("playlists", playlists));
    });

    socket.on("disconnect", () => {
      db.getUserPartiesDB(socket.id)
        .map((party) => Object.assign(new Party(), party))
        .forEach((party) => action.disconnectPlayer(party, socket));
    });
  });
}

module.exports = { runSocketIO };
