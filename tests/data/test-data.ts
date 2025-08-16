export interface UserCredentials {
  username: string;
  password: string;
  userType: 'standard' | 'locked_out' | 'problem' | 'performance' | 'visual';
  description: string;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  imageName: string;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class TestData {
  static readonly USERS: Record<string, UserCredentials> = {
    STANDARD_USER: {
      username: 'standard_user',
      password: 'secret_sauce',
      userType: 'standard',
      description: 'Standard user with full access'
    },
    LOCKED_OUT_USER: {
      username: 'locked_out_user',
      password: 'secret_sauce',
      userType: 'locked_out',
      description: 'User that has been locked out'
    },
    PROBLEM_USER: {
      username: 'problem_user',
      password: 'secret_sauce',
      userType: 'problem',
      description: 'User with problems (images not loading correctly)'
    },
    PERFORMANCE_GLITCH_USER: {
      username: 'performance_glitch_user',
      password: 'secret_sauce',
      userType: 'performance',
      description: 'User with performance issues'
    },
    VISUAL_USER: {
      username: 'visual_user',
      password: 'secret_sauce',
      userType: 'visual',
      description: 'User for visual testing'
    }
  };

  static readonly PRODUCTS: Record<string, ProductData> = {
    SAUCE_LABS_BACKPACK: {
      id: '4',
      name: 'Sauce Labs Backpack',
      description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
      price: '$29.99',
      imageName: 'sauce-backpack-1200x1500.jpg'
    },
    SAUCE_LABS_BIKE_LIGHT: {
      id: '0',
      name: 'Sauce Labs Bike Light',
      description: 'A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.',
      price: '$9.99',
      imageName: 'bike-light-1200x1500.jpg'
    },
    SAUCE_LABS_BOLT_T_SHIRT: {
      id: '1',
      name: 'Sauce Labs Bolt T-Shirt',
      description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
      price: '$15.99',
      imageName: 'bolt-shirt-1200x1500.jpg'
    },
    SAUCE_LABS_FLEECE_JACKET: {
      id: '5',
      name: 'Sauce Labs Fleece Jacket',
      description: 'It\'s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.',
      price: '$49.99',
      imageName: 'sauce-pullover-1200x1500.jpg'
    },
    SAUCE_LABS_ONESIE: {
      id: '2',
      name: 'Sauce Labs Onesie',
      description: 'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won\'t unravel.',
      price: '$7.99',
      imageName: 'red-onesie-1200x1500.jpg'
    },
    TEST_ALL_THE_THINGS_T_SHIRT: {
      id: '3',
      name: 'Test.allTheThings() T-Shirt (Red)',
      description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton blend slim fit you\'ll want to wear every day.',
      price: '$15.99',
      imageName: 'red-tatt-1200x1500.jpg'
    }
  };

  static readonly CHECKOUT_INFO: CheckoutData = {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  };

  static readonly INVALID_CREDENTIALS = {
    username: 'invalid_user',
    password: 'invalid_password'
  };

  static readonly EMPTY_CREDENTIALS = {
    username: '',
    password: ''
  };

  static readonly ERROR_MESSAGES = {
    LOCKED_OUT_USER: 'Epic sadface: Sorry, this user has been locked out.',
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    EMPTY_USERNAME: 'Epic sadface: Username is required',
    EMPTY_PASSWORD: 'Epic sadface: Password is required',
    FIRST_NAME_REQUIRED: 'Error: First Name is required',
    LAST_NAME_REQUIRED: 'Error: Last Name is required',
    POSTAL_CODE_REQUIRED: 'Error: Postal Code is required'
  };

  static readonly URLS = {
    LOGIN: 'https://www.saucedemo.com/v1/index.html',
    INVENTORY: 'https://www.saucedemo.com/v1/inventory.html',
    CART: 'https://www.saucedemo.com/v1/cart.html',
    CHECKOUT_STEP_ONE: 'https://www.saucedemo.com/v1/checkout-step-one.html',
    CHECKOUT_STEP_TWO: 'https://www.saucedemo.com/v1/checkout-step-two.html',
    CHECKOUT_COMPLETE: 'https://www.saucedemo.com/v1/checkout-complete.html'
  };

  static readonly TIMEOUTS = {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000
  };

  /**
   * Get user credentials by type
   */
  static getUserByType(userType: 'standard' | 'locked_out' | 'problem' | 'performance' | 'visual'): UserCredentials {
    const user = Object.values(this.USERS).find(u => u.userType === userType);
    if (!user) {
      throw new Error(`User type '${userType}' not found`);
    }
    return user;
  }

  /**
   * Get random product
   */
  static getRandomProduct(): ProductData {
    const products = Object.values(this.PRODUCTS);
    return products[Math.floor(Math.random() * products.length)];
  }

  /**
   * Get multiple random products
   */
  static getRandomProducts(count: number): ProductData[] {
    const products = Object.values(this.PRODUCTS);
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, products.length));
  }

  /**
   * Get product by name
   */
  static getProductByName(name: string): ProductData | undefined {
    return Object.values(this.PRODUCTS).find(p => p.name === name);
  }

  /**
   * Get all available users
   */
  static getAllUsers(): UserCredentials[] {
    return Object.values(this.USERS);
  }

  /**
   * Get all available products
   */
  static getAllProducts(): ProductData[] {
    return Object.values(this.PRODUCTS);
  }
}
