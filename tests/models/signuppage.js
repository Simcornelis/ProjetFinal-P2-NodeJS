const { By } = require("selenium-webdriver");

class SignUpPage {
  driver;
  userEmailBy = By.name("email");
  userPseudoBy = By.name("pseudo");
  userPasswordBy = By.name("pass");
  userPasswordConfirmationBy = By.name("cpass");
  stayloggedButtonBy = By.name("stayLoggedIn");
  signUpButtonBy = By.name("signUpButton");
  signInInsteadLinkBy = By.name("signInInstead");

  constructor(driver) {
    this.driver = driver;
  }

  signUp(email, pseudo, password, staylogged) {
    this.driver.findElement(this.userEmailBy).sendKeys(email);
    this.driver.findElement(this.userPseudoBy).sendKeys(pseudo);
    this.driver.findElement(this.userPasswordBy).sendKeys(password);
    this.driver.findElement(this.userPasswordConfirmationBy).sendKeys(password);
    if (staylogged) this.driver.findElement(this.stayloggedButtonBy).click();
    this.driver.findElement(this.signUpButtonBy).click();
  }
}

module.exports = { SignUpPage };
