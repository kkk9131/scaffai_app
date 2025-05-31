import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export class AuthService {
  constructor(private supabase: SupabaseClient<Database>) {}

  // サインアップ
  async signUp(email: string, password: string, displayName?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) throw error

    // プロファイル作成
    if (data.user) {
      await this.createProfile(data.user.id, email, displayName)
    }

    return data
  }

  // サインイン
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  // パスワードリセット
  async resetPassword(email: string, redirectTo?: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || '/reset-password',
    })

    if (error) throw error
  }

  // パスワード更新
  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }

  // サインアウト
  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  // 現在のユーザー取得
  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // セッション取得
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    if (error) throw error
    return session
  }

  // 認証状態変更監視
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  // プロファイル作成（内部用）
  private async createProfile(userId: string, email: string, displayName?: string) {
    const { error } = await this.supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        display_name: displayName || null,
      })

    if (error) throw error
  }
}