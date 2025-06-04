import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/constants/colors';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/auth' }: AuthGuardProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth screen if not authenticated
      router.replace(redirectTo);
    }
  }, [user, loading, redirectTo]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="sync" size={32} color={colors.primary.main} />
        <Text style={styles.loadingText}>認証状態を確認中...</Text>
      </View>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.dark,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});