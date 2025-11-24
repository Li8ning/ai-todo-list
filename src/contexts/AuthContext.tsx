import React, { useState } from 'react';
import type { User, AuthState } from '../types/auth';
import { authStorage } from '../services/authStorage';
import { activityStorage } from '../services/activityStorage';
import { AuthContext, type AuthContextType } from './AuthContextValue';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize auth state from localStorage
    const currentUser = authStorage.getCurrentUser();
    return {
      user: currentUser,
      isAuthenticated: !!currentUser,
      isLoading: false,
    };
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = authStorage.findUserByEmail(email);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (!authStorage.validatePassword(email, password)) {
        return { success: false, error: 'Invalid password' };
      }

      authStorage.setCurrentUser(user.id);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Log login activity
      activityStorage.addActivity({
        id: crypto.randomUUID(),
        userId: user.id,
        type: 'login',
        description: 'Logged in',
        timestamp: new Date()
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const existingUser = authStorage.findUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        createdAt: new Date(),
      };

      authStorage.addUser(newUser);
      authStorage.setPassword(email, password);
      authStorage.setCurrentUser(newUser.id);

      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    const currentUser = authState.user;
    authStorage.setCurrentUser(null);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Log logout activity
    if (currentUser) {
      activityStorage.addActivity({
        id: crypto.randomUUID(),
        userId: currentUser.id,
        type: 'logout',
        description: 'Logged out',
        timestamp: new Date()
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
