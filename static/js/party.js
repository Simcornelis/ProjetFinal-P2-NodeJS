window.addEventListener("load", async () => {
  const socket = io();
  const players = [];

  const main = document.querySelector("body > main");

  const pseudo = document.querySelector(".pseudo");
  const usernameInput = document.querySelector(".pseudo>input");
  const usernameButton = document.querySelector(".pseudo>button");

  const newTeamButton = document.getElementById("newTeam");
  const playerListDiv = document.getElementById("players-list");
  const partySettingsButton = document.getElementById("partySettings");
  const nextGameButton = document.getElementById("next-game");

  if (username) submitNewUser();
  else if (pseudo) {
    usernameButton.onclick = submitNewUser;
    usernameInput.addEventListener("keyup", (event) => {
      // on ENTER key pressed
      if (event.keyCode === 13) {
        event.preventDefault();
        submitNewUser();
      }
    });
  }

  function submitNewUser() {
    if (!username && !usernameInput.value) return alert("Enter an username.");
    socket.emit("new-user", partyCode, username || usernameInput.value, userID);
    if (pseudo) pseudo.remove();
  }

  newTeamButton.onclick = () => {
    const newTeam = prompt("Enter a new team name.");
    socket.emit("change-team", partyCode, newTeam);
  };

  nextGameButton.onclick = () => {
    socket.emit("next-game", partyCode);
  };

  socket.on("game", (html) => {
    main.innerHTML = html;
  });

  socket.on("message", (message) => {
    alert(message);
  });

  socket.on("players-update", (teams) => {
    playerListDiv.innerHTML = "";
    Object.keys(teams).forEach((team) => {
      let _team = document.createElement("section");
      let teamName = document.createElement("h2");
      teamName.innerText = team;
      _team.appendChild(teamName);
      let teamPlayers = document.createElement("ul");
      teams[team].forEach((player) => addPlayer(player, teamPlayers));
      _team.appendChild(teamPlayers);
      playerListDiv.appendChild(_team);
    });

    const teamH2s = document.querySelectorAll("#players-list > section > h2");
    teamH2s.forEach((elem) => {
      elem.addEventListener("click", () => {
        socket.emit("change-team", partyCode, elem.textContent);
      });
    });
  });

  socket.on("you-are-now-admin", () => {
    const adminTools = document.querySelectorAll(".admin");
    adminTools.forEach((tool) => {
      tool.hidden = false;
    });
  });

  // TODO transfer admin privileges
  socket.on("you-are-not-admin", () => {
    const adminTools = document.querySelectorAll(".admin");
    adminTools.forEach((tool) => {
      tool.hidden = true;
    });
  });

  socket.on("already-connected", () => {
    alert("You already joined this room.");
    window.location.href = "/";
  });

  function addPlayer(player, _team) {
    players.push(player);
    let _player = document.createElement("li");
    _player.innerText = player;
    _team.appendChild(_player);
  }
});
