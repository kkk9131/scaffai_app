import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  return (
    <View className="h-full">
      <Text className="text-2xl font-bold text-white mb-6">設定</Text>

      <View className="bg-background-paper rounded-lg p-6">
        <View className="space-y-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-lg">ダークモード</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{
                false: colors.background.card,
                true: colors.primary.main,
              }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-white text-lg">通知</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{
                false: colors.background.card,
                true: colors.primary.main,
              }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>
      </View>
    </View>
  );
}