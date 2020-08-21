'use strict';

module.exports = {
  get browser() {
    return global.browser;
  },

  get defaultWaitForTimeout() {
    return this.browser ? this.browser.config.waitforTimeout : 10000;
  },

  get defaultPageRefreshCount() {
    return 3;
  },

  get defaultPageRefreshTime() {
    return 3000;
  },

  get defaultAttribute() {
    return 'value';
  },

  open(path = '') {
    this.browser.url(path);
  },

  waitForUrlToContain(path, timeout = this.defaultWaitForTimeout) {
    this.browser.waitUntil(
      () => this.browser.getUrl().includes(path),
      {
        timeout,
        timeoutMsg: `Current url '${this.browser.getUrl()}' does not contain '${path}'`,
      },
    );
  },

  waitForText(selector, timeout = this.defaultWaitForTimeout) {
    this.browser.waitUntil(
      () => $(selector).getText().length > 0,
      {
        timeout,
        timeoutMsg: `Element '${selector} does not contain text.`,
      },
    );
  },

  executeActionInFrame(frameSelector, action) {
    this.browser.switchToFrame(frameSelector);
    action();
    this.browser.switchToFrame(null);
  },

  executeActionInSecondWindow(action) {
    const [first, second] = this.browser.getWindowHandles();

    this.browser.switchToWindow(second);
    action();
    this.browser.switchToWindow(first);
  },

  findElements(selector, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);

    return $$(selector);
  },

  getVisibleElementsCount(selector) {
    return $(selector).isDisplayed() ? this.findElements(selector).length : 0;
  },

  waitForElementsCountToBe(
    selector,
    expectedCount,
    pageRefreshCount = this.defaultPageRefreshCount,
  ) {
    return this.waitForResultToBe(expectedCount, () => {
      this.getVisibleElementsCount(selector);
    }, pageRefreshCount);
  },

  waitForTextToBe(selector, expectedText, pageRefreshCount = this.defaultPageRefreshCount) {
    return this.waitForResultToBe(expectedText, () => {
      let result = '';

      if ($(selector).isDisplayed()) {
        result = this.getText(selector);
      }

      return result;
    }, pageRefreshCount);
  },

  waitForResultToBe(expectedResult, actualResultExpression, pageRefreshCount) {
    const iterate = (iterations) => {
      const actualResult = actualResultExpression();

      if (!iterations || actualResult === expectedResult) {
        return actualResult;
      }

      this.browser.refresh();
      this.browser.pause(this.defaultPageRefreshTime);

      return iterate(iterations - 1);
    };

    return iterate(pageRefreshCount);
  },

  selectCheckBox(selector, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);
    this.waitForEnabled(selector, timeout);

    if (!selector.isSelected()) {
      $(selector).click();
    }
  },

  unselectCheckBox(selector, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);
    this.waitForEnabled(selector, timeout);

    if (selector.isSelected()) {
      $(selector).click();
    }
  },

  click(selector, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);
    this.waitForEnabled(selector, timeout);

    return $(selector).click();
  },

  setValue(selector, value, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);

    return $(selector).setValue(value);
  },

  getText(selector, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);

    return $(selector).getText();
  },

  selectByAttribute(
    selector,
    value,
    attribute = this.defaultAttribute,
    timeout = this.defaultWaitForTimeout,
  ) {
    this.waitForEnabled(selector, timeout);
    $(selector).selectByAttribute(attribute, value);
  },

  getAttribute(
    selector,
    attribute = this.defaultAttribute,
    timeout = this.defaultWaitForTimeout,
  ) {
    this.waitForVisible(selector, timeout);

    return $(selector).getAttribute(attribute);
  },

  getCssProperty(selector, property, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);

    return $(selector).getCSSProperty(property);
  },

  getValue(selector, timeout = this.defaultWaitForTimeout) {
    this.waitForVisible(selector, timeout);

    return $(selector).getValue(selector);
  },

  waitForVisible(selector, timeout = this.defaultWaitForTimeout) {
    return $(selector).waitForDisplayed({timeout});
  },

  waitForInvisible(selector, timeout = this.defaultWaitForTimeout) {
    return $(selector).waitForDisplayed({timeout}, true);
  },

  waitForExist(selector, timeout = this.defaultWaitForTimeout) {
    return $(selector).waitForExist({timeout});
  },

  waitForEnabled(selector, timeout = this.defaultWaitForTimeout) {
    return $(selector).waitForEnabled({timeout});
  },

  waitIsDisplayed(selector, timeout = this.defaultWaitForTimeout) {
    try {
      this.waitForVisible(selector, timeout);
      return true;
    } catch (err) {
      return false;
    }
  },

  waitIsInvisible(selector, timeout = this.defaultWaitForTimeout) {
    try {
      this.waitForInvisible(selector, timeout);
      return true;
    } catch (err) {
      return false;
    }
  },

  clearElement(selector, timeout = this.defaultWaitForTimeout) {
    this.waitForEnabled(selector, timeout);

    return $(selector).clearValue();
  },
};
