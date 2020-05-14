'use strict';

const browser = global.browser;

module.exports = {
  defaultWaitTime: browser ? browser.config.waitforTimeout : 10000,
  defaultPageRefreshCount: 4,
  defaultPageRefreshTime: 3000,
  defaultAttribute: 'value',

  open(path = '') {
    browser.url(path);
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
    const [first, second] = browser.getWindowHandles();

    browser.switchToWindow(second);
    action();
    browser.switchToWindow(first);
  },

  findElements(selector, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

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
      return $(selector).isDisplayed() ? this.getText(selector) : '';
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

    return $(selector).click();
  },

  setValue(selector, value, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return $(selector).setValue(value);
  },

  getText(selector, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return $(selector).getText();
  },

  selectByAttribute(selector, value, attribute = this.defaultAttribute, waitTime = this.defaultWaitTime) {
    this.waitForEnabled(selector, waitTime);
    $(selector).selectByAttribute(attribute, value);
  },

  getAttribute(selector, attribute, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return $(selector).getAttribute(attribute);
  },

  getCssProperty(selector, property, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return $(selector).getCSSProperty(property);
  },

  getValue(selector, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);

    return $(selector).getValue(selector);
  },

  waitForVisible(selector, waitTime = this.defaultWaitTime) {
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

  waitIsDisplayed(selector, waitTime = this.defaultWaitTime) {
    try {
      this.waitForVisible(selector, waitTime);
      return true;
    } catch (err) {
      return false;
    }
  },

  clearElement(selector, waitTime = this.defaultWaitTime) {
    this.waitForEnabled(selector, waitTime);

    return $(selector).clearValue();
  },

  chooseFile(selector, localPath, waitTime = this.defaultWaitTime) {
    this.waitForVisible(selector, waitTime);
    browser.chooseFile(selector, localPath);
  },
};
