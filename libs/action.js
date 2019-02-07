'use strict';

const browser = global.browser;

const addDays = require('date-fns/add_days');
const getTime = require('date-fns/get_time');

let action = {
  defaultWaitTime: browser ? browser.config.waitforTimeout : 10000,
  defaultPageRefreshCount: 4,
  defaultPageRefreshTime: 3000,

  open(path = '') {
    browser.url(path);
  },

  wait(waitTime = 0) {
    browser.pause(waitTime);
  },

  waitForUrlToContain(path, waitTime = this.defaultWaitTime) {
    browser.waitUntil(
        () => browser.getUrl().includes(path),
        waitTime,
        `Current url '${browser.getUrl()}' does not contain '${path}'`
    );
  },

  waitForText(selector, waitTime = this.defaultWaitTime) {
    browser.waitUntil(
        () => $(selector).getText().length > 0,
        waitTime,
        `Element '${selector} does not contain text.`);
  },

  executeActionInFrame(frameSelector, action) {
    browser.switchToFrame(frameSelector);
    action();
    browser.switchToFrame(null);
  },

  executeActionInSecondWindow(action) {
    const [first, second] = browser.getWindowHandles().value;

    browser.switchWindow(second);
    action();
    browser.switchWindow(first);
  },

  refreshPage() {
    browser.refresh();
  },

  waitAndRefreshPage(waitTime = 0) {
    this.refreshPage();
    browser.pause(waitTime);
  },

  findElements(selector, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);

    return $$(selector);
  },

  getVisibleElementsCount(selector) {
    return $(selector).isDisplayed() ? this.findElements(selector).length : 0;
  },

  waitForElementsCountToBe(selector, expectedCount, pageRefreshCount = this.defaultPageRefreshCount) {
    return this.waitForResultToBe(expectedCount, () => this.getVisibleElementsCount(selector), pageRefreshCount);
  },

  waitForTextToBe(selector, expectedText, pageRefreshCount = this.defaultPageRefreshCount) {
    return this.waitForResultToBe(expectedText, () => {
      return browser.isDisplayed(selector) ? this.getText(selector) : '';
    }, pageRefreshCount);
  },

  waitForResultToBe(expectedResult, actualResultExpression, pageRefreshCount) {
    const iterate = (iterations) => {
      const actualResult = actualResultExpression();

      if (!iterations || actualResult === expectedResult) {
        return actualResult;
      }

      this.waitAndRefreshPage(this.defaultPageRefreshTime);

      return iterate(--iterations);
    };

    return iterate(pageRefreshCount);
  },

  click(selector, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);
    this.waitForEnabled(selector, waitTime);

    return $(selector).click();
  },

  setValue(selector, value, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);

    return $(selector).setValue(value);
  },

  getText(selector, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);
    this.waitForText(selector, waitTime);

    return $(selector).getText();
  },

  getAttribute(selector, attribute, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);

    return $(selector).getAttribute(attribute);
  },

  getCssProperty(selector, property, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);

    return $(selector).getCssProperty(property);
  },

  getValue(selector, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);

    return $(selector).getValue(selector);
  },

  waitForDisplayed(selector, waitTime = this.defaultWaitTime) {
    return $(selector).waitForDisplayed(waitTime);
  },

  waitForExist(selector, waitTime = this.defaultWaitTime) {
    return $(selector).waitForExist(waitTime);
  },

  waitForInvisible(selector, waitTime = this.defaultWaitTime) {
    return $(selector).waitForDisplayed(waitTime, true);
  },

  waitForEnabled(selector, waitTime = this.defaultWaitTime) {
    return $(selector).waitForEnabled(waitTime);
  },

  clearElement(selector, waitTime = this.defaultWaitTime) {
    this.waitForEnabled(selector, waitTime);

    return $(selector).clearValue();
  },

  setCookie(name, value) {
    browser.setCookies({
      name,
      value,
      domain: browser.options.domain,
      expiry: Math.floor(getTime(addDays(new Date(), 1)) / 1000),
    });
  },

  executeJS(script) {
    browser.execute(script);
  },

  uploadFile(file) {
    browser.uploadFile(file);
  },

  chooseFile(selector, localPath, waitTime = this.defaultWaitTime) {
    this.waitForDisplayed(selector, waitTime);
    browser.chooseFile(selector, localPath);
  },

  getFromLocalStorage(name) {
    return this.executeJS((ItemName) => {
      return window.getLocalStorageItem(ItemName);
    }, name);
  },

  setToLocalStorage(name, value) {
    return this.executeJS((itemName, itemValue) => {
      return window.setLocalStorage(itemName, itemValue);
    }, name, value);
  },

  removeFromLocalStorage(name) {
    return this.executeJS((ItemName) => {
      return window.deleteLocalStorageItem(ItemName);
    }, name);
  },

  clearCookie(name = null) {
    return browser.deleteCookies(name);
  },

  clearAllCookies() {
    return this.deleteCookies();
  },
};

module.exports = action;
