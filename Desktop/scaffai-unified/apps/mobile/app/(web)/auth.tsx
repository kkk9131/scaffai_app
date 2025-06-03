import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View className="flex-1 items-center justify-center bg-background-dark">
      <View className="w-full max-w-md bg-background-paper p-8 rounded-lg">
        <Text className="text-2xl font-bold text-white mb-6">
          {isLogin ? 'ログイン' : '新規登録'}
        </Text>

        <View className="space-y-4">
          <TextInput
            placeholder="メールアドレス"
            className="bg-background-card text-white px-4 py-3 rounded-lg"
            placeholderTextColor="#9CA3AF"
          />
          
          <TextInput
            placeholder="パスワード"
            secureTextEntry
            className="bg-background-card text-white px-4 py-3 rounded-lg"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity className="bg-primary-main py-3 rounded-lg">
            <Text className="text-white text-center font-medium">
              {isLogin ? 'ログイン' : '登録'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text className="text-primary-light text-center">
              {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}