window.addEventListener("load", async () => {
  const socket = io();
  const players = []; // all the players
  const ready = []; // all online and ready players

  const main = document.querySelector("body > main");
  const footer = document.querySelector("body > footer");

  const pseudo = document.querySelector(".pseudo");
  const usernameInput = document.querySelector(".pseudo>div>input");
  const usernameButton = document.querySelector(".pseudo>button");

  const newTeamButton = document.getElementById("newTeam");
  const playerListDiv = document.getElementById("players-list");
  const partySettingsButton = document.getElementById("partySettings");
  const readyButton = document.getElementById("isReady");
  const readyCount = readyButton.childNodes.item(2);
  const startButton = document.getElementById("start");
  const gameIDH4 = document.getElementById("gameID");
  const authorH4 = document.getElementById("author");

  const actions = document.querySelectorAll(".action");

  // --- user connecting --- //

  if (username) submitNewUser();
  else if (pseudo) {
    usernameButton.onclick = submitNewUser;
    usernameInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitNewUser();
      }
    });
  }

  function submitNewUser() {
    if (!username && !usernameInput.value) return alert("Enter an username.");
    if (!username) username = usernameInput.value.replace(/🟢|👑/g, "").trim();
    socket.emit("new-user", partyCode, username, userID);
    if (pseudo) pseudo.remove();
    actions.forEach((elem) => elem.classList.remove("hide"));
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
    adminTools.forEach((tool) => tool.classList.remove("hide"));
  });

  // TODO transfer admin privileges
  socket.on("you-are-not-admin", () => {
    const adminTools = document.querySelectorAll(".admin");
    adminTools.forEach((tool) => tool.classList.add("hide"));
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

  socket.on("message", (message) => alert(message));
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

  socket.on("party-not-found", () => {
    alert("Party not found.");
    location.reload();
  });

  socket.on("back-to-party", backToParty);

  socket.on("end", () => {
    backToParty("gamePage");
    alert("You reached the end of the game!"); // TODO make a better ending
  });

  function addPlayer(player, _team) {
    const isMe = player.replace(/🟢|👑/g, "").trim() === username;
    players.push(player);
    let _player = document.createElement("h4");
    _player.innerText = player;
    if (isMe) _player.classList.add("highlight");
    _team.appendChild(_player);
  }

  function updateReadyPlayers(readyPlayers) {
    ready.splice(0); // empty players array
    readyPlayers.forEach((player) => ready.push(player));
    readyCount.textContent = ` (${ready.length}/${players.length})`;
  }

  function loadPage(html, id, oldPage) {
    main.firstElementChild.classList.add("hide");
    if (oldPage) document.getElementById(oldPage).remove();
    const _page = document.createElement("div");
    _page.id = id;
    _page.innerHTML = html.replace(/<?[^>]*?>/, ""); // remove XML tag
    main.append(_page);
  }

  function loadSettings(html) {
    loadPage(html, "settingsPage");
    setupSettings();
  }

  function loadGame(html, oldGame, gameID, author) {
    loadPage(html, "gamePage", oldGame);
    footer.classList.add("game");
    gameIDH4.textContent = gameID;
    authorH4.textContent = author;

    document.getElementById("help").onclick = () => {
      document.getElementById("description").classList.toggle("hide");
    };
    document.getElementById("next").onclick = () => {
      socket.emit("next-game", partyCode, "gamePage");
    };
    document.getElementById("end").onclick = () => {
      socket.emit("back-to-party", partyCode, "gamePage");
    };
  }

  function backToParty(toClose) {
    const elem = document.getElementById(toClose);
    if (elem) elem.remove();
    main.firstElementChild.classList.remove("hide");
    footer.classList.remove("game");
  }

  // --- game settings --- //

  function setupSettings() {
    const groupsSlider = document.getElementById("maxGroups");
    const groupsSpan = document.getElementById("nGroups");
    const gamesSlider = document.getElementById("maxGames");
    const gamesSpan = document.getElementById("nGames");

    const playlistSelect = document.querySelector("#my-playlists > select");
    const categorySelect = document.querySelector("#new-playlist > select");

    const myButton = document.getElementById("myPlaylists");
    const myPlaylists = document.getElementById("my-playlists");
    const newButton = document.getElementById("newPlaylist");
    const newPlaylist = document.getElementById("new-playlist");

    const saveButton = document.getElementById("save-settings");

    // init

    updateGroups();
    updateGames();

    const selected = categorySelect.dataset.selected.split(",");
    if (selected.length) {
      const cat = Array.from(categorySelect.options).map((html) => html.value);
      const optionIndex = cat.findIndex((option) => selected.includes(option));
      if (optionIndex >= 0) categorySelect.selectedIndex = optionIndex;
    }

    if (playlistSelect) {
      myPlaylists.selectedIndex = playlistSelect.dataset.selected;
    }

    // actions

    playlistSelect.addEventListener("change", () => {
      categorySelect.selectedIndex = 0;
    });

    groupsSlider.addEventListener("change", updateGroups);
    function updateGroups() {
      if (groupsSlider.value == 11) groupsSpan.innerText = "25";
      // String == Number
      else groupsSpan.innerText = groupsSlider.value;
    }

    gamesSlider.addEventListener("change", updateGames);
    function updateGames() {
      if (gamesSlider.value == 26) gamesSpan.innerText = "200";
      // String == Number
      else gamesSpan.innerText = gamesSlider.value;
    }

    myButton.onclick = showMyPlaylists;
    function showMyPlaylists() {
      myButton.classList.add("green");
      myPlaylists.classList.remove("hide");
      newButton.classList.remove("green");
      newPlaylist.classList.add("hide");
    }

    newButton.onclick = showNewPlaylists;
    function showNewPlaylists() {
      myButton.classList.remove("green");
      myPlaylists.classList.add("hide");
      newButton.classList.add("green");
      newPlaylist.classList.remove("hide");
    }

    saveButton.onclick = () => {
      const selected = categorySelect[categorySelect.selectedIndex].text;
      const settings = {
        playlist: playlistSelect.value,
        categories: selected !== "All" ? [selected] : [],
        maxGroups: groupsSlider.value,
        maxGames: gamesSlider.value,
      };
      socket.emit("update-settings", partyCode, settings);
      document.getElementById("settingsPage").remove();
      main.firstElementChild.classList.remove("hide");
    };
  }
});
