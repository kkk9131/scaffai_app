import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Home, Calculator, ClipboardList, 
  PenTool, Settings, LogOut 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ja } from '@/constants/translations';

const menuItems = [
  { icon: Home, label: ja.web.menu.dashboard, path: '/dashboard' },
  { icon: Calculator, label: ja.web.menu.input, path: '/input' },
  { icon: ClipboardList, label: ja.web.menu.result, path: '/result' },
  { icon: PenTool, label: ja.web.menu.drawing, path: '/drawing' },
  { icon: Settings, label: ja.web.menu.settings, path: '/settings' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="w-64 bg-background-paper border-r border-background-card">
      <View className="p-6">
        <Text className="text-2xl font-bold text-white">{ja.appName}</Text>
      </View>

      <View className="flex-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path)}
              className={`flex-row items-center space-x-3 px-4 py-3 rounded-lg mb-1
                ${isActive ? 'bg-primary-main' : 'hover:bg-background-card'}`}
            >
              <Icon 
                size={20} 
                color={isActive ? colors.text.primary : colors.text.secondary} 
              />
              <Text 
                className={`text-base
                  ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        className="m-6 flex-row items-center space-x-3 px-4 py-3 rounded-lg
          bg-background-card hover:bg-background-dark"
      >
        <LogOut size={20} color={colors.text.secondary} />
        <Text className="text-base text-gray-400">{ja.web.menu.logout}</Text>
      </TouchableOpacity>
    </View>
  );
}