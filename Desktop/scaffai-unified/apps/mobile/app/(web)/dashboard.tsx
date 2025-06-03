import React from 'react';
import { View, Text } from 'react-native';
import { ja } from '@/constants/translations';

export default function DashboardScreen() {
  return (
    <View className="h-full">
      <Text className="text-2xl font-bold text-white mb-6">
        {ja.web.menu.dashboard}
      </Text>
      
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ダッシュボードの内容はこれから実装 */}
      </View>
    </View>
  );
}