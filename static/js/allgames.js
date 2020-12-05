customElements.define("game-box", Game);

async function getGames(query = "") {
  const gameList = document.getElementsByClassName("game-list")[0];
  return fetch("/games/findgames" + query)
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
