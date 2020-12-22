customElements.define("game-box", Game);

const checkboxes = document.querySelectorAll(".categories > div > input");
const searchInput = document.querySelector("#searchBar > input");
const searchButton = document.querySelector("#searchBar > button");
const searchIcon = searchButton.firstElementChild;
const gameList = document.getElementById("game-list");

function getGames() {
  const gamesUrl = url();
  gameList.innerText = ""; // clear games

  fetch(gamesUrl)
    .then((cursor) => cursor.json())
    .then((games) =>
      games.forEach((game) => {
        const gameBox = document.createElement("game-box");
        gameBox.initialiseGameBox(game);
        gameList.appendChild(gameBox);
      })
    );
}

function filter() {
  return Array.from(checkboxes)
    .filter((c) => c.checked)
    .map((c) => c.id)
    .join(",");
}

function search() {
  if (!searchInput.value) alert("Enter an input to run a search.");
  else if (searchIcon.innerText === "❌") {
    searchInput.value = "";
    getGames();
    searchIcon.innerText = "▶";
  } else {
    getGames();
    searchIcon.innerText = "❌";
  }
}

function url() {
  return (
    "/games/findgames?search_query=" +
    searchInput.value +
    "&filter_query=" +
    filter() +
    "&userID_query=" +
    userID
  );
}

getGames(); // get games on first load

window.addEventListener("load", async () => {
  const filterButton = document.getElementById("filter");
  const categoriesMenu = document.querySelector("div.categories");

  // open categories filter menu
  filterButton.onclick = () => {
    categoriesMenu.classList.toggle("open");
  };

  // close categories filter menu when focus is lost
  window.onclick = (event) => {
    if (
      !event.target.matches("#filter") &&
      !event.target.matches(".categories *")
    )
      categoriesMenu.classList.remove("open");
  };

  checkboxes.forEach((input) => input.addEventListener("change", getGames));

  searchBar.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    } else searchIcon.innerText = "▶";
  });

  searchButton.addEventListener("click", search);
});
