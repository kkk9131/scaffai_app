export interface Database {
  public: {
    Tables: {
      // ユーザープロファイル
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          company_name?: string | null
          updated_at?: string
        }
      }
      
      // 足場プロジェクト
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          building_data: any | null // JSON形式の建物データ
          calculation_result: any | null // JSON形式の計算結果
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          building_data?: any | null
          calculation_result?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          building_data?: any | null
          calculation_result?: any | null
          updated_at?: string
        }
      }
      
      // プロジェクト共有設定
      project_shares: {
        Row: {
          id: string
          project_id: string
          shared_with_email: string
          permission: 'read' | 'write'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          shared_with_email: string
          permission: 'read' | 'write'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          shared_with_email?: string
          permission?: 'read' | 'write'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      permission_type: 'read' | 'write'
    }
  }
}