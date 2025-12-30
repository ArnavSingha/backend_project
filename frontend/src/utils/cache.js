/**
 * Frontend Cache Utility
 * 
 * Client-side caching for API responses and computed data.
 * Uses sessionStorage for persistence across page navigations.
 */

class ClientCache {
  constructor(defaultTTL = 300) {
    this.prefix = 'userms_cache_';
    this.defaultTTL = defaultTTL * 1000; // Convert to milliseconds
  }

  /**
   * Generate a cache key
   * @param {string} key - Base key
   * @returns {string} Prefixed cache key
   */
  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key) {
    try {
      const item = sessionStorage.getItem(this._getKey(key));
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (Date.now() > parsed.expiry) {
        this.delete(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   */
  set(key, value, ttl = null) {
    try {
      const expiry = Date.now() + (ttl ? ttl * 1000 : this.defaultTTL);
      const item = JSON.stringify({ value, expiry });
      sessionStorage.setItem(this._getKey(key), item);
    } catch (error) {
      console.error('Cache set error:', error);
      // If storage is full, clear old entries
      if (error.name === 'QuotaExceededError') {
        this.clear();
      }
    }
  }

  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    sessionStorage.removeItem(this._getKey(key));
  }

  /**
   * Invalidate all cache entries matching a prefix
   * @param {string} prefix - Prefix to match
   */
  invalidateByPrefix(prefix) {
    const fullPrefix = this._getKey(prefix);
    const keysToRemove = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(fullPrefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }

  /**
   * Clear all cache entries
   */
  clear() {
    const keysToRemove = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }

  /**
   * Get or fetch data with caching
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Async function to fetch data if not cached
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<any>} Cached or fetched data
   */
  async getOrFetch(key, fetchFn, ttl = null) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }
}

// Create singleton instance
const clientCache = new ClientCache(300); // 5 minutes default TTL

export default clientCache;
