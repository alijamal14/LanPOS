import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { useYjsArray } from '../hooks/useYjs';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const users = useYjsArray<User>('users');

  useEffect(() => {
    // This simulates re-hydrating auth state from a secure local store
    // or a peer-to-peer auth mechanism. For this demo, we use localStorage.
    const storedUserId = localStorage.getItem('lan-pos-userId');
    if (storedUserId && users.length > 0) {
      const foundUser = users.find(u => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
        setRole(foundUser.role);
      }
    }
  }, [users]);

  const login = useCallback((userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setRole(foundUser.role);
      localStorage.setItem('lan-pos-userId', foundUser.id);
      console.log(`User ${foundUser.name} logged in with role ${foundUser.role}.`);
    } else {
      console.error('Login failed: User not found.');
    }
  }, [users]);

  const logout = useCallback(() => {
    console.log(`User ${user?.name} logged out.`);
    setUser(null);
    setRole(null);
    localStorage.removeItem('lan-pos-userId');
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
