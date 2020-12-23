const listAvailable = document.getElementById("listAvailable");
const addGamePlaylist = document.getElementById("addGamePlaylist");
const removeGamePlaylist = document.getElementById("removeGamePlaylist");
const removeAllGamePlaylist = document.getElementById("removeAllGamePlaylist");
const listSelected = document.getElementById("listSelected");
const createPlaylist = document.getElementById("createPlaylist");
const moveGameUpPlaylist = document.getElementById("moveGameUpPlaylist");
const moveGameDownPlaylist = document.getElementById("moveGameDownPlaylist");

window.addEventListener("load", () => {
  fetch("/games/findgames")
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response;
    })
    .then((response) => response.json())
    .then((games) => {
      games.forEach((game) => {
        const li = document.createElement("li");
        const input = document.createElement("input");
        const label = document.createElement("label");

        input.value = game._id;
        input.type = "radio";
        input.name = "selectedGame";
        input.id = "game" + game._id;

        label.innerText = game.instruction;
        label.title = game.instruction;
        label.htmlFor = "game" + game._id;

        li.appendChild(input);
        li.appendChild(label);
        listAvailable.appendChild(li);
      });
    })
    .catch((error) => console.error(error));

  addGamePlaylist.addEventListener("click", () => {
    const checked = document.querySelector("#listAvailable>li>input:checked");
    if (checked) {
      checked.checked = false;
      const li = checked.parentElement;
      listAvailable.removeChild(li);
      listSelected.appendChild(li);
    }
  });

  removeGamePlaylist.addEventListener("click", () => {
    const checked = document.querySelector("#listSelected>li>input:checked");
    if (checked) {
      checked.checked = false;
      const li = checked.parentElement;
      listSelected.removeChild(li);
      listAvailable.appendChild(li);
    }
  });

  removeAllGamePlaylist.addEventListener("click", () => {
    Array.from(document.querySelectorAll("#listSelected>li")).forEach((li) => {
      listSelected.removeChild(li);
      listAvailable.appendChild(li);
    });
  });

  moveGameUpPlaylist.addEventListener("click", () => {
    const input = document.querySelector("#listSelected>li>input:checked");
    if (input) {
      const li = input.parentElement;
      const ul = li.parentElement;
      if (li.previousSibling) {
        ul.insertBefore(li, li.previousSibling);
      }
    }
  });

  moveGameDownPlaylist.addEventListener("click", () => {
    const input = document.querySelector("#listSelected>li>input:checked");
    if (input) {
      const li = input.parentElement;
      const ul = li.parentElement;
      if (li.nextSibling) {
        ul.insertBefore(li, li.nextSibling.nextSibling);
      }
    }
  });

  createPlaylist.addEventListener("click", () => {
    return new Promise((resolve, reject) => {
      resolve();
    })
      .then(() => {
        if (
          !document.getElementById("playlistName").value ||
          !document.getElementById("playlistName").value.trim()
        ) {
          throw new Error("Playlist must have a name");
        } else if (
          Array.from(document.querySelectorAll("#listSelected>li>input"))
            .length === 0
        ) {
          throw new Error("Playlist cannot be empty");
        }
      })
      .then(() =>
        fetch("/playlists/createplaylist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: document.getElementById("playlistName").value,
            games: Array.from(
              document.querySelectorAll("#listSelected>li>input")
            ).map((element) => element.value),
          }),
        })
      )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response;
      })
      .then(() => {
        alert("Playlist created");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  });
});
