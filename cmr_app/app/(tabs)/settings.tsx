import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { ChevronRight, HelpCircle, Info, Key, Lock } from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, toggleTheme, isDark } = useTheme();
  const [saveOriginalPhotos, setSaveOriginalPhotos] = useState(true);
  const [highQualityProcessing, setHighQualityProcessing] = useState(false);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>設定</Text>
        </View>
        
        <ScrollView>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>アプリ設定</Text>
            
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>ダークモード</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={isDark ? colors.accent : '#f4f3f4'}
              />
            </View>
            
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>オリジナル写真を保存</Text>
              <Switch
                value={saveOriginalPhotos}
                onValueChange={setSaveOriginalPhotos}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={saveOriginalPhotos ? colors.accent : '#f4f3f4'}
              />
            </View>
            
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>高品質処理</Text>
              <Switch
                value={highQualityProcessing}
                onValueChange={setHighQualityProcessing}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={highQualityProcessing ? colors.accent : '#f4f3f4'}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>API設定</Text>
            
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingWithIcon}>
                <Key size={22} color={colors.accent} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>APIキー設定</Text>
              </View>
              <ChevronRight size={20} color={colors.secondaryText} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingWithIcon}>
                <Lock size={22} color={colors.accent} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>プライバシー設定</Text>
              </View>
              <ChevronRight size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>サポート</Text>
            
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
              onPress={() => Linking.openURL('https://example.com/help')}
            >
              <View style={styles.settingWithIcon}>
                <HelpCircle size={22} color={colors.accent} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>ヘルプ</Text>
              </View>
              <ChevronRight size={20} color={colors.secondaryText} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
              onPress={() => Linking.openURL('https://example.com/about')}
            >
              <View style={styles.settingWithIcon}>
                <Info size={22} color={colors.accent} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>アプリについて</Text>
              </View>
              <ChevronRight size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.versionText}>バージョン 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 22,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 16,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: '#8e8e93',
    marginTop: 30,
    marginBottom: 20,
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 14,
  },
});