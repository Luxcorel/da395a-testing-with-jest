const { Builder, By, until } = require("selenium-webdriver");
require("geckodriver");

const fileUnderTest =
  "file://" + __dirname.replace(/ /g, "%20") + "/../dist/index.html";
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
  console.log(fileUnderTest);
  driver = await new Builder().forBrowser("firefox").build();
  await driver.get(fileUnderTest);
});

// Ladda om sidan inför varje test för att städa upp state
beforeEach(async () => {
  driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async () => {
  await driver.quit();
}, defaultTimeout);

test("The stack should be empty in the beginning", async () => {
  let stack = await driver.findElement(By.id("top_of_stack")).getText();
  expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
  it("should open a prompt box", async () => {
    let push = await driver.findElement(By.id("push"));
    await push.click();
    let alert = await driver.switchTo().alert();
    await alert.sendKeys("Bananer");
    await alert.accept();
  });
});

// My own test
test('Clicking "Poppa stacken!" should display the removed item', async () => {
  const push = await driver.findElement(By.id("push"));
  await push.click();
  const pushPrompt = await driver.switchTo().alert();
  await pushPrompt.sendKeys("foobar");
  await pushPrompt.accept();

  const pop = await driver.findElement(By.id("pop"));
  await pop.click();
  const popAlert = await driver.switchTo().alert();
  const popText = await popAlert.getText();
  await popAlert.accept();

  expect(popText).toBe("Tog bort foobar");
});
