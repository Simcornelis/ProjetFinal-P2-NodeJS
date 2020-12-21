const { ObjectId } = require("mongodb");

class Playlist {
  title;
  partyCode;
  creatorID;
  gameIDs;
  categories;

  constructor(title, partyCode, creatorID, gameIDs = [], categories = []) {
    Object.assign(this, { title, partyCode, creatorID, gameIDs, categories });
    if (gameIDs.length < 1)
      getGameIDs(this)
        .then(playlistInDB)
        .then(setPlaylistIDInPartyDB)
        .catch(console.error);
    else playlistInDB(this).then(setPlaylistIDInPartyDB).catch(console.error);
  }
}

function getGameIDs(playlist, categories = [], limit = 25) {
  const { gamesCollection } = require("../server");
  playlist.categories = categories.filter((cat) => cat !== "All");
  return gamesCollection
    .find(
      categories.length > 0 ? { categories: { $in: playlist.categories } } : {}
    ) // categories or all games
    .limit(limit)
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

function updateGameIDs(playlist, categories, limit) {
  const { playlistsCollection } = require("../server");
  return getGameIDs(playlist, categories, limit)
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
