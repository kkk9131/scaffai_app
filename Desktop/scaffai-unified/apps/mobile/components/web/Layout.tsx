import React from 'react';
import { View } from 'react-native';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

type WebLayoutProps = {
  children: React.ReactNode;
};

export function WebLayout({ children }: WebLayoutProps) {
  return (
    <View className="flex h-screen bg-background-dark">
      <Sidebar />
      <View className="flex flex-col flex-1">
        <Header />
        <View className="flex-1 p-6">
          {children}
        </View>
      </View>
    </View>
  );
}