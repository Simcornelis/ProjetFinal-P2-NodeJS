const consolidate = require("consolidate");
const { io } = require("./party-socket");
const { emoji } = require("../../models/Game");

const action = require("./party-actions");
const db = require("./party-db");

function nextGame(party, socket, oldGame) {
  if (party.getAdmin().socketID !== socket.id) {
    socket.emit("you-are-not-admin");
    throw new Error("You are not admin.");
  }

  party.level++;
  const endLevel = Math.min(party.maxGames, party.playlistMaxGames);
  if (party.level > endLevel) {
    io.to(party.partyCode).emit("end");
    party.level = 0;
    console.log(`[PARTY:${party.partyCode}] Game ended.`);
    return db.updatePartyDB(party);
  }

  party.inGame = true;
  db.getPlaylistDB(party.playlistID)
    .then((playlist) => db.getGameDB(playlist.gameIDs[party.level - 1]))
    .then((game) => {
      if (!game.categories) game.categories = [];
      const data = {
        level: party.level,
        games: endLevel,
        progress: 100 - (party.level / endLevel) * 100,
        instruction: game.instruction,
        description: game.description, // TODO description in html
        categories: game.categories.map((c) => ({ cat: emoji(c) })),
      };

      consolidate
        .hogan("./private/game.xml", data)
        .then((html) =>
          io
            .to(party.partyCode)
            .emit("game", html, oldGame, game._id, game.creatorPseudo)
        )
        .then(() => action.informPlayers(party))
        .then(db.updatePartyDB)
        .catch(console.log);
    })
    .catch((error) => action.handleError(error, socket));
}

function settings(party, socket) {
  if (party.getAdmin().socketID !== socket.id) {
    socket.emit("you-are-not-admin");
    throw new Error("You are not admin.");
  }

  // TODO add player's playlists, playlistID/name
  db.getPlaylistDB(party.playlistID).then((playlist) => {
    const settings = {
      partyCode: party.partyCode,
      maxGroups: party.maxGroups,
      categories: playlist.categories,
      maxGames: party.maxGames,
    };

    consolidate
      .hogan("./private/party_settings.xml", settings)
      .then((html) => io.to(socket.id).emit("settings", html))
      .catch((error) => action.handleError(error, socket));
  });
}

module.exports = { nextGame, settings };
