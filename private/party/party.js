const socket = io();

const nextGameButton = document.getElementById("next-game");

if (nextGameButton) nextGameButton.onclick = askServerForNextGame;

function askServerForNextGame() {
  socket.emit("next-game");
}

socket.on("message", (message) => {
  alert(message);
});
