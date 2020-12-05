class Game extends HTMLElement {
  /**
   * @param {number} _id
   * @param {String} creatorPseudo
   * @param {number} creatorID
   * @param {String} consign
   * @param {String} description
   * @param {Array} categories
   */
  constructor() {
    super();
  }

  /**
   * @param {number} _id
   * @param {String} creatorPseudo
   * @param {number} creatorID
   * @param {String} consign
   * @param {String} description
   * @param {Array} categories
   */
  initialiseGameBox({
    _id,
    creatorPseudo,
    creatorID,
    consign,
    description,
    categories,
  }) {
    this._id = _id;
    this.creatorPseudo = creatorPseudo;
    this.creatorID = creatorID;
    this.consign = consign;
    this.description = description;
    this.categories = Array.isArray(categories) ? categories : [categories]; //Always be an array (to not split the word)

    const gameID = document.createElement("div");
    gameID.className = "game-id";
    gameID.innerText = this._id;
    this.appendChild(gameID);

    const gameCreator = document.createElement("div");
    gameCreator.className = "game-creator";
    gameCreator.innerText = this.creatorPseudo || "Unknown Creator";
    gameCreator.addEventListener("click", () => {
      window.location.href = "/profil/" + creatorID;
    });
    this.appendChild(gameCreator);

    const gameConsign = document.createElement("div");
    gameConsign.className = "game-consign";
    gameConsign.innerText = this.consign;
    this.appendChild(gameConsign);

    for (let i = 0; i < this.categories.length; i++) {
      const gameCategories = document.createElement("div");
      gameCategories.className = "game-category";
      gameCategories.innerText = this.categories[i];
      this.appendChild(gameCategories);
    }

    this.addEventListener("click", () => {
      window.location.href = "/games/gamedata/" + this._id;
    });

    /**
     * Render of the HTML
     * 
     * <game-box class="box" tabindex="0">
            <div class="game-id">The id</div>
            <div class="game-creator">The creator</div>
            <div class="game-consign">The consign</div>
            <div class="game-category">A category</div>
            <div class="game-category">A category</div>
            <div class="game-category">A category</div>
            <div class="game-category">A category</div>
        </game-box>
     */
  }
}
