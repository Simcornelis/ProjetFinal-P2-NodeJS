const { By, until } = require("selenium-webdriver");

class AllGamesPage {
  driver;
  filterButtonBy = By.id("filter");
  filterCultureBy = By.id("Culture");
  filterActionBy = By.id("Action");
  filterThinkingBy = By.id("Thinking");
  filterSportBy = By.id("Sport");
  filterTruthBy = By.id("Truth");
  filterGameBy = By.id("Game");
  filterRestrictiveBy = By.id("Restrictive");
  searchBarBy = By.name("search_query");
  searchButtonBy = By.name("searchButton");
  gameListBy = By.id("game-list");

  constructor(driver) {
    this.driver = driver;
  }

  async searchGame(filterCategories, searchTerms) {
    this.driver.wait(
      until.elementLocated(By.id("filter")),
      3000,
      "Time out after 3 seconds",
      1000
    );
    await this.driver.findElement(this.filterButtonBy).click();
    await this.driver.wait(
      until.elementIsVisible(this.driver.findElement(By.id("Culture"))),
      3000
    );
    for (let i = 0; i < filterCategories.length; i++) {
      let currentCategoryFilter = filterCategories[i];
      switch (currentCategoryFilter) {
        case "Culture":
          await this.driver.findElement(this.filterCultureBy).click();
          break;
        case "Action":
          await this.driver.findElement(this.filterActionBy).click();
          break;
        case "Thinking":
          await this.driver.findElement(this.filterThinkingBy).click();
          break;
        case "Sport":
          await this.driver.findElement(this.filterSportBy).click();
          break;
        case "Truth":
          await this.driver.findElement(this.filterTruthBy).click();
          break;
        case "Game":
          await this.driver.findElement(this.filterGameBy).click();
          break;
        case "Restrictive":
          await this.driver.findElement(this.filterRestrictiveBy).click();
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
