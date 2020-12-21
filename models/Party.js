const { Playlist } = require("./Playlist");

class Party {
  partyCode;
  level;
  playlistID;
  playlistMaxGames;
  players;
  maxGroups;
  maxGames;
  inGame;

  /**
   * @param {String} partyCode the sharable code to join the party
   * @param {Array} players array containing all the players
   */
  constructor(partyCode) {
    this.partyCode = partyCode; // TODO "|| randomCode()"
    this.level = 0;
    this.players = [];
    this.maxGroups = 10;
    this.maxGames = 15;
    this.playlistMaxGames = 200;
    this.inGame = false;
    if (partyCode) new Playlist(`${partyCode}'s games`, partyCode);
  }

  connect(socketID, pseudo, userID) {
    pseudo = pseudo.replace(/🟢|👑/g, "").trim(); // match all info emojis
    if (!userID)
      return this.players.push(
        new Player(socketID, pseudo, this.team(), userID)
      );

    const index = this.players.findIndex((p) => p.userID === userID);
    if (index >= 0) {
      this.players[index].socketID = socketID;
      this.players[index].pseudo = pseudo;
      if (!Object.keys(this.getTeams()).includes(this.players[index].team))
        this.players[index].team = this.team();
      this.players[index].online = true;
      this.players[index].ready = false;
      return;
    } else this.players.push(new Player(socketID, pseudo, this.team(), userID));
  }

  disconnect(socketID) {
    const index = this.getPlayerIndex(socketID);

    if (index >= 0) {
      if (!this.players[index].userID) this.players.splice(index, 1);
      else this.players[index].online = false;
    }
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
    const existing = Object.keys(this.getTeams());

    if (!existing.includes(newTeam) && existing.length >= this.maxGroups)
      throw new Error(
        "The max amount of teams has been reached.\n" +
          "Ask your party admin to allow more groups."
      );

    if (index >= 0) this.players[index].team = newTeam;
    else throw new Error("No player with that socketID.");
  }

  isUserConnected(userID) {
    return this.players.some(
      (player) => player.userID === userID && player.online
    );
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
  team;
  userID;
  online;
  ready;

  /**
   * @param {socketId} socketID socket.io module id of the player
   * @param {String} pseudo
   * @param {String} team
   * @param {ObjectId} userID mongodb ObjectId if the user is registered
   */
  constructor(socketID, pseudo, team, userID) {
    Object.assign(this, { socketID, pseudo, team, userID });
    this.online = true;
    this.ready = false;
  }
}

module.exports = { Party };
