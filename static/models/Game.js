class Game extends HTMLElement {
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
    gameInstruction.className = "instruction overflow";
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
        case "Thinking":
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
        case "Restrictive":
          categoryEmoji = categoryEmoji.concat("👿 ");
          break;
        default:
          break;
      }
    }
    const gameCategories = document.createElement("div");
    gameCategories.className = "category";
    gameCategories.innerText = categoryEmoji;
    if (categoryEmoji !== "") {
      this.appendChild(gameCategories);
    }

    const gameCreator = document.createElement("div");
    gameCreator.className = "creator overflow";
    gameCreator.innerText = this.creatorPseudo || "Unknown Creator";
    gameCreator.addEventListener("click", () => {
      window.location.href = "/profil/" + creatorID;
    });
    if (categoryEmoji !== "") {
    }
    this.appendChild(gameCreator);

    this.addEventListener("click", () => {
      window.location.href = "/games/gamedata/" + this._id;
    });
  }
}
