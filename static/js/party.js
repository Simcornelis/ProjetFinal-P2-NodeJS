window.addEventListener("load", async () => {
  const socket = io();
  const players = []; // all the players
  const ready = []; // all online and ready players

  const main = document.querySelector("body > main");

  const pseudo = document.querySelector(".pseudo");
  const usernameInput = document.querySelector(".pseudo>div>input");
  const usernameButton = document.querySelector(".pseudo>button");

  const newTeamButton = document.getElementById("newTeam");
  const playerListDiv = document.getElementById("players-list");
  const partySettingsButton = document.getElementById("partySettings");
  const readyButton = document.getElementById("isReady");
  const startButton = document.getElementById("start");

  const actions = document.querySelectorAll(".action");

  // --- user connecting --- //

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
    if (!username)
      username = usernameInput.value.replace(/🟢|👑|✋/g, "").trim();
    socket.emit("new-user", partyCode, username, userID);
    if (pseudo) pseudo.remove();
    actions.forEach((elem) => (elem.hidden = false));
  }

  // --- only for the admin --- //

  partySettingsButton.onclick = () => {
    socket.emit("open-settings", partyCode);
  };

  startButton.onclick = () => {
    if (players.length === ready.length) socket.emit("next-game", partyCode);
    else alert("Wait for everyone to be ready!");
  };

  socket.on("you-are-admin", () => {
    const adminTools = document.querySelectorAll(".admin");
    adminTools.forEach((tool) => (tool.hidden = false));
  });

  // TODO transfer admin privileges
  socket.on("you-are-not-admin", () => {
    const adminTools = document.querySelectorAll(".admin");
    adminTools.forEach((tool) => (tool.hidden = true));
    alert("You are not admin.");
  });

  // --- for all users --- //

  newTeamButton.onclick = () => {
    const newTeam = prompt("Enter a new team name.");
    socket.emit("change-team", partyCode, newTeam);
  };

  readyButton.onclick = () => {
    socket.emit("set-ready-state", partyCode);
    readyButton.classList.toggle("green");
  };

  socket.on("message", alert);
  socket.on("settings", loadSettings);
  socket.on("game", loadGame);

  socket.on("players-update", (teams) => {
    playerListDiv.innerHTML = "";
    players.splice(0); // empty players array
    Object.keys(teams).forEach((team) => {
      let _team = document.createElement("div");
      _team.appendChild(document.createElement("h2"));
      _team.classList.add("team");
      _team.firstElementChild.innerText = team;
      let teamPlayers = document.createElement("div");
      teams[team].forEach((player) => addPlayer(player, teamPlayers));
      _team.appendChild(teamPlayers);
      playerListDiv.appendChild(_team);
    });

    document.querySelectorAll("#players-list > div > h2").forEach((elem) => {
      elem.title = "Switch to this team.";
      elem.addEventListener("click", () => {
        socket.emit("change-team", partyCode, elem.textContent);
      });
    });
  });

  socket.on("ready-players", updateReadyPlayers);

  socket.on("choose-team-name", () => {
    socket.emit("change-team", partyCode, prompt("Enter new team name."));
  });

  socket.on("already-connected", () => {
    alert("You already joined this room.");
    window.location.href = "/";
  });

  socket.on("back-to-party", (toClose) => {
    document.getElementById(toClose).remove();
    main.firstElementChild.style = "";
  });

  function addPlayer(player, _team) {
    const isMe = player.replace(/🟢|👑|✋/g, "").trim() === username;
    players.push(player);
    let _player = document.createElement("h4");
    _player.innerText = player;
    if (isMe) _player.classList.add("highlight");
    _team.appendChild(_player);
  }

  function updateReadyPlayers(readyPlayers) {
    ready.splice(0); // empty players array
    readyPlayers.forEach((player) => ready.push(player));
    readyButton.firstElementChild.textContent = ` (${ready.length}/${players.length})`;
  }

  function loadPage(html, id, oldPage) {
    main.firstElementChild.style = "display:none";
    if (oldPage) document.getElementById(oldPage).remove();
    const _page = document.createElement("div");
    _page.id = id;
    _page.innerHTML = html.replace(/<?[^>]*?>/, ""); // remove XML tag
    main.append(_page);
  }

  function loadSettings(html) {
    loadPage(html, "settingsPage");
    document.getElementById("saveSettings").onclick = () => {
      socket.emit("update-settings"); // TODO send settings
      document.getElementById("settingsPage").remove();
      main.firstElementChild.style = "";
    };
  }

  function loadGame(html, oldGame) {
    loadPage(html, "gamePage", oldGame);
    document.getElementById("next").onclick = () => {
      socket.emit("next-game", partyCode, "gamePage");
    };
    document.getElementById("end").onclick = () => {
      socket.emit("back-to-party", partyCode, "gamePage");
    };
  }
});
