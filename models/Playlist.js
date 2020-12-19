class Playlist {
  title;
  partyCode;
  creatorID;
  gameIDs;

  constructor(title, partyCode, creatorID, gameIDs = []) {
    Object.assign(this, { title, partyCode, creatorID, gameIDs });
    if (gameIDs.length < 1)
      this.getGameIDs(this)
        .then(this.storeInDB)
        .then(this.setPlaylistIDInParty)
        .catch(console.error);
    else
      this.storeInDB(this).then(this.setPlaylistIDInParty).catch(console.error);
  }

  getGameIDs(playlist) {
    const { minigamesCollection } = require("../server");
    return minigamesCollection
      .find()
      .limit(25)
      .map((game) => game._id)
      .toArray()
      .then((gamesIDs) => (playlist.gameIDs = gamesIDs))
      .then(() => playlist);
  }

  storeInDB(playlist) {
    const { playlistsCollection } = require("../server");
    return playlistsCollection.insertOne(playlist);
  }

  setPlaylistIDInParty(playlistInDB) {
    const { partiesCollection } = require("../server");
    partiesCollection.updateOne(
      { partyCode: playlistInDB.ops[0].partyCode },
      { $set: { playlistID: playlistInDB.insertedId } }
    );
  }
}
// REMOVE drop db on start
module.exports = { Playlist };
