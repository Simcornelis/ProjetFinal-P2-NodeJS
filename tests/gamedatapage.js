const { By } = require("selenium-webdriver");

class GameDataPage {
  driver;
  gameInstructionBy = By.id("instruction");
  gameDescriptionBy = By.id("description");
  gameCategoriesBy = By.id("categories");

  constructor(driver) {
    this.driver = driver;
  }
}

module.exports = { GameDataPage };
