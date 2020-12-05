const socket = io();
const players = [];

const body = document.querySelector("body");
const nextGameButton = document.getElementById("next-game");
const playerListDiv = document.getElementById("players-list");

nextGameButton.onclick = askServerForNextGame;

socket.emit(
  "new-user",
  partyCode,
  username,
  userID,
  prompt("What is your team name?", "Auto join") // TODO auto join a team
);

function askServerForNextGame() {
  socket.emit("next-game", partyCode);
}

socket.on("game", (html) => {
  body.innerHTML = html;
});

socket.on("message", (message) => {
  alert(message);
});

socket.on("players-update", (teams) => {
  playerListDiv.innerHTML = "";
  Object.keys(teams).forEach((team) => {
    let _team = document.createElement("div");
    let teamName = document.createElement("h1");
    teamName.innerText = team;
    _team.appendChild(teamName);
    teams[team].forEach((player) => addPlayer(player, _team));
    playerListDiv.appendChild(_team);
  });
});

socket.on("you-are-now-admin", () => {
  nextGameButton.hidden = false;
});

// TODO transfer admin privileges
socket.on("you-are-not-admin", () => {
  nextGameButton.hidden = true;
});

socket.on("already-connected", () => {
  alert("You already joined this room.");
  window.location.href = "/";
});

function addPlayer(player, _team) {
  players.push(player);
  let _player = document.createElement("h3");
  _player.innerText = player;
  _team.appendChild(_player);
}
