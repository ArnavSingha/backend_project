/**
 * Cache Middleware
 * 
 * Express middleware for caching API responses.
 * Uses the in-memory cache utility.
 */

const cache = require('../utils/cache');

/**
 * Cache middleware factory
 * @param {string} prefix - Cache key prefix
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (prefix, ttl = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from request
    const params = {
      ...req.params,
      ...req.query,
      userId: req.user?._id?.toString() || 'anonymous'
    };
    const cacheKey = cache.generateKey(prefix, params);

    // Check if response is cached
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      // Add cache header
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache the response
    res.json = (data) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, data, ttl);
      }
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalidate cache for a specific prefix
 * @param {string} prefix - Cache key prefix to invalidate
 * @returns {Function} Express middleware
 */
const invalidateCache = (prefix) => {
  return (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to invalidate cache after successful mutation
    res.json = (data) => {
      // Invalidate cache on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.invalidateByPrefix(prefix);
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear all cache entries
 * @returns {Function} Express middleware
 */
const clearAllCache = () => {
  return (req, res, next) => {
    cache.clear();
    next();
  };
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  clearAllCache,
  cache
};
