
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type UserType = {
  id: string;
  username: string;
  role: 'user' | 'admin';
} | null;

interface AuthContextType {
  user: UserType;
  login: (username: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('alhajnet_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    // In a real application, you would validate credentials with a backend
    // This is a mock implementation for demonstration
    if (role === 'admin' && username === 'admin' && password === 'admin123') {
      const adminUser = { id: '1', username: 'admin', role: 'admin' as const };
      setUser(adminUser);
      localStorage.setItem('alhajnet_user', JSON.stringify(adminUser));
      return true;
    } else if (role === 'user' && username && password) {
      // Simple mock validation for regular users - would connect to backend in real app
      const regularUser = { id: '2', username, role: 'user' as const };
      setUser(regularUser);
      localStorage.setItem('alhajnet_user', JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alhajnet_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
