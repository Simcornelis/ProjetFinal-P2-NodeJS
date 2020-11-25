const socket = io();
const players = [];

const body = document.querySelector("body");
const playerListDiv = document.getElementById("players-list");
const nextGameButton = document.getElementById("next-game");

nextGameButton.onclick = askServerForNextGame;

socket.emit("new-user", room, username);

function askServerForNextGame() {
  socket.emit("next-game", room);
}

socket.on("game", (html) => {
  body.innerHTML = html;
});

socket.on("message", (message) => {
  alert(message);
});

socket.on("all-players", (allPlayers) => {
  playerListDiv.innerHTML = "";
  allPlayers.forEach((username) => addUser(username));
});

socket.on("you-are-now-admin", () => {
  nextGameButton.hidden = false;
});

// TODO transfer admin privileges
socket.on("you-are-not-admin", () => {
  nextGameButton.hidden = true;
  alert("You are not admin.");
});

function addUser(username) {
  players.push(username);
  let user = document.createElement("h3");
  user.innerText = username;
  playerListDiv.appendChild(user);
}
