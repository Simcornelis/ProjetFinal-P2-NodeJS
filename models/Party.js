class Party {
  partyCode;
  level;
  playlistID;
  players;

  /**
   * @param {string} partyCode the sharable code to join the party
   * @param {Array} players array containing all the players
   */
  constructor(partyCode, players) {
    this.partyCode = partyCode; // TODO "|| randomCode()"
    this.level = 0;
    this.playlistID = ""; // TODO link playlists
    this.players = players || [];
  }

  connect(socketID, pseudo, userID, team) {
    pseudo = pseudo.replace(/🟢|👑|✋/g, "").trim(); // match all info emojis
    return this.players.push(new Player(socketID, pseudo, this.team(), userID));
  }

  disconnect(socketID) {
    const index = this.players.findIndex((player) => {
      return player.socketID === socketID;
    });

    if (index >= 0) {
      if (!this.players[index].userID) this.players.splice(index, 1);
      else this.players[index].online = false;
    }
  }

  kick(socketID) {
    // TODO implement usage
    this.players = this.players.filter((player) => {
      return player.socketID !== socketID;
    });
  }

  /**
   * @param {socket.io} socketID
   * @param {boolean} isReady player ready status, if undefined, toggles status
   */
  setReadyState(socketID, isReady = undefined) {
    const index = this.getPlayerIndex(socketID);

    if (index >= 0) {
      if (isReady === undefined) isReady = !this.players[index].ready;
      this.players[index].ready = isReady;
    } else throw new Error("No player with that socketID.");
    return this;
  }

  team() {
    if (this.isEmpty()) return "Team"; // first team
    return Object.entries(this.getTeams()).sort(
      (a, b) => a[1].length - b[1].length
    )[0][0]; // smallest team
  }

  teamChange(socketID, newTeam) {
    const index = this.getPlayerIndex(socketID);

    if (index >= 0) this.players[index].team = newTeam;
    else throw new Error("No player with that socketID.");
  }

  isSocketUsed(socket) {
    return this.players.some((player) => player.socketID === socket.id);
  }

  isUserConnected(userID) {
    return this.players.some((player) => player.userID === userID);
  }

  getAdmin() {
    return this.getOnlinePlayers()[0];
  }

  getPlayerIndex(socketID) {
    return this.players.findIndex((player) => player.socketID === socketID);
  }

  getOnlinePlayers() {
    return this.players.filter((player) => player.online);
  }

  getReadyPlayers() {
    return this.getOnlinePlayers().filter((player) => player.ready);
  }

  getTeams() {
    return this.getOnlinePlayers().reduce((teams, player) => {
      if (!teams[player.team]) teams[player.team] = [];
      teams[player.team].push(player);
      return teams;
    }, {});
  }

  getPlayers() {
    const teams = {};
    this.getOnlinePlayers().forEach((player) => {
      let username = player.pseudo;
      if (player.userID) username += " 🟢";
      if (player.socketID === this.getAdmin().socketID) username += " 👑";
      if (!teams[player.team]) teams[player.team] = [];
      teams[player.team].push(username);
    });
    return teams;
  }

  isEmpty() {
    return this.getOnlinePlayers().length === 0;
  }
}

class Player {
  socketID;
  pseudo;
  online;
  team;
  userID;
  ready;

  /**
   * @param {socketId} socketID socket.io module id of the player
   * @param {string} pseudo
   * @param {string} team
   * @param {ObjectId} userID mongodb ObjectId if the user is registered
   */
  constructor(socketID, pseudo, team, userID) {
    this.socketID = socketID;
    this.pseudo = pseudo;
    this.online = true;
    this.team = team;
    this.userID = userID;
    this.ready = false;
  }
}

module.exports = { Party };
