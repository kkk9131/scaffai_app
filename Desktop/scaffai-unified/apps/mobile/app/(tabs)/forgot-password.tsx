import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '@/components/InputField';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendReset = async () => {
    // Reset errors
    setEmailError(null);

    // Validate email
    if (!email.trim()) {
      setEmailError('メールアドレスを入力してください');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await resetPassword(email);
      
      if (result.error) {
        Alert.alert('エラー', result.error);
      } else {
        setEmailSent(true);
      }
    } catch (error: any) {
      Alert.alert(
        'エラー',
        error.message || 'パスワードリセットメールの送信に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth');
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    handleSendReset();
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.successLogo}>
                <Ionicons name="mail" size={32} color={colors.secondary.main} />
              </View>
              <Text style={styles.successTitle}>メール送信完了</Text>
            </View>
            
            <Text style={styles.successMessage}>
              パスワードリセットのご案内を{'\n'}
              <Text style={styles.emailText}>{email}</Text>{'\n'}
              に送信しました。
            </Text>
            
            <Text style={styles.instructionText}>
              メール内のリンクをクリックして、{'\n'}
              新しいパスワードを設定してください。
            </Text>
          </View>

          <View style={styles.actionContainer}>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color={colors.primary.light} />
              <Text style={styles.infoText}>
                メールが届かない場合は、迷惑メールフォルダをご確認ください。
              </Text>
            </View>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendEmail}
            >
              <Ionicons name="refresh" size={20} color={colors.primary.main} />
              <Text style={styles.resendButtonText}>
                メールを再送信
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backButtonText}>
                ログイン画面に戻る
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerBackButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="key" size={32} color={colors.primary.main} />
              </View>
              <Text style={styles.logoText}>パスワード再設定</Text>
            </View>
            
            <Text style={styles.subtitle}>
              アカウントに登録されているメールアドレスを入力してください。{'\n'}
              パスワード再設定のご案内をお送りします。
            </Text>
          </View>

          <View style={styles.formContainer}>
            <InputField
              label="メールアドレス"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError(null);
              }}
              placeholder="example@email.com"
              keyboardType="email-address"
              error={emailError}
            />

            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              onPress={handleSendReset}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="sync" size={20} color="white" />
                  <Text style={styles.sendButtonText}>送信中...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="mail-outline" size={20} color="white" />
                  <Text style={styles.sendButtonText}>
                    リセットメールを送信
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.helpContainer}>
              <View style={styles.helpItem}>
                <Ionicons name="shield-checkmark" size={16} color={colors.secondary.main} />
                <Text style={styles.helpText}>
                  セキュリティのため、登録済みのメールアドレスにのみ送信されます
                </Text>
              </View>
              
              <View style={styles.helpItem}>
                <Ionicons name="time" size={16} color={colors.secondary.main} />
                <Text style={styles.helpText}>
                  リセットリンクの有効期限は24時間です
                </Text>
              </View>
            </View>

            <View style={styles.backToLoginContainer}>
              <Text style={styles.backToLoginText}>パスワードを思い出しましたか？</Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.backToLoginLink}>ログイン</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
  },
  headerBackButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: colors.background.paper,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successLogo: {
    width: 64,
    height: 64,
    backgroundColor: colors.background.paper,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.secondary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  successMessage: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  emailText: {
    color: colors.primary.light,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.text.disabled,
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  helpContainer: {
    marginBottom: 32,
    gap: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  helpText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.background.paper,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background.paper,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  resendButtonText: {
    color: colors.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 16,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  backToLoginText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  backToLoginLink: {
    fontSize: 14,
    color: colors.primary.light,
    fontWeight: '600',
  },
});