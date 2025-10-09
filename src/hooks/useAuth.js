import { useState, useEffect } from 'react';
import { isAuthenticated, getUserData, logout } from '../services/authService';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(getUserData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
      setCurrentUser(getUserData());
    };
    checkAuth();
  }, []);

  const handleLogin = async (userData) => {
    setLoading(true);
    try {
      setAuthenticated(true);
      setCurrentUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setCurrentUser(null);
  };

  return {
    authenticated,
    currentUser,
    loading,
    handleLogin,
    handleLogout,
  };
};
