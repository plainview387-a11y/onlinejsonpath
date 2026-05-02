'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, startTransition, useCallback } from 'react';
import { authFetch, clearStoredAuth, readStoredUser } from '@/lib/auth-client';

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  createdAt: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  }, []);

  useEffect(() => {
    let mounted = true;

    const restoreAndVerify = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = readStoredUser();

      if (!savedToken || !savedUser) {
        if (mounted) setIsLoading(false);
        return;
      }

      startTransition(() => {
        setToken(savedToken);
        setUser(savedUser);
      });

      try {
        const response = await authFetch('/api/auth/verify');
        if (!response.ok) {
          if (mounted) logout();
          return;
        }

        const data = await response.json();
        if (mounted && data?.success && data?.user) {
          const verifiedUser = {
            id: data.user.userId,
            email: data.user.email,
            nickname: data.user.nickname || savedUser.nickname,
            avatar: data.user.avatar || savedUser.avatar,
            createdAt: data.user.createdAt || savedUser.createdAt || new Date().toISOString(),
            isAdmin: !!data.user.isAdmin,
          };
          localStorage.setItem('user', JSON.stringify(verifiedUser));
          startTransition(() => {
            setToken(savedToken);
            setUser(verifiedUser);
          });
        }
      } catch {
        if (mounted) logout();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    restoreAndVerify();

    const handleAuthExpired = () => logout();
    window.addEventListener('auth:expired', handleAuthExpired as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('auth:expired', handleAuthExpired as EventListener);
    };
  }, [logout]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
