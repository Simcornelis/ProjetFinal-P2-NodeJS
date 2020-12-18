class Playlist {
  title;
  gameIDs;
  creatorID;

  constructor(title, gameIDs, creatorID) {
    Object.assign(this, { title, gameIDs, creatorID });
  }
}

module.exports = { Playlist };
