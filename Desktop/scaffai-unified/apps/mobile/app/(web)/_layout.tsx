import { Platform } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { WebLayout as Layout } from '@/components/web/Layout';

export default function WebRootLayout() {
  // モバイルの場合はタブレイアウトにリダイレクト
  if (Platform.OS !== 'web') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Layout>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="input" />
        <Stack.Screen name="result" />
        <Stack.Screen name="drawing" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="auth" />
      </Stack>
    </Layout>
  );
}