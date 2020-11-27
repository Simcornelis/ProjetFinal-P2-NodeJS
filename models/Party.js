class Party {
  _id;
  partyCode;
  players;

  /**
   * @param {string} partyCode the sharable code to join the party
   * @param {Array} players array containing all the players
   */
  constructor(partyCode, players) {
    this.partyCode = partyCode; // TODO "|| randomCode()"
    this.players = players || [];
  }

  connect(socketID, pseudo, team, userID) {
    const index = this.players.findIndex((player) => {
      return player.userID === userID;
    });

    if (index >= 0) {
      let player = Object.assign(new Player(), this.players[index]);
      player.updatePlayerData(socketID, pseudo, team);
      this.players[index] = player;
    } else this.players.push(new Player(socketID, pseudo, team, userID));
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
    this.players = this.players.filter((player) => {
      return player.socketID !== socketID;
    });
  }

  getAdmin() {
    return this.players[0];
  }

  getOnlinePlayers() {
    return this.players.filter((player) => player.online);
  }

  getPlayers() {
    return this.getOnlinePlayers()
      .map((player) => Object.assign(new Player(), player))
      .map((player) => {
        let username = player.pseudo;
        if (player.isRegistered()) username += " 🟢";
        if (player.socketID === this.getAdmin().socketID) username += " 👑";
        return username;
      });
  }

  isEmpty() {
    return this.players.length === 0;
  }
}

class Player {
  socketID;
  pseudo;
  online;
  team;
  userID;

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
  }

  isRegistered() {
    return this.userID;
  }

  updatePlayerData(socketID, pseudo, team) {
    this.socketID = socketID;
    this.pseudo = pseudo;
    this.online = true;
    this.team = team;
  }
}

module.exports = { Party, Player };
