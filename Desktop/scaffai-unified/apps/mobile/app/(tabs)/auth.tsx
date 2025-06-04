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

export default function AuthScreen() {
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setFirstNameError(null);
    setLastNameError(null);

    // Email validation
    if (!email) {
      setEmailError('メールアドレスを入力してください');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('パスワードを入力してください');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('パスワードは6文字以上で入力してください');
      isValid = false;
    }

    // Registration specific validation
    if (!isLogin) {
      if (!firstName.trim()) {
        setFirstNameError('姓を入力してください');
        isValid = false;
      }
      
      if (!lastName.trim()) {
        setLastNameError('名を入力してください');
        isValid = false;
      }
      
      if (!confirmPassword) {
        setConfirmPasswordError('パスワード確認を入力してください');
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError('パスワードが一致しません');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      let result;
      
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, { firstName, lastName });
      }
      
      if (result.error) {
        Alert.alert('エラー', result.error);
      } else {
        Alert.alert(
          '成功',
          isLogin ? 'ログインしました' : 'アカウントを作成しました',
          [{ text: 'OK', onPress: () => router.push('/') }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'エラー',
        error.message || (isLogin ? 'ログインに失敗しました' : 'アカウント作成に失敗しました')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setFirstNameError(null);
    setLastNameError(null);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

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
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="construct" size={32} color={colors.primary.main} />
              </View>
              <Text style={styles.logoText}>ScaffAI</Text>
            </View>
            
            <Text style={styles.title}>
              {isLogin ? 'おかえりなさい' : 'アカウント作成'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'アカウントにログインしてください' 
                : '新しいアカウントを作成しましょう'
              }
            </Text>
          </View>

          <View style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.nameContainer}>
                <View style={styles.nameField}>
                  <InputField
                    label="姓"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="田中"
                    error={firstNameError}
                  />
                </View>
                <View style={styles.nameField}>
                  <InputField
                    label="名"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="太郎"
                    error={lastNameError}
                  />
                </View>
              </View>
            )}
            
            <InputField
              label="メールアドレス"
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
              error={emailError}
            />
            
            <View style={styles.passwordContainer}>
              <InputField
                label="パスワード"
                value={password}
                onChangeText={setPassword}
                placeholder="パスワードを入力"
                error={passwordError}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.text.secondary} 
                />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <InputField
                label="パスワード確認"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="パスワードを再入力"
                error={confirmPasswordError}
              />
            )}

            {isLogin && (
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => router.push('/forgot-password')}
              >
                <Text style={styles.forgotPasswordText}>
                  パスワードをお忘れですか？
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.authButton, (isLoading || loading) && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={isLoading || loading}
            >
              {(isLoading || loading) ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="sync" size={20} color="white" />
                  <Text style={styles.authButtonText}>処理中...</Text>
                </View>
              ) : (
                <Text style={styles.authButtonText}>
                  {isLogin ? 'ログイン' : 'アカウント作成'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
              <Text style={styles.switchModeText}>
                {isLogin ? 'アカウントをお持ちでない方は' : '既にアカウントをお持ちの方は'}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.switchModeLink}>
                  {isLogin ? '新規登録' : 'ログイン'}
                </Text>
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
    alignItems: 'center',
    marginBottom: 40,
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
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  nameField: {
    flex: 1,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 45,
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary.light,
    textDecorationLine: 'underline',
  },
  authButton: {
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
  authButtonDisabled: {
    backgroundColor: colors.text.disabled,
    shadowOpacity: 0,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  switchModeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  switchModeLink: {
    fontSize: 14,
    color: colors.primary.light,
    fontWeight: '600',
  },
});