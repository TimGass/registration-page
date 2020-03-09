import { AppPage } from './app.po';
import { browser, logging, element, ElementFinder, by, ExpectedConditions as EC } from 'protractor';
const needle = require('needle');

describe('workspace-project App', () => {
  let page: AppPage;
  let url = 'http://localhost:3000/users';

  beforeEach(() => {
    page = new AppPage();
    browser.waitForAngularEnabled(true);
  });

  it('should display website title.', () => {
    page.navigateTo();
    expect(browser.getTitle()).toEqual('Registration-Page');
  });

  it('should navigate to \'/regiser\' by default.', async () => {
    let url = await browser.getCurrentUrl();
    let endpoint = url.slice(url.lastIndexOf('/'));
    expect(endpoint).toBe('/register');
  });

  it("should display \'Email is required.\' on empty email input.", async () => {
    let email = element(by.css("input[name=email]"));
    email.click();
    let h1 = element(by.css("h1"));
    h1.click();
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe("Email is required.");
  });

  it("should display \'Enter a valid email address.\' on invalid email input.", async () => {
    let email = element(by.css("input[name=email]"));
    email.click();
    email.sendKeys("not an email");
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe("Enter a valid email address.");
  });

  it('should display \'Email already in use!\' when email is already in use.', async () => {
    let email = element(by.css("input[name=email]"));
    email.clear();
    email.sendKeys("yolo@swag.com");
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    expect(element(by.css("mat-error")).getText()).toBe(
      "Email already in use!"
    );
  });

  it("should display \'Username is required.\' on empty username input.", async () => {
    browser.refresh();
    let username = element(by.css("input[name=username]"));
    username.click();
    let h1 = element(by.css("h1"));
    h1.click();
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe("Username is required.");
  });

  it("should display \'Username not available!\' when username is already in use.", async () => {
    let username = element(by.css("input[name=username]"));
    username.clear();
    username.sendKeys("yoloman1");
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe("Username not available!");
  });

  it("should display \'Password is required.\' on empty username input.", async () => {
    browser.refresh();
    let password = element(by.css("input[name=password]"));
    password.click();
    let h1 = element(by.css("h1"));
    h1.click();
    await browser.wait(EC.elementToBeClickable((element(by.css("mat-error")))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe("Password is required.");
  });

  it("should display password requirements when password is invalid.", async () => {
    let password = element(by.css("input[name=password]"));
    password.clear();
    password.sendKeys("invalidPass");
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe(
      "Password should have minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number."
    );
  });

  it("should display \'Confirm Password is required.\' on empty username input.", async () => {
    browser.refresh();
    let confirmPassword = element(by.css("input[name=confirmPassword]"));
    confirmPassword.click();
    let h1 = element(by.css("h1"));
    h1.click();
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe("Confirm Password is required.");
  });

  it("should display error when passwords do not match.", async () => {
    let confirmPassword = element(by.css("input[name=confirmPassword]"));
    confirmPassword.clear();
    confirmPassword.sendKeys("invalidPass");
    let h1 = element(by.css("h1"));
    h1.click();
    await browser.wait(EC.elementToBeClickable(element(by.css("mat-error"))));
    let error = await element(by.css("mat-error")).getText();
    expect(error).toBe(
      "Passwords do not match!"
    );
  });

  it("should navigate to '/users' on link click on the header.", async () => {
    let link = element(by.css("a[href='/users']"));
    link.click();
    let title = element(by.css("h1")).getText();
    let url = await browser.getCurrentUrl();
    let endpoint = url.slice(url.lastIndexOf("/"));
    expect(title).toBe("Users");
    expect(endpoint).toBe("/users");
  });

  it("should navigate to '/register' on link click on the header.", async () => {
    let link = element(by.css("a[href='/register']"));
    link.click();
    let title = element(by.css("h1")).getText();
    let url = await browser.getCurrentUrl();
    let endpoint = url.slice(url.lastIndexOf("/"));
    expect(title).toBe("Register");
    expect(endpoint).toBe("/register");
  });

  it("should create a new user and remove them", async () => {
    const email = "somethingunique24325@afga.com";
    const username = "somethingunique24325";
    const password = "Somethingunique24325";
    const confirmPassword = "Somethingunique24325";
    let emailEl = element(by.css("input[name=email]"));
    emailEl.click();
    emailEl.sendKeys(email);
    let usernameEl = element(by.css("input[name=username]"));
    usernameEl.click();
    usernameEl.sendKeys(username);
    let passwordEl = element(by.css("input[name=password]"));
    passwordEl.click();
    passwordEl.sendKeys(password);
    let confirmPasswordEl = element(by.css("input[name=confirmPassword]"));
    confirmPasswordEl.click();
    confirmPasswordEl.sendKeys(confirmPassword);
    let submit = element(by.css("button[type=submit]"));
    submit.click();
    let card = element(by.cssContainingText('mat-card.users-card', username));
    const userCreated = await card.isPresent();
    expect(userCreated).toBe(true);
    let idEl = card.element(by.cssContainingText('mat-card-content > p', 'id:'));
    let idText = await idEl.getText();
    const id = idText.replace("id: ", "").trim();
    let response = await needle('delete', `${url}/${id}`).then(response => response);
    expect(response.body).toEqual({});
    browser.refresh();
    expect(element(by.cssContainingText("mat-card.users-card", username)).isPresent()).toBe(false);
  });

  it("should change the pages within the users page.", async () => {
    let card = element(by.css('mat-card.users-card'));
    let idEl = card.element(by.cssContainingText("mat-card-content > p", "id:"));
    let idText = await idEl.getText();
    const id = idText.replace("id: ", "").trim();
    let back = element(by.css('button.back-page'));
    back.click();
    expect(element(by.cssContainingText('mat-card.users-card', id)).isPresent()).toBe(false);
    //still have users, just not our user
    expect(element(by.css("mat-card.users-card")).isPresent()).toBe(true);
    let next = element(by.css('button.next-page'));
    next.click();
    //our user is still on the page!
    expect(element(by.cssContainingText("mat-card.users-card", id)).isPresent()).toBe(true);
    let first = element(by.css("button.first-page"));
    first.click();
    expect(
      element(by.cssContainingText("mat-card.users-card", id)).isPresent()
    ).toBe(false);
    expect(element(by.css("mat-card.users-card")).isPresent()).toBe(true);
    let last = element(by.css("button.last-page"));
    last.click();
    expect(
      element(by.cssContainingText("mat-card.users-card", id)).isPresent()
    ).toBe(true);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
