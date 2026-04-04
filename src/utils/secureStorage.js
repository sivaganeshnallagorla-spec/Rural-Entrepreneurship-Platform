export const secureStorage = {
  /**
   * Encodes a value to Base64 and saves it to localStorage.
   * @param {string} key
   * @param {any} value
   */
  set: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      const encoded = btoa(unescape(encodeURIComponent(stringValue)));
      localStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Error saving to secure storage', error);
    }
  },

  /**
   * Retrieves and decodes a value from localStorage.
   * @param {string} key
   * @returns {any|null}
   */
  get: (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const decoded = decodeURIComponent(escape(atob(raw)));
      return JSON.parse(decoded);
    } catch (error) {
      // If retrieval fails (e.g., data is not Base64 or corrupted), return null
      return null;
    }
  },

  /**
   * Removes a key from localStorage.
   * @param {string} key
   */
  remove: (key) => localStorage.removeItem(key),

  /**
   * Clears all localStorage.
   */
  clear: () => localStorage.clear()
};
