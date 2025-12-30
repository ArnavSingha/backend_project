import axios from 'axios';
import clientCache from '../utils/cache';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and caching
API.interceptors.response.use(
  (response) => {
    // Log cache status from backend
    const cacheStatus = response.headers['x-cache'];
    if (cacheStatus) {
      console.debug(`Cache ${cacheStatus}: ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear cache on logout
      clientCache.clear();
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Cached GET request
 * @param {string} url - API endpoint
 * @param {object} config - Axios config
 * @param {number} ttl - Cache TTL in seconds (default: 120)
 * @returns {Promise} API response
 */
export const cachedGet = async (url, config = {}, ttl = 120) => {
  const cacheKey = `api:${url}:${JSON.stringify(config.params || {})}`;
  
  return clientCache.getOrFetch(
    cacheKey,
    async () => {
      const response = await API.get(url, config);
      return response.data;
    },
    ttl
  );
};

/**
 * Invalidate cache for specific API endpoints
 * @param {string} prefix - URL prefix to invalidate
 */
export const invalidateApiCache = (prefix) => {
  clientCache.invalidateByPrefix(`api:${prefix}`);
};

export { clientCache };
export default API;
