import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export interface UserProfile {
  id: string
  email: string
  displayName: string | null
  companyName: string | null
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  constructor(private supabase: SupabaseClient<Database>) {}

  // ユーザープロファイル取得
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      companyName: data.company_name,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  // ユーザープロファイル更新
  async updateProfile(
    userId: string,
    updates: {
      displayName?: string | null
      companyName?: string | null
    }
  ): Promise<UserProfile> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.displayName !== undefined) updateData.display_name = updates.displayName
    if (updates.companyName !== undefined) updateData.company_name = updates.companyName

    const { data, error } = await this.supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      companyName: data.company_name,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  // ユーザー検索（メール部分一致）
  async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%${query}%`)
      .limit(limit)

    if (error) throw error

    return data.map(row => ({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      companyName: row.company_name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  }

  // ユーザー削除
  async deleteProfile(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) throw error
  }
}