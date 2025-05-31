import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient as createSSRServerClient, createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  // ブラウザ環境用のクライアント
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

export function createServerClient(cookieStore: any) {
  // サーバーサイド用のクライアント（SSR対応）
  return createSSRServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// React Native用のクライアント
export function createMobileClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          // AsyncStorage または SecureStore を使用
          return Promise.resolve(null)
        },
        setItem: (key: string, value: string) => {
          return Promise.resolve()
        },
        removeItem: (key: string) => {
          return Promise.resolve()
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
}