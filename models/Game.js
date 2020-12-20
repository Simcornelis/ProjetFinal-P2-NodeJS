class Game {
  creatorPseudo;
  creatorID;
  instruction;
  description;
  categories;

  /**
   * @param {String} creatorPseudo
   * @param {Number} creatorID
   * @param {String} instruction
   * @param {String} description
   * @param {Array} categories
   */
  constructor(creatorPseudo, creatorID, instruction, description, categories) {
    this.creatorPseudo = creatorPseudo;
    this.creatorID = creatorID;
    this.instruction = instruction;
    this.description = description;
    this.categories = categories;
  }
}

module.exports = { Game };
