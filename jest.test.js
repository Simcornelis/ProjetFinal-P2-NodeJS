const { Builder, By, until, Key, Util } = require("selenium-webdriver");
const script = require("jest");
const { beforeAll } = require("@jest/globals");
const chrome = require("selenium-webdriver/chrome");
const { MainPage } = require("./tests/models/mainpage");
const { SignInPage } = require("./tests/models/signinpage");

let url = "https://localhost:8080";
let testEmail = "jest@email.test";
let testPseudo = "jestPseudo";
let testPassword = "test123JEST";
let testInstruction = "This is my test instruction";
let testDescription = "This is my test description";
let testCategories = ["Culture", "Action"];

let options = new chrome.Options();
options.setAcceptInsecureCerts(true);

// describe("Execute test: Sign up", () => {
//   let driver;
//   let mainPageObject;

//   beforeAll(async () => {
//     driver = new Builder()
//       .forBrowser("chrome")
//       .setChromeOptions(options)
//       .build();
//     mainPageObject = new MainPage(driver);
//   }, 10000);

//   afterAll(async () => {
//     await driver.quit();
//   }, 15000);

//   test("Sign up a new user from the main page", async () => {
//     await driver.get(url);
//     await driver.findElement(By.id("ppic")).click();
//     await driver.wait(
//       //Wait end of animation
//       until.elementIsVisible(driver.findElement(By.id("signup"))),
//       3000
//     );
//     await driver.findElement(By.id("signup")).click();
//     await driver.wait(until.elementLocated(By.name("signUpButton")), 3000); //Without wait, it continue execution while the page is not loaded
//     await driver.findElement(By.id("email")).sendKeys(testEmail);
//     await driver.findElement(By.id("pseudo")).sendKeys(testPseudo);
//     await driver.findElement(By.id("pass")).sendKeys(testPassword);
//     await driver.findElement(By.id("cpass")).sendKeys(testPassword);
//     await driver.findElement(By.name("signUpButton")).click();
//     await driver.wait(until.elementLocated(By.id("logo")), 3000);
//     let title = await driver.getTitle();
//     console.log("[Current URL] : " + (await driver.getCurrentUrl()));
//     expect(title).toContain("Let's Drink");
//   }, 15000);
// });

describe("Execute test: Create a new Game", () => {
  let driver;
  let mainPageObject;
  let signInPageObject;

  beforeAll(async () => {
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    await driver.get("https://localhost:8080/signin");
    await driver.findElement(By.name("email")).sendKeys(testEmail);
    await driver.findElement(By.name("pass")).sendKeys(testPassword);
    await driver.findElement(By.id("stayLoggedIn")).click();
    await driver.findElement(By.name("signInButton")).click();
    mainPageObject = new MainPage(driver);
  }, 15000);

  // afterAll(async () => {
  //   await driver.quit();
  // }, 15000);

  test("Create a new game from main page when connected", async () => {
    await driver.get(url);
    let AddGamePageObject = await mainPageObject.goToCreateAGame();
    await driver.wait(until.elementLocated(By.id("instruction")), 3000); //Without wait, it continue execution while the page is not loaded
    await AddGamePageObject.createGame(
      testInstruction,
      testDescription,
      testCategories
    );
    await driver.wait(until.elementLocated(By.id("filter")), 3000);
    let title = await driver.getTitle();
    expect(title).toContain("All games");
  }, 15000);

  // test("Search for a game in all games", async () => {
  //   await driver.get(url);
  //   let AllGamesPagesObject = await mainPageObject.goToAllGames();
  //   await driver.wait(until.elementLocated(By.id("filter")), 3000); //Without wait, it continue execution while the page is not loaded
  //   await AllGamesPagesObject.searchGame(testCategories, testInstruction);
  //   await driver.wait(until.elementLocated(By.id("instruction")), 3000);
  //   let title = await driver.getTitle();
  //   expect(title).toContain("Game data");
  // }, 15000);
});
