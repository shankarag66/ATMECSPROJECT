export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  slowMo: number;
  viewport: {
    width: number;
    height: number;
  };
  screenshot: {
    mode: 'off' | 'only-on-failure' | 'on';
    fullPage: boolean;
  };
  video: {
    mode: 'off' | 'on' | 'retain-on-failure';
    size: {
      width: number;
      height: number;
    };
  };
}

export const testConfig: TestConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/v1/index.html',
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  retries: parseInt(process.env.RETRIES || '2'),
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO || '0'),
  viewport: {
    width: 1280,
    height: 720
  },
  screenshot: {
    mode: 'only-on-failure',
    fullPage: true
  },
  video: {
    mode: 'retain-on-failure',
    size: {
      width: 1280,
      height: 720
    }
  }
};

export const environments = {
  dev: 'https://www.saucedemo.com/v1/index.html',
  staging: 'https://www.saucedemo.com/v1/index.html',
  prod: 'https://www.saucedemo.com/v1/index.html'
};

export const getEnvironmentUrl = (env: string = 'dev'): string => {
  return environments[env as keyof typeof environments] || environments.dev;
};
