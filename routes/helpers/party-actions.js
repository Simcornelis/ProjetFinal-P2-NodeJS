const io = require("./party-socket").io;
const { ObjectId } = require("mongodb");
const { Party } = require("../../models/Party");
const { updateGameIDs } = require("../../models/Playlist");

const db = require("./party-db");

function assignParty(party, partyCode) {
  if (party) return Object.assign(new Party(), party);
  else return new Party(partyCode);
}

function addPlayerToParty(party, socket, username, userID) {
  if (userID && party.isUserConnected(userID)) {
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
  db.updatePartyDB(party);
}

async function updateSettings(party, settings) {
  Object.assign(party, {
    maxGames: settings.maxGames < 26 ? settings.maxGames * 1 : 200, // extreme max is 200 games
    maxGroups: settings.maxGroups < 11 ? settings.maxGroups * 1 : 25, // extreme max is 25 groups
    level: 0,
  });

  if (settings.categories.length > 0)
    await db.getPlaylistDB(party.playlistID).then((playlist) => {
      updateGameIDs(playlist, settings.categories, party.maxGames);
    });
  else {
    await db.getPlaylistDB(ObjectId(settings.playlist)).then((playlist) => {
      party.playlistMaxGames = playlist.gameIDs.length;
      party.playlistID = ObjectId(settings.playlist);
    });
  }
  return party;
}

function informPlayers(party) {
  io.to(party.getAdmin().socketID).emit("you-are-admin");
  io.to(party.partyCode).emit("players-update", sortObject(party.getPlayers()));
  io.to(party.partyCode).emit("ready-players", party.getReadyPlayers());
  // console.log(party); // DEBUG
  return party;
}

function backToParty(party, socket, toClose) {
  if (party.getAdmin().socketID !== socket.id) {
    socket.emit("you-are-not-admin");
    throw new Error("You are not admin.");
  }

  party.inGame = false;
  io.to(party.partyCode).emit("back-to-party", toClose);
  return party;
}

function disconnectPlayer(party, socket) {
  party.disconnect(socket.id);
  if (party.isEmpty()) return db.removePartyDB(party);
  informPlayers(party);
  db.updatePartyDB(party);
}

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
}

function handleError(error, socket) {
  console.error("[ERROR] " + error.stack);
  if (socket) socket.emit("message", error.message);
}

module.exports = {
  assignParty,
  addPlayerToParty,
  changePlayerTeam,
  updateSettings,
  informPlayers,
  backToParty,
  disconnectPlayer,
  sortObject,
  handleError,
};
