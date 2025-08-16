import { expect, Page } from '@playwright/test';
import { logger } from './logger';

export class CustomAssertions {
  private page: Page;
  private testName: string;

  constructor(page: Page, testName: string = '') {
    this.page = page;
    this.testName = testName;
  }

  async assertElementVisible(selector: string, elementName: string, timeout: number = 10000): Promise<void> {
    try {
      logger.info(`Asserting ${elementName} is visible`, { selector }, this.testName, 'Element Visibility Check');
      await expect(this.page.locator(selector)).toBeVisible({ timeout });
      logger.info(`✓ ${elementName} is visible`, { selector }, this.testName);
    } catch (error) {
      logger.error(`✗ ${elementName} is not visible`, { selector, error: error.message }, this.testName);
      throw new Error(`Assertion failed: ${elementName} with selector '${selector}' is not visible. ${error.message}`);
    }
  }

  async assertElementHidden(selector: string, elementName: string, timeout: number = 5000): Promise<void> {
    try {
      logger.info(`Asserting ${elementName} is hidden`, { selector }, this.testName, 'Element Hidden Check');
      await expect(this.page.locator(selector)).toBeHidden({ timeout });
      logger.info(`✓ ${elementName} is hidden`, { selector }, this.testName);
    } catch (error) {
      logger.error(`✗ ${elementName} is still visible`, { selector, error: error.message }, this.testName);
      throw new Error(`Assertion failed: ${elementName} with selector '${selector}' is still visible. ${error.message}`);
    }
  }

  async assertElementText(selector: string, expectedText: string, elementName: string): Promise<void> {
    try {
      logger.info(`Asserting ${elementName} has text: "${expectedText}"`, { selector }, this.testName, 'Text Assertion');
      await expect(this.page.locator(selector)).toHaveText(expectedText);
      logger.info(`✓ ${elementName} has correct text`, { selector, expectedText }, this.testName);
    } catch (error) {
      const actualText = await this.page.locator(selector).textContent();
      logger.error(`✗ ${elementName} text mismatch`, { 
        selector, 
        expectedText, 
        actualText, 
        error: error.message 
      }, this.testName);
      throw new Error(`Assertion failed: ${elementName} text mismatch. Expected: "${expectedText}", Actual: "${actualText}"`);
    }
  }

  async assertElementContainsText(selector: string, expectedText: string, elementName: string): Promise<void> {
    try {
      logger.info(`Asserting ${elementName} contains text: "${expectedText}"`, { selector }, this.testName, 'Text Contains Assertion');
      await expect(this.page.locator(selector)).toContainText(expectedText);
      logger.info(`✓ ${elementName} contains expected text`, { selector, expectedText }, this.testName);
    } catch (error) {
      const actualText = await this.page.locator(selector).textContent();
      logger.error(`✗ ${elementName} does not contain expected text`, { 
        selector, 
        expectedText, 
        actualText, 
        error: error.message 
      }, this.testName);
      throw new Error(`Assertion failed: ${elementName} does not contain "${expectedText}". Actual text: "${actualText}"`);
    }
  }

  async assertPageTitle(expectedTitle: string): Promise<void> {
    try {
      logger.info(`Asserting page title: "${expectedTitle}"`, {}, this.testName, 'Page Title Check');
      await expect(this.page).toHaveTitle(expectedTitle);
      logger.info(`✓ Page has correct title`, { expectedTitle }, this.testName);
    } catch (error) {
      const actualTitle = await this.page.title();
      logger.error(`✗ Page title mismatch`, { 
        expectedTitle, 
        actualTitle, 
        error: error.message 
      }, this.testName);
      throw new Error(`Assertion failed: Page title mismatch. Expected: "${expectedTitle}", Actual: "${actualTitle}"`);
    }
  }

  async assertPageUrl(expectedUrl: string): Promise<void> {
    try {
      logger.info(`Asserting page URL: "${expectedUrl}"`, {}, this.testName, 'Page URL Check');
      await expect(this.page).toHaveURL(expectedUrl);
      logger.info(`✓ Page has correct URL`, { expectedUrl }, this.testName);
    } catch (error) {
      const actualUrl = this.page.url();
      logger.error(`✗ Page URL mismatch`, { 
        expectedUrl, 
        actualUrl, 
        error: error.message 
      }, this.testName);
      throw new Error(`Assertion failed: Page URL mismatch. Expected: "${expectedUrl}", Actual: "${actualUrl}"`);
    }
  }

  async assertElementCount(selector: string, expectedCount: number, elementName: string): Promise<void> {
    try {
      logger.info(`Asserting ${elementName} count: ${expectedCount}`, { selector }, this.testName, 'Element Count Check');
      await expect(this.page.locator(selector)).toHaveCount(expectedCount);
      logger.info(`✓ ${elementName} has correct count`, { selector, expectedCount }, this.testName);
    } catch (error) {
      const actualCount = await this.page.locator(selector).count();
      logger.error(`✗ ${elementName} count mismatch`, { 
        selector, 
        expectedCount, 
        actualCount, 
        error: error.message 
      }, this.testName);
      throw new Error(`Assertion failed: ${elementName} count mismatch. Expected: ${expectedCount}, Actual: ${actualCount}`);
    }
  }

  async assertElementEnabled(selector: string, elementName: string): Promise<void> {
    try {
      logger.info(`Asserting ${elementName} is enabled`, { selector }, this.testName, 'Element Enabled Check');
      await expect(this.page.locator(selector)).toBeEnabled();
      logger.info(`✓ ${elementName} is enabled`, { selector }, this.testName);
    } catch (error) {
      logger.error(`✗ ${elementName} is disabled`, { selector, error: error.message }, this.testName);
      throw new Error(`Assertion failed: ${elementName} with selector '${selector}' is disabled. ${error.message}`);
    }
  }

  async assertElementDisabled(selector: string, elementName: string): Promise<void> {
    try {
      logger.info(`Asserting ${elementName} is disabled`, { selector }, this.testName, 'Element Disabled Check');
      await expect(this.page.locator(selector)).toBeDisabled();
      logger.info(`✓ ${elementName} is disabled`, { selector }, this.testName);
    } catch (error) {
      logger.error(`✗ ${elementName} is enabled`, { selector, error: error.message }, this.testName);
      throw new Error(`Assertion failed: ${elementName} with selector '${selector}' is enabled. ${error.message}`);
    }
  }

  async softAssertElementVisible(selector: string, elementName: string): Promise<boolean> {
    try {
      await expect(this.page.locator(selector)).toBeVisible({ timeout: 5000 });
      logger.info(`✓ Soft assertion passed: ${elementName} is visible`, { selector }, this.testName);
      return true;
    } catch (error) {
      logger.warn(`✗ Soft assertion failed: ${elementName} is not visible`, { selector, error: error.message }, this.testName);
      return false;
    }
  }

  async softAssertElementText(selector: string, expectedText: string, elementName: string): Promise<boolean> {
    try {
      await expect(this.page.locator(selector)).toHaveText(expectedText);
      logger.info(`✓ Soft assertion passed: ${elementName} has correct text`, { selector, expectedText }, this.testName);
      return true;
    } catch (error) {
      const actualText = await this.page.locator(selector).textContent();
      logger.warn(`✗ Soft assertion failed: ${elementName} text mismatch`, { 
        selector, 
        expectedText, 
        actualText, 
        error: error.message 
      }, this.testName);
      return false;
    }
  }
}
