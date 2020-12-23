const { By, until } = require("selenium-webdriver");

class AddGamePage {
  driver;
  gameInstructionBy = By.id("instruction");
  gameDescriptionBy = By.id("description");
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

  async createGame(instruction, description, categories) {
    await this.driver.wait(
      until.elementLocated(By.id("instruction")),
      3000,
      "Time out after 3 seconds",
      1000
    );
    await this.driver.findElement(this.gameInstructionBy).sendKeys(instruction);
    await this.driver.findElement(this.gameDescriptionBy).sendKeys(description);
    for (let i = 0; i < categories.length; i++) {
      let currentCategory = categories[i];
      switch (currentCategory) {
        case "Culture":
          await this.driver.findElement(this.gameCategory1By).click();
          break;
        case "Action":
          await this.driver.findElement(this.gameCategory2By).click();
          break;
        case "Thinking":
          await this.driver.findElement(this.gameCategory3By).click();
          break;
        case "Sport":
          await this.driver.findElement(this.gameCategory4By).click();
          break;
        case "Truth":
          await this.driver.findElement(this.gameCategory5By).click();
          break;
        case "Game":
          await this.driver.findElement(this.gameCategory6By).click();
          break;
        case "Restrictive":
          await this.driver.findElement(this.gameCategory7By).click();
          break;
      }
    }
    await this.driver.findElement(this.createGameButtonBy).click();
  }
}

module.exports = { AddGamePage };
