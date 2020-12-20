const { By } = require("selenium-webdriver");

class SignInPage {
  driver;
  userEmailBy = By.name("email");
  userPasswordBy = By.name("pass");
  stayloggedButtonBy = By.name("stayLoggedIn");
  signInButtonBy = By.name("signInButton");
  signUpInsteadLinkBy = By.name("signUpInstead");

  constructor(driver) {
    this.driver = driver;
  }

  signUp(email, password, staylogged) {
    this.driver.findElement(this.userEmailBy).sendKeys(email);
    this.driver.findElement(this.userPasswordBy).sendKeys(password);
    if (staylogged) this.driver.findElement(this.stayloggedButtonBy).click();
    this.driver.findElement(this.signInButtonBy).click();
  }
}

module.exports = { SignInPage };
