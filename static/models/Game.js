class Game extends HTMLElement {
  /**
   * @param {number} _id
   * @param {String} creatorPseudo
   * @param {number} creatorID
   * @param {String} instruction
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
   * @param {String} instruction
   * @param {String} description
   * @param {Array} categories
   */
  initialiseGameBox({
    _id,
    creatorPseudo,
    creatorID,
    instruction,
    description,
    categories,
  }) {
    this._id = _id;
    this.creatorPseudo = creatorPseudo;
    this.creatorID = creatorID;
    this.instruction = instruction;
    this.description = description;
    this.categories = Array.isArray(categories) ? categories : [categories]; //Always be an array (to not split the word)

    // const gameID = document.createElement("div");
    // gameID.className = "game-id";
    // gameID.innerText = this._id;
    // this.appendChild(gameID);

    const gameInstruction = document.createElement("div");
    gameInstruction.className = "game-instruction";
    gameInstruction.innerText = this.instruction;
    this.appendChild(gameInstruction);

    let categoryEmoji = "";
    for (let i = 0; i < this.categories.length; i++) {
      switch (this.categories[i]) {
        case "Culture":
          categoryEmoji = categoryEmoji.concat("📚 ");
          break;
        case "Action":
          categoryEmoji = categoryEmoji.concat("🐱‍🏍 ");
          break;
        case "Reflexion":
          categoryEmoji = categoryEmoji.concat("🧩 ");
          break;
        case "Sport":
          categoryEmoji = categoryEmoji.concat("🏀 ");
          break;
        case "Truth":
          categoryEmoji = categoryEmoji.concat("🙊 ");
          break;
        case "Game":
          categoryEmoji = categoryEmoji.concat("🎲 ");
          break;
        case "Constraint":
          categoryEmoji = categoryEmoji.concat("👿 ");
          break;
        default:
          break;
      }
    }
    const gameCategories = document.createElement("div");
    gameCategories.className = "game-category";
    gameCategories.innerText = categoryEmoji;
    if (categoryEmoji !== "") {
      this.appendChild(gameCategories);
    }

    const gameCreator = document.createElement("div");
    gameCreator.className = "game-creator";
    gameCreator.innerText = this.creatorPseudo || "Unknown Creator";
    gameCreator.addEventListener("click", () => {
      window.location.href = "/profil/" + creatorID;
    });
    if (categoryEmoji !== "") {
    }
    this.appendChild(gameCreator);

    // let randomColorNumber = (Math.random() * 5) | 0;
    // switch (randomColorNumber) {
    //   case 0:
    //     this.style.backgroundColor = "red";
    //     break;
    //   case 1:
    //     this.style.backgroundColor = "green";
    //     break;
    //   case 2:
    //     this.style.backgroundColor = "blue";
    //     break;
    //   case 3:
    //     this.style.backgroundColor = "yellow";
    //     break;
    //   case 4:
    //     this.style.backgroundColor = "white";
    //     break;
    // }

    this.addEventListener("click", () => {
      window.location.href = "/games/gamedata/" + this._id;
    });

    /**
     * Render of the HTML
     * 
     * <game-box class="box" tabindex="0">
            <div class="game-id">The id</div>
            <div class="game-creator">The creator</div>
            <div class="game-instruction">The instruction</div>
            <div class="game-category">A category</div>
            <div class="game-category">A category</div>
            <div class="game-category">A category</div>
            <div class="game-category">A category</div>
        </game-box>
     */
  }
}
