import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mobileAuthService, AuthUser, AuthResult } from '@/src/services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuthState();

    // Listen for auth state changes
    const { data: authListener } = mobileAuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await mobileAuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth state check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await mobileAuthService.signIn(email, password);
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { firstName: string; lastName: string }
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await mobileAuthService.signUp(email, password, userData);
      if (result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await mobileAuthService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>): Promise<AuthResult> => {
    const result = await mobileAuthService.updateProfile(updates);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    return await mobileAuthService.resetPassword(email);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}