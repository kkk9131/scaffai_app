import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export class MigrationService {
  constructor(private supabase: SupabaseClient<Database>) {}

  // マイグレーションの実行状態を確認
  async checkMigrationStatus(): Promise<boolean> {
    try {
      // profiles テーブルの存在確認
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id')
        .limit(1)

      return !error
    } catch {
      return false
    }
  }

  // 開発環境用のサンプルデータ作成
  async seedDevelopmentData(userId: string, email: string): Promise<void> {
    // プロファイル作成
    await this.supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        display_name: 'テストユーザー',
        company_name: '株式会社サンプル',
      })

    // サンプルプロジェクト作成
    const sampleBuildingData = {
      walls: [
        {
          id: '1',
          name: '南面',
          length: 10,
          height: 8,
          nokideDistance: 600,
        },
        {
          id: '2',
          name: '東面',
          length: 12,
          height: 8,
          nokideDistance: 600,
        },
      ],
      totalArea: 196,
      perimeter: 44,
    }

    const sampleCalculationResult = {
      scaffoldingArea: 352,
      materials: [
        { name: '単管パイプ 4m', quantity: 45, unit: '本' },
        { name: 'クランプ', quantity: 120, unit: '個' },
        { name: '足場板', quantity: 30, unit: '枚' },
      ],
      totalCost: 450000,
      workDays: 3,
    }

    await this.supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: 'サンプル住宅プロジェクト',
        description: '2階建て住宅の足場計算サンプル',
        building_data: sampleBuildingData,
        calculation_result: sampleCalculationResult,
      })
  }
}