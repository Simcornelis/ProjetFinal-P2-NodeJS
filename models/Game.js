const { ObjectId } = require("mongodb");

class Game {
  _id;
  creatorPseudo;
  creatorID;
  consign;
  description;
  categories;

  /**
   * @param {ObjectId} _id
   * @param {String} creatorPseudo
   * @param {number} creatorID
   * @param {String} consign
   * @param {String} description
   * @param {Array} categories
   */
  constructor(creatorPseudo, creatorID, consign, description, categories) {
    this.creatorPseudo = creatorPseudo;
    this.creatorID = creatorID;
    this.consign = consign;
    this.description = description;
    this.categories = categories;
  }
}

module.exports = { Game };
