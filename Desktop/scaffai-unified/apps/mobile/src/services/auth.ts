import { AuthService } from '@scaffai/database';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  plan: string;
}

export interface AuthResult {
  user?: AuthUser;
  error?: string;
}

class MobileAuthService {
  private authService = new AuthService();
  private currentUser: AuthUser | null = null;

  async signUp(email: string, password: string, userData: { 
    firstName: string; 
    lastName: string; 
  }): Promise<AuthResult> {
    try {
      const fullName = `${userData.lastName} ${userData.firstName}`;
      
      const result = await this.authService.signUp(email, password, {
        full_name: fullName,
        role: 'user',
        plan: 'free'
      });

      if (result.data.user) {
        const userProfile = await this.authService.getCurrentUser();
        if (userProfile) {
          this.currentUser = userProfile;
          await this.persistSession(userProfile);
        }
      }

      return { user: this.currentUser || undefined };
    } catch (error: any) {
      return { error: error.message || 'アカウント作成に失敗しました' };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await this.authService.signIn(email, password);
      
      if (result.data.user) {
        const userProfile = await this.authService.getCurrentUser();
        if (userProfile) {
          this.currentUser = userProfile;
          await this.persistSession(userProfile);
        }
      }

      return { user: this.currentUser || undefined };
    } catch (error: any) {
      return { error: error.message || 'ログインに失敗しました' };
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.currentUser = null;
      await AsyncStorage.removeItem('auth_user');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('ログアウトに失敗しました');
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      // Check for stored session
      const storedUser = await AsyncStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUser = user;
        return user;
      }

      // Check Supabase session
      const userProfile = await this.authService.getCurrentUser();
      if (userProfile) {
        this.currentUser = userProfile;
        await this.persistSession(userProfile);
        return userProfile;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(updates: Partial<AuthUser>): Promise<AuthResult> {
    if (!this.currentUser) {
      return { error: 'ユーザーがログインしていません' };
    }

    try {
      const updatedUser = await this.authService.updateProfile(this.currentUser.id, updates);
      this.currentUser = updatedUser;
      await this.persistSession(updatedUser);
      
      return { user: updatedUser };
    } catch (error: any) {
      return { error: error.message || 'プロフィールの更新に失敗しました' };
    }
  }

  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      await this.authService.resetPassword(email);
      return {};
    } catch (error: any) {
      return { error: error.message || 'パスワードリセットメールの送信に失敗しました' };
    }
  }

  async updatePassword(newPassword: string): Promise<{ error?: string }> {
    try {
      await this.authService.updatePassword(newPassword);
      return {};
    } catch (error: any) {
      return { error: error.message || 'パスワードの更新に失敗しました' };
    }
  }

  private async persistSession(user: AuthUser): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      console.error('Session persistence error:', error);
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this.currentUser = null;
        await AsyncStorage.removeItem('auth_user');
        callback(null);
      } else if (session) {
        const userProfile = await this.authService.getCurrentUser();
        if (userProfile) {
          this.currentUser = userProfile;
          await this.persistSession(userProfile);
          callback(userProfile);
        }
      }
    });
  }
}

// Export singleton instance
export const mobileAuthService = new MobileAuthService();