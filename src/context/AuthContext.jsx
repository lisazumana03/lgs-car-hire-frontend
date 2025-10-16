import { createContext, useState, useEffect, useContext } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = storage.get(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
                           sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser && storedToken) {
          setUser(storedUser);
          setAuthToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * Login user
   * @param {object} userData - User data from login response
   * @param {string} token - Auth token
   * @param {boolean} rememberMe - Whether to persist login
   */
  const login = (userData, token, rememberMe = false) => {
    setUser(userData);
    setAuthToken(token);
    setIsAuthenticated(true);

    const storageType = rememberMe ? localStorage : sessionStorage;

    storage.set(STORAGE_KEYS.USER, userData);
    storageType.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);

    storage.remove(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  };

  /**
   * Update user data
   * @param {object} updatedUserData - Updated user data
   */
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    storage.set(STORAGE_KEYS.USER, newUserData);
  };

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.some(role => user?.role === role);
  };

  const value = {
    user,
    authToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
