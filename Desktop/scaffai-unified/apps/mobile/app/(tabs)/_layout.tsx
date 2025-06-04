import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Calculator, Clipboard as ClipboardEdit, User, Settings, UserPlus, Lock, Key } from 'lucide-react-native';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { ja } from '@/constants/translations';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary.light,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: ja.tabs.home,
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="input"
        options={{
          title: ja.tabs.input,
          tabBarIcon: ({ color, size }) => (
            <Calculator color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          title: ja.tabs.result,
          tabBarIcon: ({ color, size }) => (
            <ClipboardEdit color={color} size={size} />
          ),
        }}
      />
      
      {/* Authentication Screens - Hidden from tab bar */}
      <Tabs.Screen
        name="auth"
        options={{
          href: null, // Hide from tab bar
          title: "認証",
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null, // Hide from tab bar
          title: "新規登録",
        }}
      />
      <Tabs.Screen
        name="forgot-password"
        options={{
          href: null, // Hide from tab bar
          title: "パスワードリセット",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
          title: "プロフィール",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Hide from tab bar
          title: "設定",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.dark,
    borderTopColor: colors.divider,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});