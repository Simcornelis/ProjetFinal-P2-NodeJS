customElements.define("game-box", Game);

const categoryList = [
  "category1",
  "category2",
  "category3",
  "category4",
  "category5",
  "category6",
  "category7",
];
let selectedCategories = [];
let searchQuery = "";

window.addEventListener("load", async () => {
  const searchButton = document.getElementById("searchButton");
  const searchBar = document.getElementById("searchBar");
  const categoriesFilter = document.querySelectorAll(".filter_category");

  async function getGames() {
    const gameList = document.getElementsByClassName("game-list")[0];
    clear();
    return fetch(
      "/games/findgames?search_query=" +
        searchQuery +
        "&filter_query=" +
        selectedCategories
    )
      .then((response) => {
        return response.json();
      })
      .then((games) => {
        return games.forEach((gameData) => {
          const gameBox = document.createElement("game-box");
          gameBox.initialiseGameBox(gameData);
          gameList.appendChild(gameBox);
        });
      });
  }

  getGames();

  /**
   * Filter games based on selected categories
   */
  categoriesFilter.forEach((item) => {
    item.addEventListener("click", function (event) {
      getSelectedFilterCategories();
      getGames();
    });
  });

  /*
   * Fetch result when 'Enter' key is pressed in searchBar
   */
  searchBar.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      if (!searchBar.firstElementChild.value) {
        return alert("Enter an input to run a search");
      }
      searchButton.innerText = "clear";
      searchQuery = searchBar.firstElementChild.value;
      return getGames();
    }
    return false;
  });

  /**
   * Listener to "Enter" key for search
   */
  searchButton.addEventListener("click", function (event) {
    if (searchButton.innerText === "search") {
      searchButton.innerText = "clear";
      if (searchBar.firstElementChild.value) {
        searchQuery = searchBar.firstElementChild.value;
        getGames();
      }
    } else {
      searchQuery = "";
      searchButton.innerText = "search";
      getGames();
    }
  });

  /**
   * Clear the display of the games collection
   */
  function clear() {
    const gameBoxes = document.querySelectorAll("game-box");
    gameBoxes.forEach((box) => box.remove());
  }
});

/**
 * Show or hide the dropdown menu of filter
 */
function showCategoriesFilter() {
  categoriesFilter = document.getElementById("dropDownCategories");
  if (categoriesFilter.style.display === "none") {
    categoriesFilter.style.display = "block";
  } else {
    categoriesFilter.style.display = "none";
  }
}

/**
 * Update the selected categories filters that are selected
 */
function getSelectedFilterCategories() {
  selectedCategories = [];
  for (let i = 0; i < categoryList.length; i++) {
    let currentCategory = document.getElementById(categoryList[i]);
    if (currentCategory.checked) {
      selectedCategories.push(currentCategory.value);
    }
  }
}
