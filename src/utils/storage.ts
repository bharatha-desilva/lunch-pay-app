/**
 * Utility functions for local storage management
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'lunchpay_auth_token',
  REFRESH_TOKEN: 'lunchpay_refresh_token',
  USER_DATA: 'lunchpay_user_data',
} as const;

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  /**
   * Get item from localStorage
   */
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   */
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to set item in localStorage:', error);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove item from localStorage:', error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  },

  /**
   * Get JSON object from localStorage
   */
  getJSON: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to parse JSON from localStorage:', error);
      return null;
    }
  },

  /**
   * Set JSON object in localStorage
   */
  setJSON: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to stringify JSON for localStorage:', error);
    }
  },
};

/**
 * Auth-specific storage operations
 */
export const authStorage = {
  getToken: () => storage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token: string) => storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeToken: () => storage.removeItem(STORAGE_KEYS.AUTH_TOKEN),

  getRefreshToken: () => storage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token: string) =>
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),

  getUserData: () => storage.getJSON(STORAGE_KEYS.USER_DATA),
  setUserData: (userData: unknown) =>
    storage.setJSON(STORAGE_KEYS.USER_DATA, userData),
  removeUserData: () => storage.removeItem(STORAGE_KEYS.USER_DATA),

  clearAll: () => {
    storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    storage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};
