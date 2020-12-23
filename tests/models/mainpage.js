const { By } = require("selenium-webdriver");
const { until } = require("selenium-webdriver");
const { SignUpPage } = require("./signuppage");
const { AddGamePage } = require("./addgamepage");
const { AllGamesPage } = require("./allgamespage");

class MainPage {
  driver;
  userImageBy = By.id("ppic");
  signUpButtonBy = By.id("signup");
  signInButtonBy = By.id("signin");
  signOutButtonBy = By.id("signout");
  profileButtonBy = By.id("profile");
  codeInputBy = By.name("codeInput");
  joinCreatePartyButtonBy = By.id("toparty");
  createGameButtonBy = By.name("createGame");
  allGamesButtonBy = By.name("allGames");
  createPlaylistButtonBy = By.name("createPlaylist");

  constructor(driver) {
    this.driver = driver;
  }

  createJoinAParty(code) {
    this.driver.findElement(this.codeInputBy).sendKeys(code);
    this.driver.wait(
      until.elementLocated(By.id("signup")),
      3000,
      "Time out after 3 seconds",
      1000
    );
    this.driver.findElement(this.joinCreatePartyButtonBy).click();
  }
  goToSignUp() {
    this.driver.findElement(this.userImageBy).click();
    this.driver.wait(
      until.elementIsVisible(this.driver.findElement(By.id("signup"))),
      3000
    );
    this.driver.findElement(this.signUpButtonBy).click();
    return new SignUpPage(this.driver);
  }
  goToSignIn() {
    this.driver.findElement(this.userImageBy).click();
    this.driver.findElement(this.signInButtonBy).click();
  }

  goToCreateAGame() {
    this.driver.findElement(this.createGameButtonBy).click();
    return new AddGamePage(this.driver);
  }

  goToAllGames() {
    this.driver.findElement(this.allGamesButtonBy).click();
    return new AllGamesPage(this.driver);
  }
}

module.exports = { MainPage };
