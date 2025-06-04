import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoBackup: boolean;
  biometricAuth: boolean;
  analytics: boolean;
  crashReports: boolean;
  language: string;
  fontSize: string;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: true,
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    autoBackup: true,
    biometricAuth: false,
    analytics: true,
    crashReports: true,
    language: 'ja',
    fontSize: 'medium',
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateSetting = async (key: keyof SettingsState, value: boolean | string) => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual settings update logic
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock API call
      
      setSettings(prev => ({ ...prev, [key]: value }));
      
      // Show success feedback for important settings
      if (key === 'biometricAuth' || key === 'autoBackup') {
        Alert.alert('設定完了', `${key === 'biometricAuth' ? '生体認証' : '自動バックアップ'}の設定が更新されました`);
      }
    } catch (error) {
      Alert.alert('エラー', '設定の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = () => {
    Alert.alert(
      '言語設定',
      '言語を選択してください',
      [
        { text: '日本語', onPress: () => updateSetting('language', 'ja') },
        { text: 'English', onPress: () => updateSetting('language', 'en') },
        { text: 'キャンセル', style: 'cancel' },
      ]
    );
  };

  const handleFontSizeChange = () => {
    Alert.alert(
      'フォントサイズ',
      'フォントサイズを選択してください',
      [
        { text: '小', onPress: () => updateSetting('fontSize', 'small') },
        { text: '中', onPress: () => updateSetting('fontSize', 'medium') },
        { text: '大', onPress: () => updateSetting('fontSize', 'large') },
        { text: 'キャンセル', style: 'cancel' },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'キャッシュクリア',
      'アプリのキャッシュをクリアしますか？一時的にアプリの動作が遅くなる場合があります。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'クリア', 
          onPress: async () => {
            setIsLoading(true);
            // TODO: Implement actual cache clearing logic
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsLoading(false);
            Alert.alert('完了', 'キャッシュをクリアしました');
          }
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      '設定リセット',
      'すべての設定を初期値に戻しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'リセット', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              darkMode: true,
              notifications: true,
              emailNotifications: true,
              pushNotifications: true,
              autoBackup: true,
              biometricAuth: false,
              analytics: true,
              crashReports: true,
              language: 'ja',
              fontSize: 'medium',
            });
            Alert.alert('完了', '設定をリセットしました');
          }
        },
      ]
    );
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'ja': return '日本語';
      case 'en': return 'English';
      default: return '日本語';
    }
  };

  const getFontSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return '小';
      case 'medium': return '中';
      case 'large': return '大';
      default: return '中';
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch',
    onPress 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean | string;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button' | 'info';
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={type === 'button' ? onPress : undefined}
      disabled={type === 'switch' || type === 'info'}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color={colors.primary.main} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {type === 'switch' && onValueChange && (
          <Switch
            value={value as boolean}
            onValueChange={onValueChange}
            trackColor={{
              false: colors.background.card,
              true: colors.primary.main,
            }}
            thumbColor={colors.text.primary}
            disabled={isLoading}
          />
        )}
        {type === 'button' && (
          <View style={styles.buttonValue}>
            <Text style={styles.buttonValueText}>{value as string}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
          </View>
        )}
        {type === 'info' && (
          <Ionicons name="information-circle" size={20} color={colors.text.disabled} />
        )}
      </View>
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>設定</Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Appearance */}
        <Section title="外観">
          <SettingItem
            icon="moon"
            title="ダークモード"
            subtitle="暗いテーマを使用します"
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="text"
            title="フォントサイズ"
            subtitle="アプリ内のテキストサイズを変更します"
            value={getFontSizeLabel(settings.fontSize)}
            type="button"
            onPress={handleFontSizeChange}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="language"
            title="言語"
            subtitle="アプリの表示言語を変更します"
            value={getLanguageLabel(settings.language)}
            type="button"
            onPress={handleLanguageChange}
          />
        </Section>

        {/* Notifications */}
        <Section title="通知">
          <SettingItem
            icon="notifications"
            title="通知を有効にする"
            subtitle="アプリからの通知を受信します"
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="mail"
            title="メール通知"
            subtitle="重要な更新をメールで受信します"
            value={settings.emailNotifications}
            onValueChange={(value) => updateSetting('emailNotifications', value)}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="phone-portrait"
            title="プッシュ通知"
            subtitle="リアルタイムの通知を受信します"
            value={settings.pushNotifications}
            onValueChange={(value) => updateSetting('pushNotifications', value)}
          />
        </Section>

        {/* Security */}
        <Section title="セキュリティ">
          <SettingItem
            icon="finger-print"
            title="生体認証"
            subtitle="指紋やFace IDでアプリにアクセス"
            value={settings.biometricAuth}
            onValueChange={(value) => updateSetting('biometricAuth', value)}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="cloud-upload"
            title="自動バックアップ"
            subtitle="データを自動的にクラウドに保存します"
            value={settings.autoBackup}
            onValueChange={(value) => updateSetting('autoBackup', value)}
          />
        </Section>

        {/* Privacy */}
        <Section title="プライバシー">
          <SettingItem
            icon="analytics"
            title="使用状況分析"
            subtitle="アプリの改善のために匿名データを送信"
            value={settings.analytics}
            onValueChange={(value) => updateSetting('analytics', value)}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="bug"
            title="クラッシュレポート"
            subtitle="アプリのクラッシュ情報を開発者に送信"
            value={settings.crashReports}
            onValueChange={(value) => updateSetting('crashReports', value)}
          />
        </Section>

        {/* Storage & Data */}
        <Section title="ストレージとデータ">
          <SettingItem
            icon="trash"
            title="キャッシュクリア"
            subtitle="一時ファイルを削除してストレージを解放"
            type="button"
            onPress={handleClearCache}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="refresh"
            title="設定をリセット"
            subtitle="すべての設定を初期値に戻します"
            type="button"
            onPress={handleResetSettings}
          />
        </Section>

        {/* About */}
        <Section title="アプリについて">
          <SettingItem
            icon="information-circle"
            title="バージョン"
            subtitle="1.0.0 (ビルド 100)"
            type="info"
          />
          <View style={styles.divider} />
          <SettingItem
            icon="document-text"
            title="利用規約"
            type="button"
            onPress={() => Alert.alert('実装中', '利用規約ページは準備中です')}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="shield"
            title="プライバシーポリシー"
            type="button"
            onPress={() => Alert.alert('実装中', 'プライバシーポリシーページは準備中です')}
          />
        </Section>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={24} color={colors.primary.main} />
              <Text style={styles.loadingText}>設定を更新中...</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.background.paper,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.primary.main}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  settingRight: {
    marginLeft: 12,
  },
  buttonValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonValueText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 60,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: colors.background.paper,
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});