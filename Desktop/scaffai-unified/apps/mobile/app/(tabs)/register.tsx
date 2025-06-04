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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string | null}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    
    return {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasMinLength,
      isValid: hasUpperCase && hasLowerCase && hasNumbers && hasMinLength,
    };
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string | null} = {};
    let isValid = true;

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = '姓を入力してください';
      isValid = false;
    }

    // Last name validation  
    if (!formData.lastName.trim()) {
      newErrors.lastName = '名を入力してください';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
      isValid = false;
    } else {
      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.isValid) {
        newErrors.password = 'パスワードは8文字以上で、大文字・小文字・数字を含む必要があります';
        isValid = false;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認を入力してください';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
      isValid = false;
    }

    // Terms acceptance
    if (!acceptTerms) {
      Alert.alert('利用規約', '利用規約とプライバシーポリシーに同意してください');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API call
      
      Alert.alert(
        'アカウント作成完了',
        'アカウントが正常に作成されました。メールアドレスに確認メールを送信しました。',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Clear form and navigate to login
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
              });
              router.push('/auth');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'エラー',
        'アカウント作成に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const passwordStrength = validatePassword(formData.password);

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="person-add" size={32} color={colors.primary.main} />
              </View>
              <Text style={styles.logoText}>新規アカウント作成</Text>
            </View>
            
            <Text style={styles.subtitle}>
              ScaffAIで新しい体験を始めましょう
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.nameContainer}>
              <View style={styles.nameField}>
                <InputField
                  label="姓"
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData('firstName', value)}
                  placeholder="田中"
                  error={errors.firstName}
                />
              </View>
              <View style={styles.nameField}>
                <InputField
                  label="名"
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData('lastName', value)}
                  placeholder="太郎"
                  error={errors.lastName}
                />
              </View>
            </View>
            
            <InputField
              label="メールアドレス"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="example@email.com"
              keyboardType="email-address"
              error={errors.email}
            />
            
            <View style={styles.passwordContainer}>
              <InputField
                label="パスワード"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                placeholder="安全なパスワードを入力"
                error={errors.password}
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

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <View style={styles.passwordStrength}>
                <Text style={styles.passwordStrengthTitle}>パスワード強度:</Text>
                <View style={styles.strengthIndicators}>
                  <Text style={[styles.strengthItem, passwordStrength.hasMinLength && styles.strengthValid]}>
                    ✓ 8文字以上
                  </Text>
                  <Text style={[styles.strengthItem, passwordStrength.hasUpperCase && styles.strengthValid]}>
                    ✓ 大文字を含む
                  </Text>
                  <Text style={[styles.strengthItem, passwordStrength.hasLowerCase && styles.strengthValid]}>
                    ✓ 小文字を含む
                  </Text>
                  <Text style={[styles.strengthItem, passwordStrength.hasNumbers && styles.strengthValid]}>
                    ✓ 数字を含む
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.passwordContainer}>
              <InputField
                label="パスワード確認"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                placeholder="パスワードを再入力"
                error={errors.confirmPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.text.secondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  <Text style={styles.termsLink}>利用規約</Text>
                  および
                  <Text style={styles.termsLink}>プライバシーポリシー</Text>
                  に同意します
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="sync" size={20} color="white" />
                  <Text style={styles.registerButtonText}>アカウント作成中...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>
                  アカウントを作成
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>既にアカウントをお持ちですか？</Text>
              <TouchableOpacity onPress={() => router.push('/auth')}>
                <Text style={styles.loginLink}>ログイン</Text>
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
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
  passwordStrength: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.background.paper,
    borderRadius: 8,
  },
  passwordStrengthTitle: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  strengthIndicators: {
    gap: 4,
  },
  strengthItem: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  strengthValid: {
    color: colors.secondary.main,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.text.disabled,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary.light,
    textDecorationLine: 'underline',
  },
  registerButton: {
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
  registerButtonDisabled: {
    backgroundColor: colors.text.disabled,
    shadowOpacity: 0,
  },
  registerButtonText: {
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary.light,
    fontWeight: '600',
  },
});