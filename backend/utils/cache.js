/**
 * In-Memory Cache Utility
 * 
 * A simple caching mechanism for API responses and computation results.
 * For production, consider using Redis for distributed caching.
 */

class Cache {
  constructor(defaultTTL = 300) {
    // defaultTTL in seconds (5 minutes default)
    this.cache = new Map();
    this.defaultTTL = defaultTTL * 1000; // Convert to milliseconds
  }

  /**
   * Generate a cache key from request parameters
   * @param {string} prefix - Cache key prefix (e.g., 'users', 'user')
   * @param {object} params - Parameters to include in key
   * @returns {string} Cache key
   */
  generateKey(prefix, params = {}) {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    return `${prefix}:${paramString || 'all'}`;
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   */
  set(key, value, ttl = null) {
    const expiry = Date.now() + (ttl ? ttl * 1000 : this.defaultTTL);
    this.cache.set(key, { value, expiry });
  }

  /**
   * Delete a specific key from cache
   * @param {string} key - Cache key to delete
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a prefix
   * @param {string} prefix - Prefix to match
   */
  invalidateByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getStats() {
    let validEntries = 0;
    let expiredEntries = 0;
    const now = Date.now();

    for (const [, item] of this.cache) {
      if (now > item.expiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
const cache = new Cache(300); // 5 minutes default TTL

// Periodic cleanup every 10 minutes
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);

module.exports = cache;
