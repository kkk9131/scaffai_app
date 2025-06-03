import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Download } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function DrawingScreen() {
  return (
    <View className="h-full">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-white">図面生成</Text>
        
        <TouchableOpacity className="bg-primary-main px-4 py-2 rounded-lg flex-row items-center">
          <Download size={20} color={colors.text.primary} />
          <Text className="text-white ml-2">ダウンロード</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-background-paper rounded-lg p-6">
        <Text className="text-white text-center">
          図面生成機能は開発中です
        </Text>
      </View>
    </View>
  );
}