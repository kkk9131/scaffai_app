import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Settings, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export function Header() {
  const router = useRouter();

  return (
    <View className="h-16 bg-background-paper border-b border-background-card px-6 flex-row items-center justify-between">
      <Text className="text-white text-xl font-bold">ScaffAI</Text>
      
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity>
          <Bell size={20} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings size={20} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/auth')}>
          <User size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}