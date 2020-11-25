const socket = io();
const players = [];

const playerListDiv = document.getElementById("players-list");
const nextGameButton = document.getElementById("next-game");

if (nextGameButton) nextGameButton.onclick = askServerForNextGame;

let username = prompt("What is your username?");
socket.emit("new-user", username);

function askServerForNextGame() {
  socket.emit("next-game");
}

socket.on("message", (message) => {
  alert(message);
});

socket.on("all-players", (allPlayers) => {
  playerListDiv.innerHTML = "";
  allPlayers.forEach((username) => addUser(username));
});

function addUser(username) {
  players.push(username);
  let user = document.createElement("h3");
  user.innerText = username;
  playerListDiv.appendChild(user);
}
