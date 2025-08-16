import { Page } from '@playwright/test';
import { BasePage } from '../core/base-page';
import { TestData, UserCredentials } from '../data/test-data';
import { logger } from '../core/logger';

export class LoginPage extends BasePage {
  // Selectors
  private readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '#login-button',
    errorMessage: '[data-test="error"]',
    errorButton: '.error-button',
    loginLogo: '.login_logo',
    loginContainer: '#login_button_container',
    credentialsContainer: '#login_credentials'
  };

  constructor(page: Page, testName: string = '') {
    super(page, testName);
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo(TestData.URLS.LOGIN);
    await this.waitForPageLoad();
    await this.assertions.assertElementVisible(this.selectors.loginLogo, 'Login Logo');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.typeText(this.selectors.usernameInput, username, 'Username Input');
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.typeText(this.selectors.passwordInput, password, 'Password Input');
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.selectors.loginButton, 'Login Button');
  }

  /**
   * Perform complete login with credentials
   */
  async login(credentials: UserCredentials): Promise<void> {
    logger.info(`Attempting login with user: ${credentials.username}`, { 
      username: credentials.username, 
      userType: credentials.userType 
    }, this.testName, 'Login Process');

    await this.enterUsername(credentials.username);
    await this.enterPassword(credentials.password);
    await this.clickLoginButton();

    // Wait a moment for the page to process the login
    await this.wait(1000, 'Login processing');
  }

  /**
   * Login with standard user
   */
  async loginAsStandardUser(): Promise<void> {
    const standardUser = TestData.USERS.STANDARD_USER;
    await this.login(standardUser);
  }

  /**
   * Login with locked out user
   */
  async loginAsLockedOutUser(): Promise<void> {
    const lockedOutUser = TestData.USERS.LOCKED_OUT_USER;
    await this.login(lockedOutUser);
  }

  /**
   * Login with problem user
   */
  async loginAsProblemUser(): Promise<void> {
    const problemUser = TestData.USERS.PROBLEM_USER;
    await this.login(problemUser);
  }

  /**
   * Login with performance user
   */
  async loginAsPerformanceUser(): Promise<void> {
    const performanceUser = TestData.USERS.PERFORMANCE_GLITCH_USER;
    await this.login(performanceUser);
  }

  /**
   * Login with visual user
   */
  async loginAsVisualUser(): Promise<void> {
    const visualUser = TestData.USERS.VISUAL_USER;
    await this.login(visualUser);
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials(): Promise<void> {
    logger.info('Attempting login with invalid credentials', TestData.INVALID_CREDENTIALS, this.testName, 'Invalid Login Test');
    
    await this.enterUsername(TestData.INVALID_CREDENTIALS.username);
    await this.enterPassword(TestData.INVALID_CREDENTIALS.password);
    await this.clickLoginButton();
    
    await this.wait(1000, 'Invalid login processing');
  }

  /**
   * Login with empty credentials
   */
  async loginWithEmptyCredentials(): Promise<void> {
    logger.info('Attempting login with empty credentials', {}, this.testName, 'Empty Credentials Test');
    
    await this.enterUsername(TestData.EMPTY_CREDENTIALS.username);
    await this.enterPassword(TestData.EMPTY_CREDENTIALS.password);
    await this.clickLoginButton();
    
    await this.wait(1000, 'Empty login processing');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.selectors.errorMessage, 'Error Message');
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.errorMessage, 'Error Message');
  }

  /**
   * Assert error message
   */
  async assertErrorMessage(expectedMessage: string): Promise<void> {
    await this.assertions.assertElementVisible(this.selectors.errorMessage, 'Error Message');
    await this.assertions.assertElementText(this.selectors.errorMessage, expectedMessage, 'Error Message');
  }

  /**
   * Assert locked out user error
   */
  async assertLockedOutUserError(): Promise<void> {
    await this.assertErrorMessage(TestData.ERROR_MESSAGES.LOCKED_OUT_USER);
  }

  /**
   * Assert invalid credentials error
   */
  async assertInvalidCredentialsError(): Promise<void> {
    await this.assertErrorMessage(TestData.ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  /**
   * Assert empty username error
   */
  async assertEmptyUsernameError(): Promise<void> {
    await this.assertErrorMessage(TestData.ERROR_MESSAGES.EMPTY_USERNAME);
  }

  /**
   * Assert empty password error
   */
  async assertEmptyPasswordError(): Promise<void> {
    await this.assertErrorMessage(TestData.ERROR_MESSAGES.EMPTY_PASSWORD);
  }

  /**
   * Clear error message
   */
  async clearErrorMessage(): Promise<void> {
    if (await this.isErrorMessageDisplayed()) {
      await this.clickElement(this.selectors.errorButton, 'Error Close Button');
    }
  }

  /**
   * Check if login form is displayed
   */
  async isLoginFormDisplayed(): Promise<boolean> {
    const usernameVisible = await this.isElementVisible(this.selectors.usernameInput, 'Username Input');
    const passwordVisible = await this.isElementVisible(this.selectors.passwordInput, 'Password Input');
    const loginButtonVisible = await this.isElementVisible(this.selectors.loginButton, 'Login Button');
    
    return usernameVisible && passwordVisible && loginButtonVisible;
  }

  /**
   * Assert login form is displayed
   */
  async assertLoginFormDisplayed(): Promise<void> {
    await this.assertions.assertElementVisible(this.selectors.usernameInput, 'Username Input');
    await this.assertions.assertElementVisible(this.selectors.passwordInput, 'Password Input');
    await this.assertions.assertElementVisible(this.selectors.loginButton, 'Login Button');
  }

  /**
   * Get available usernames from the page
   */
  async getAvailableUsernames(): Promise<string[]> {
    try {
      const credentialsText = await this.getElementText(this.selectors.credentialsContainer, 'Credentials Container');
      const usernames = credentialsText.match(/\b\w+_user\b/g) || [];
      return usernames;
    } catch (error) {
      logger.warn('Could not retrieve available usernames from page', { error: error.message }, this.testName);
      return [];
    }
  }

  /**
   * Clear all input fields
   */
  async clearAllFields(): Promise<void> {
    await this.typeText(this.selectors.usernameInput, '', 'Username Input');
    await this.typeText(this.selectors.passwordInput, '', 'Password Input');
  }

  /**
   * Assert successful login (user should be redirected to inventory page)
   */
  async assertSuccessfulLogin(): Promise<void> {
    await this.waitForPageLoad();
    await this.assertions.assertPageUrl(TestData.URLS.INVENTORY);
    logger.info('✓ Login successful - redirected to inventory page', { url: this.getCurrentUrl() }, this.testName);
  }

  /**
   * Assert login failed (user should remain on login page)
   */
  async assertLoginFailed(): Promise<void> {
    await this.assertions.assertPageUrl(TestData.URLS.LOGIN);
    await this.assertions.assertElementVisible(this.selectors.errorMessage, 'Error Message');
    logger.info('✓ Login failed as expected - remained on login page', { url: this.getCurrentUrl() }, this.testName);
  }
}
