import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'ScaffAI',
  slug: 'scaffai',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'scaffai',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0F172A'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.scaffai.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#0F172A'
    },
    package: 'com.scaffai.app'
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    'expo-font'
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true
  }
});