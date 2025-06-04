import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '@/components/InputField';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { storageService } from '@/src/services/storage';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  bio: string;
  avatar?: string;
  joinedDate: string;
}

export default function ProfileScreen() {
  const { user, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string | null}>({});

  useEffect(() => {
    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        firstName: user.full_name?.split(' ')[1] || '',
        lastName: user.full_name?.split(' ')[0] || '',
        email: user.email,
        phone: '',
        company: '',
        position: '',
        bio: '',
        avatar: user.avatar_url,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
  }, [user]);

  if (!profile || !editedProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="sync" size={24} color={colors.primary.main} />
          <Text style={styles.loadingText}>プロフィールを読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string | null} = {};
    let isValid = true;

    if (!editedProfile.firstName.trim()) {
      newErrors.firstName = '姓を入力してください';
      isValid = false;
    }

    if (!editedProfile.lastName.trim()) {
      newErrors.lastName = '名を入力してください';
      isValid = false;
    }

    if (!editedProfile.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
      isValid = false;
    } else if (!validateEmail(editedProfile.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const updates = {
        full_name: `${editedProfile.lastName} ${editedProfile.firstName}`,
        // Note: Other fields would need to be added to the database schema
      };
      
      const result = await updateProfile(updates);
      
      if (result.error) {
        Alert.alert('エラー', result.error);
      } else {
        setProfile(editedProfile);
        setIsEditing(false);
        Alert.alert('成功', 'プロフィールが更新されました');
      }
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'プロフィールの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!user) return;
    
    setUploadingAvatar(true);
    
    try {
      const result = await storageService.uploadAvatar(user.id);
      
      if (result.error) {
        Alert.alert('エラー', result.error);
      } else if (result.url) {
        // Update profile with new avatar URL
        const updateResult = await updateProfile({ avatar_url: result.url });
        
        if (updateResult.error) {
          Alert.alert('エラー', 'アバターの更新に失敗しました');
        } else {
          setProfile(prev => prev ? { ...prev, avatar: result.url } : null);
          setEditedProfile(prev => prev ? { ...prev, avatar: result.url } : null);
          Alert.alert('成功', 'プロフィール画像が更新されました');
        }
      }
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'アップロードに失敗しました');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'ログアウト', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.push('/auth');
            } catch (error: any) {
              Alert.alert('エラー', error.message || 'ログアウトに失敗しました');
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'アカウント削除',
      'アカウントを削除すると、すべてのデータが失われます。この操作は取り消せません。本当に削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '最終確認',
              '本当にアカウントを削除しますか？',
              [
                { text: 'キャンセル', style: 'cancel' },
                { 
                  text: '削除', 
                  style: 'destructive',
                  onPress: () => {
                    // TODO: Implement actual account deletion logic
                    Alert.alert('実装中', 'アカウント削除機能は準備中です');
                  }
                },
              ]
            );
          }
        },
      ]
    );
  };

  const updateField = (field: string, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

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
          
          <Text style={styles.headerTitle}>プロフィール</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? "close" : "create"} 
              size={24} 
              color={isEditing ? colors.error : colors.primary.main} 
            />
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {getInitials(profile.firstName, profile.lastName)}
                </Text>
              </View>
            )}
            {isEditing && (
              <TouchableOpacity 
                style={styles.avatarEditButton}
                onPress={handleAvatarUpload}
                disabled={uploadingAvatar}
              >
                <Ionicons 
                  name={uploadingAvatar ? "sync" : "camera"} 
                  size={16} 
                  color="white" 
                />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.userName}>
            {profile.lastName} {profile.firstName}
          </Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
          <Text style={styles.joinDate}>
            {formatDate(profile.joinedDate)}から利用開始
          </Text>
        </View>

        {/* Profile Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>基本情報</Text>
          
          <View style={styles.nameContainer}>
            <View style={styles.nameField}>
              <InputField
                label="姓"
                value={isEditing ? editedProfile.lastName : profile.lastName}
                onChangeText={(value) => updateField('lastName', value)}
                placeholder="田中"
                error={errors.lastName}
                editable={isEditing}
              />
            </View>
            <View style={styles.nameField}>
              <InputField
                label="名"
                value={isEditing ? editedProfile.firstName : profile.firstName}
                onChangeText={(value) => updateField('firstName', value)}
                placeholder="太郎"
                error={errors.firstName}
                editable={isEditing}
              />
            </View>
          </View>
          
          <InputField
            label="メールアドレス"
            value={isEditing ? editedProfile.email : profile.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="example@email.com"
            keyboardType="email-address"
            error={errors.email}
            editable={isEditing}
          />
          
          <InputField
            label="電話番号"
            value={isEditing ? editedProfile.phone : profile.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="+81 90-1234-5678"
            keyboardType="phone-pad"
            editable={isEditing}
          />

          <Text style={styles.sectionTitle}>職業情報</Text>
          
          <InputField
            label="会社名"
            value={isEditing ? editedProfile.company : profile.company}
            onChangeText={(value) => updateField('company', value)}
            placeholder="株式会社サンプル"
            editable={isEditing}
          />
          
          <InputField
            label="役職・職種"
            value={isEditing ? editedProfile.position : profile.position}
            onChangeText={(value) => updateField('position', value)}
            placeholder="プロダクトマネージャー"
            editable={isEditing}
          />

          <InputField
            label="自己紹介"
            value={isEditing ? editedProfile.bio : profile.bio}
            onChangeText={(value) => updateField('bio', value)}
            placeholder="自己紹介を入力してください"
            multiline={true}
            numberOfLines={4}
            editable={isEditing}
          />

          {/* Action Buttons */}
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="sync" size={16} color="white" />
                    <Text style={styles.saveButtonText}>保存中...</Text>
                  </View>
                ) : (
                  <Text style={styles.saveButtonText}>保存</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.accountActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/settings')}
              >
                <Ionicons name="settings" size={20} color={colors.text.primary} />
                <Text style={styles.actionButtonText}>設定</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => Alert.alert('実装中', 'ヘルプ機能は準備中です')}
              >
                <Ionicons name="help-circle" size={20} color={colors.text.primary} />
                <Text style={styles.actionButtonText}>ヘルプ・サポート</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out" size={20} color={colors.warning} />
                <Text style={[styles.actionButtonText, styles.logoutText]}>ログアウト</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.dangerAction]}
                onPress={handleDeleteAccount}
              >
                <Ionicons name="trash" size={20} color={colors.error} />
                <Text style={[styles.actionButtonText, styles.deleteText]}>アカウント削除</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  editButton: {
    padding: 8,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.dark,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: colors.text.disabled,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    marginTop: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  nameField: {
    flex: 1,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.paper,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.text.disabled,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: colors.text.disabled,
    shadowOpacity: 0,
  },
  saveButtonText: {
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
  accountActions: {
    marginTop: 32,
    gap: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  logoutText: {
    color: colors.warning,
  },
  deleteText: {
    color: colors.error,
  },
  dangerAction: {
    marginTop: 16,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});