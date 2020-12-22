const { ObjectId } = require("mongodb");
const { Party } = require("../../models/Party");
const { handleError } = require("./party-actions");

function updatePartyDB(party) {
  const { partiesCollection } = require("../../server");
  partiesCollection
    .replaceOne({ partyCode: party.partyCode }, party, {
      upsert: true, // if not found, inserts a new document
    })
    .catch((error) => handleError(error, socket));
}

function getPartyDB(partyCode, socket) {
  const { partiesCollection } = require("../../server");
  return partiesCollection
    .findOne({ partyCode })
    .then((party) => {
      if (!party) throw new Error("Party not found.");
      return party;
    })
    .then((party) => Object.assign(new Party(), party))
    .catch((error) => {
      socket.emit("party-not-found");
      throw error;
    });
}

function getPlaylistDB(playlistID) {
  const { playlistsCollection } = require("../../server");
  return playlistsCollection
    .findOne({ _id: ObjectId(playlistID) })
    .then((playlist) => {
      if (!playlist) throw new Error("Playlist not found.");
      return playlist;
    })
    .catch(handleError);
}

function getGameDB(gameID) {
  const { gamesCollection } = require("../../server");
  return gamesCollection.findOne({ _id: ObjectId(gameID) }).then((game) => {
    if (!game) throw new Error("Game not found.");
    return game;
  });
}

function getUserPartiesDB(socket) {
  const { partiesCollection } = require("../../server");
  return partiesCollection.find({
    players: { $elemMatch: { socketID: socket } },
  });
}

function removePartyDB(party) {
  const { partiesCollection } = require("../../server");
  removePlaylistDB(party);
  partiesCollection
    .deleteOne({ partyCode: party.partyCode })
    .catch(handleError);
}

function removePlaylistDB(party) {
  const { playlistsCollection } = require("../../server");
  playlistsCollection
    .deleteOne({ _id: ObjectId(party.playlistID) })
    .catch(handleError);
}

module.exports = {
  updatePartyDB,
  getPartyDB,
  getPlaylistDB,
  getGameDB,
  getUserPartiesDB,
  removePartyDB,
  removePlaylistDB,
};
