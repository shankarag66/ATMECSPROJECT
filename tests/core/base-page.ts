import { Page, Locator } from '@playwright/test';
import { logger } from './logger';
import { CustomAssertions } from './assertions';

export abstract class BasePage {
  protected page: Page;
  protected assertions: CustomAssertions;
  protected testName: string;

  constructor(page: Page, testName: string = '') {
    this.page = page;
    this.testName = testName;
    this.assertions = new CustomAssertions(page, testName);
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    try {
      logger.info(`Navigating to: ${url}`, { url }, this.testName, 'Navigation');
      await this.page.goto(url, { waitUntil: 'networkidle' });
      logger.info(`✓ Successfully navigated to: ${url}`, { url }, this.testName);
    } catch (error) {
      logger.error(`✗ Failed to navigate to: ${url}`, { url, error: error.message }, this.testName);
      throw new Error(`Navigation failed: Unable to navigate to ${url}. ${error.message}`);
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, elementName: string, timeout: number = 10000): Promise<Locator> {
    try {
      logger.info(`Waiting for ${elementName} to be visible`, { selector, timeout }, this.testName, 'Element Wait');
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      logger.info(`✓ ${elementName} is now visible`, { selector }, this.testName);
      return element;
    } catch (error) {
      logger.error(`✗ ${elementName} did not become visible within ${timeout}ms`, { 
        selector, 
        timeout, 
        error: error.message 
      }, this.testName);
      throw new Error(`Element wait failed: ${elementName} with selector '${selector}' did not become visible within ${timeout}ms`);
    }
  }

  /**
   * Click on an element with retry mechanism
   */
  async clickElement(selector: string, elementName: string, retries: number = 3): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.info(`Clicking ${elementName} (attempt ${attempt}/${retries})`, { selector }, this.testName, 'Element Click');
        
        const element = await this.waitForElement(selector, elementName);
        await element.click();
        
        logger.info(`✓ Successfully clicked ${elementName}`, { selector }, this.testName);
        return;
      } catch (error) {
        lastError = error as Error;
        logger.warn(`✗ Click attempt ${attempt} failed for ${elementName}`, { 
          selector, 
          attempt, 
          error: error.message 
        }, this.testName);
        
        if (attempt < retries) {
          await this.page.waitForTimeout(1000); // Wait 1 second before retry
        }
      }
    }
    
    logger.error(`✗ All click attempts failed for ${elementName}`, { 
      selector, 
      retries, 
      error: lastError?.message 
    }, this.testName);
    throw new Error(`Click failed: Unable to click ${elementName} after ${retries} attempts. ${lastError?.message}`);
  }

  /**
   * Type text into an input field
   */
  async typeText(selector: string, text: string, elementName: string, clearFirst: boolean = true): Promise<void> {
    try {
      logger.info(`Typing text into ${elementName}`, { selector, textLength: text.length }, this.testName, 'Text Input');
      
      const element = await this.waitForElement(selector, elementName);
      
      if (clearFirst) {
        await element.clear();
      }
      
      await element.fill(text);
      logger.info(`✓ Successfully typed text into ${elementName}`, { selector }, this.testName);
    } catch (error) {
      logger.error(`✗ Failed to type text into ${elementName}`, { 
        selector, 
        error: error.message 
      }, this.testName);
      throw new Error(`Text input failed: Unable to type into ${elementName} with selector '${selector}'. ${error.message}`);
    }
  }

  /**
   * Get text content from an element
   */
  async getElementText(selector: string, elementName: string): Promise<string> {
    try {
      logger.info(`Getting text from ${elementName}`, { selector }, this.testName, 'Text Retrieval');
      
      const element = await this.waitForElement(selector, elementName);
      const text = await element.textContent() || '';
      
      logger.info(`✓ Retrieved text from ${elementName}`, { selector, text }, this.testName);
      return text;
    } catch (error) {
      logger.error(`✗ Failed to get text from ${elementName}`, { 
        selector, 
        error: error.message 
      }, this.testName);
      throw new Error(`Text retrieval failed: Unable to get text from ${elementName} with selector '${selector}'. ${error.message}`);
    }
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string, elementName: string, timeout: number = 5000): Promise<boolean> {
    try {
      logger.debug(`Checking if ${elementName} is visible`, { selector, timeout }, this.testName, 'Visibility Check');
      
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      
      logger.debug(`✓ ${elementName} is visible`, { selector }, this.testName);
      return true;
    } catch (error) {
      logger.debug(`✗ ${elementName} is not visible`, { selector, error: error.message }, this.testName);
      return false;
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    try {
      logger.info('Waiting for page to load completely', {}, this.testName, 'Page Load');
      await this.page.waitForLoadState('networkidle');
      logger.info('✓ Page loaded completely', {}, this.testName);
    } catch (error) {
      logger.error('✗ Page load timeout', { error: error.message }, this.testName);
      throw new Error(`Page load failed: ${error.message}`);
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    try {
      logger.info(`Taking screenshot: ${name}`, { name }, this.testName, 'Screenshot');
      await this.page.screenshot({ 
        path: `test-results/screenshots/${name}-${Date.now()}.png`,
        fullPage: true 
      });
      logger.info(`✓ Screenshot saved: ${name}`, { name }, this.testName);
    } catch (error) {
      logger.error(`✗ Failed to take screenshot: ${name}`, { name, error: error.message }, this.testName);
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string, elementName: string): Promise<void> {
    try {
      logger.info(`Scrolling to ${elementName}`, { selector }, this.testName, 'Scroll Action');
      
      const element = this.page.locator(selector);
      await element.scrollIntoViewIfNeeded();
      
      logger.info(`✓ Scrolled to ${elementName}`, { selector }, this.testName);
    } catch (error) {
      logger.error(`✗ Failed to scroll to ${elementName}`, { 
        selector, 
        error: error.message 
      }, this.testName);
      throw new Error(`Scroll failed: Unable to scroll to ${elementName} with selector '${selector}'. ${error.message}`);
    }
  }

  /**
   * Wait for a specific amount of time
   */
  async wait(milliseconds: number, reason: string = 'General wait'): Promise<void> {
    logger.info(`Waiting ${milliseconds}ms - ${reason}`, { milliseconds, reason }, this.testName, 'Wait');
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    const url = this.page.url();
    logger.debug('Retrieved current URL', { url }, this.testName);
    return url;
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    const title = await this.page.title();
    logger.debug('Retrieved page title', { title }, this.testName);
    return title;
  }

  /**
   * Refresh the page
   */
  async refreshPage(): Promise<void> {
    try {
      logger.info('Refreshing page', {}, this.testName, 'Page Refresh');
      await this.page.reload({ waitUntil: 'networkidle' });
      logger.info('✓ Page refreshed successfully', {}, this.testName);
    } catch (error) {
      logger.error('✗ Failed to refresh page', { error: error.message }, this.testName);
      throw new Error(`Page refresh failed: ${error.message}`);
    }
  }
}
