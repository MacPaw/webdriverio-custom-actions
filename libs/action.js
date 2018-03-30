'use strict';

const browser = global.browser;

const addDays = require('date-fns/add_days');
const getTime = require('date-fns/get_time');

let action = {
  defaultWaitTime: 10000,
  defaultPageRefreshCount: 4,
  defaultPageRefreshTime: 3000,

  findElements(selector, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return $$(selector);
  },

  getVisibleElementsCount(selector) {
    return browser.isVisible(selector) ? this.findElements(selector).length : 0;
  },

  waitForElementsCountToBe(selector, expectedCount, pageRefreshCount = this.defaultPageRefreshCount) {
    return this.waitForResultToBe(expectedCount, () => this.getVisibleElementsCount(selector), pageRefreshCount);
  },

  waitForTextToBe(selector, expectedText, pageRefreshCount = this.defaultPageRefreshCount) {
    return this.waitForResultToBe(expectedText, () => {
      return browser.isVisible(selector) ? this.getText(selector) : '';
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
    this.waitForVisible(selector, waitTime);
    this.waitForEnabled(selector, waitTime);

    return browser.click(selector);
  },

  setValue(selector, value, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return browser.element(selector).setValue(value);
  },

  getText(selector, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);
    browser.waitForText(selector, waitTime);

    return browser.getText(selector);
  },

  getAttribute(selector, attribute, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return browser.getAttribute(selector, attribute);
  },

  getCssProperty(selector, property, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return browser.getCssProperty(selector, property);
  },

  getValue(selector, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return browser.getValue(selector);
  },

  waitForVisible(selector, waitTime = this.defaultWaitTime) {
    return browser.waitForVisible(selector, waitTime);
  },

  waitForExist(selector, waitTime = this.defaultWaitTime) {
    return browser.waitForExist(selector, waitTime);
  },

  waitForInvisible(selector, waitTime = this.defaultWaitTime) {
    return browser.waitForVisible(selector, waitTime, true);
  },

  waitForEnabled(selector, waitTime = this.defaultWaitTime) {
    return browser.waitForEnabled(selector, waitTime);
  },

  clearElement(selector, waitTime = this.defaultWaitTime) {
    this.waitForEnabled(selector, waitTime);

    return browser.clearElement(selector);
  },

  waitForElementToHaveNoText(selector, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return browser.waitForText(selector, waitTime, true);
  },

  setCookie(name, value) {
    browser.setCookie({
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
    this.waitForVisible(selector, waitTime);
    browser.chooseFile(selector, localPath);
  },

  waitAndRefreshPage(waitTime = 0) {
    browser.refresh();
    browser.pause(waitTime);
  },
};

module.exports = action;
