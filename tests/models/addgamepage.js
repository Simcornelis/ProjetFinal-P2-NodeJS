const { By } = require("selenium-webdriver");

class AddGamePage {
  driver;
  gameInstructionBy = By.name("instruction");
  gameDescriptionBy = By.name("description");
  gameCategory1By = By.id("category1");
  gameCategory2By = By.id("category2");
  gameCategory3By = By.id("category3");
  gameCategory4By = By.id("category4");
  gameCategory5By = By.id("category5");
  gameCategory6By = By.id("category6");
  gameCategory7By = By.id("category7");
  createGameButtonBy = By.name("createGameButton");

  constructor(driver) {
    this.driver = driver;
  }

  createGame(instruction, description, categories) {
    this.driver.findElement(this.gameInstructionBy).sendKeys(instruction);
    this.driver.findElement(this.gameDescriptionBy).sendKeys(description);
    for (let i = 0; i < categories.length; i++) {
      let currentCategory = categories[i];
      switch (currentCategory) {
        case "Culture":
          this.driver.findElement(this.gameCategory1By).click();
          break;
        case "Action":
          this.driver.findElement(this.gameCategory2By).click();
          break;
        case "Thinking":
          this.driver.findElement(this.gameCategory3By).click();
          break;
        case "Sport":
          this.driver.findElement(this.gameCategory4By).click();
          break;
        case "Truth":
          this.driver.findElement(this.gameCategory5By).click();
          break;
        case "Game":
          this.driver.findElement(this.gameCategory6By).click();
          break;
        case "Restrictive":
          this.driver.findElement(this.gameCategory7By).click();
          break;
      }
    }
    this.driver.findElement(this.createGameButtonBy).click();
  }
}

module.exports = { AddGamePage };
