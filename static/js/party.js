window.addEventListener("load", async () => {
  const socket = io();
  const players = []; // all the players
  const ready = []; // all online and ready players

  const main = document.querySelector("body > main");

  const pseudo = document.querySelector(".pseudo");
  const usernameInput = document.querySelector(".pseudo>input");
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

  socket.on("you-are-now-admin", () => {
    const adminTools = document.querySelectorAll(".admin");
    adminTools.forEach((tool) => (tool.hidden = false));
  });

  // TODO transfer admin privileges
  socket.on("you-are-not-admin", () => {
    const adminTools = document.querySelectorAll(".admin");
    adminTools.forEach((tool) => (tool.hidden = true));
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

  socket.on("page", (html) => (main.innerHTML = html.replace(/<?[^>]*>/, ""))); // remove XML tag
  socket.on("settings", loadSettings);
  socket.on("message", alert);

  socket.on("players-update", (teams) => {
    playerListDiv.innerHTML = "";
    players.splice(0); // empty players array
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

    document
      .querySelectorAll("#players-list > section > h2")
      .forEach((elem) => {
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

  function addPlayer(player, _team) {
    const isMe = player.replace(/🟢|👑|✋/g, "").trim() === username;
    if (isMe) player += " ✋";
    players.push(player);
    let _player = document.createElement("li");
    _player.innerText = player;
    if (isMe) _player.classList.add("highlight");
    _team.appendChild(_player);
  }

  function updateReadyPlayers(readyPlayers) {
    ready.splice(0); // empty players array
    readyPlayers.forEach((player) => ready.push(player));
    readyButton.firstElementChild.textContent = ` (${ready.length}/${players.length})`;
  }

  function loadSettings(html) {
    main.firstElementChild.style = "display:none";
    const _settingsPage = document.createElement("div");
    _settingsPage.id = "settingsPage";
    _settingsPage.innerHTML = html.replace(/<?[^>]*?>/, "");
    main.append(_settingsPage);
    document.getElementById("saveSettings").onclick = () => {
      socket.emit("update-settings"); // TODO send settings
      document.getElementById("settingsPage").remove();
      main.firstElementChild.style = "";
    };
  }
});
