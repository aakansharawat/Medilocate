import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getAuthToken, removeAuthToken, authAPI, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (error) {
          // Token is invalid or expired
          removeAuthToken();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);

  const login = (newToken: string, userData: User) => {
    setAuthToken(newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user, // Base authentication on user object existence
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 