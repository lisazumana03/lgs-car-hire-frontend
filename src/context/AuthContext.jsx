import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save authentication data
  const saveAuth = (authData) => {
    const { token, user, tokenType } = authData;
    
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenType', tokenType || 'Bearer');
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('user', JSON.stringify(user)); // Keep for compatibility
  };

  // Clear authentication data
  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  // Login
  const login = async (authData) => {
    try {
      saveAuth(authData);
      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = () => {
    clearAuth();
  };

  // Role checks
  const isAdmin = () => user?.role === 'ADMIN';
  const isCustomer = () => user?.role === 'CUSTOMER';
  const isCarOwner = () => user?.role === 'CAR_OWNER';

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    saveAuth,
    clearAuth,
    isAuthenticated: !!token,
    isAdmin,
    isCustomer,
    isCarOwner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

