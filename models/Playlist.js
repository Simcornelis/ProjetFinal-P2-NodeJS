const { ObjectId } = require("mongodb");

class Playlist {
  title;
  partyCode;
  creatorID;
  gameIDs;

  constructor(title, partyCode, creatorID, gameIDs = []) {
    Object.assign(this, { title, partyCode, creatorID, gameIDs });
    if (gameIDs.length < 1)
      getGameIDs(this)
        .then(playlistInDB)
        .then(setPlaylistIDInPartyDB)
        .catch(console.error);
    else playlistInDB(this).then(setPlaylistIDInPartyDB).catch(console.error);
  }
}

function getGameIDs(playlist, selectedCat = [], limit = 25) {
  const { gamesCollection } = require("../server");
  return gamesCollection
    .find(selectedCat.length > 0 ? { categories: { $in: selectedCat } } : {}) // selectedCat or all games
    .limit(Math.min(limit, 200)) // extreme max is 200 games
    .map((game) => game._id)
    .toArray()
    .then((gamesIDs) => (playlist.gameIDs = gamesIDs))
    .then(() => playlist);
}

function playlistInDB(playlist) {
  const { playlistsCollection } = require("../server");
  return playlistsCollection.insertOne(playlist);
}

function setPlaylistIDInPartyDB(playlistInDB) {
  const { partiesCollection } = require("../server");
  partiesCollection.updateOne(
    { partyCode: playlistInDB.ops[0].partyCode },
    {
      $set: {
        playlistID: playlistInDB.insertedId,
        playlistMaxGames: playlistInDB.ops[0].gameIDs.length,
      },
    }
  );
}

function setMaxGamesInPartyDB(playlist) {
  const { partiesCollection } = require("../server");
  partiesCollection.updateOne(
    { partyCode: playlist.partyCode },
    { $set: { playlistMaxGames: playlist.gameIDs.length } }
  );
}

function updateGameIDs(playlist, selectedCategories, limit) {
  const { playlistsCollection } = require("../server");
  return getGameIDs(playlist, selectedCategories, limit)
    .then((playlist) => {
      playlistsCollection.updateOne(
        { _id: ObjectId(playlist._id) },
        { $set: playlist }
      );
      return playlist;
    })
    .then(setMaxGamesInPartyDB)
    .catch(console.error);
}

module.exports = { Playlist, updateGameIDs };
