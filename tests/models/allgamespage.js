const { By, until } = require("selenium-webdriver");

class AllGamesPage {
  driver;
  filterButtonBy = By.name("filterButton");
  filterCategory1By = By.id("category1");
  filterCategory2By = By.id("category2");
  filterCategory3By = By.id("category3");
  filterCategory4By = By.id("category4");
  filterCategory5By = By.id("category5");
  filterCategory6By = By.id("category6");
  filterCategory7By = By.id("category7");
  searchBarBy = By.name("search_query");
  searchButtonBy = By.id("searchButton");
  gameListBy = By.name("game-list");

  constructor(driver) {
    this.driver = driver;
  }

  async searchGame(filterCategories, searchTerms) {
    await this.driver.findElement(this.filterButtonBy).click();
    await this.driver.findElement(this.filterButtonBy).click();
    await this.driver.wait(
      until.elementIsVisible(this.driver.findElement(By.id("category1"))),
      2000
    );
    for (let i = 0; i < filterCategories.length; i++) {
      let currentCategoryFilter = filterCategories[i];
      switch (currentCategoryFilter) {
        case "Culture":
          await this.driver.findElement(this.filterCategory1By).click();
          break;
        case "Action":
          await this.driver.findElement(this.filterCategory2By).click();
          break;
        case "Thinking":
          await this.driver.findElement(this.filterCategory3By).click();
          break;
        case "Sport":
          await this.driver.findElement(this.filterCategory4By).click();
          break;
        case "Truth":
          await this.driver.findElement(this.filterCategory5By).click();
          break;
        case "Game":
          await this.driver.findElement(this.filterCategory6By).click();
          break;
        case "Restrictive":
          await this.driver.findElement(this.filterCategory7By).click();
          break;
      }
    }
    await this.driver.findElement(this.searchBarBy).sendKeys(searchTerms);
    await this.driver.findElement(this.searchButtonBy).click();
    let gamelist = await this.driver.findElement(this.gameListBy);
    let games = await gamelist.findElements(By.css("game-box"));
    await games[0].click();
  }
}

module.exports = { AllGamesPage };
