import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { showNotification } = useNotification();

  // Auto-login on refresh - check localStorage for existing session
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      const response = await API.post('/auth/login', { email, password });
      
      const { token: newToken, ...userData } = response.data;
      
      // Store in state
      setToken(newToken);
      setUser(userData);
      
      // Persist to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      showNotification('Login Successful! Welcome back.', 'success');
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      showNotification(errorMessage, 'error');
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Register function
  const register = useCallback(async (fullName, email, password) => {
    try {
      setLoading(true);
      
      const response = await API.post('/auth/signup', { fullName, email, password });
      
      const { token: newToken, ...userData } = response.data;
      
      // Store in state
      setToken(newToken);
      setUser(userData);
      
      // Persist to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      showNotification('Registration Successful! Welcome aboard.', 'success');
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      showNotification(errorMessage, 'error');
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint (optional, since JWT is stateless)
      await API.post('/auth/logout');
    } catch (error) {
      // Ignore error, proceed with client-side logout
    }
    
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    showNotification('You have been logged out.', 'success');
  }, [showNotification]);

  // Get current user from server
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await API.get('/auth/me');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      // Token might be invalid, clear auth
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
