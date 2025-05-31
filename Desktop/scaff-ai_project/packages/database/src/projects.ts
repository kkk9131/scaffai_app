import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// 一時的に型定義をローカルで定義
interface Project {
  id: string
  name: string
  description: string
  buildingData?: any
  calculationResult?: any
  createdAt: Date
  updatedAt: Date
}

interface BuildingData {
  walls: any[]
  totalArea: number
  perimeter: number
}

interface CalculationResult {
  scaffoldingArea: number
  materials: any[]
  totalCost: number
  workDays: number
}

export class ProjectService {
  constructor(private supabase: SupabaseClient<Database>) {}

  // プロジェクト一覧取得
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      buildingData: row.building_data as BuildingData,
      calculationResult: row.calculation_result as CalculationResult,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  }

  // プロジェクト取得
  async getProject(id: string, userId: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      buildingData: data.building_data as BuildingData,
      calculationResult: data.calculation_result as CalculationResult,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  // プロジェクト作成
  async createProject(
    userId: string,
    name: string,
    description: string = '',
    buildingData?: BuildingData
  ): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert({
        user_id: userId,
        name,
        description: description || null,
        building_data: buildingData || null,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      buildingData: data.building_data as BuildingData,
      calculationResult: data.calculation_result as CalculationResult,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  // プロジェクト更新
  async updateProject(
    id: string,
    userId: string,
    updates: {
      name?: string
      description?: string
      buildingData?: BuildingData
      calculationResult?: CalculationResult
    }
  ): Promise<Project> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description || null
    if (updates.buildingData !== undefined) updateData.building_data = updates.buildingData
    if (updates.calculationResult !== undefined) updateData.calculation_result = updates.calculationResult

    const { data, error } = await this.supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      buildingData: data.building_data as BuildingData,
      calculationResult: data.calculation_result as CalculationResult,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  // プロジェクト削除
  async deleteProject(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }

  // プロジェクト共有
  async shareProject(
    projectId: string,
    userId: string,
    email: string,
    permission: 'read' | 'write' = 'read'
  ): Promise<void> {
    // プロジェクトの所有者確認
    const project = await this.getProject(projectId, userId)
    if (!project) throw new Error('Project not found')

    const { error } = await this.supabase
      .from('project_shares')
      .insert({
        project_id: projectId,
        shared_with_email: email,
        permission,
      })

    if (error) throw error
  }

  // プロジェクト共有解除
  async unshareProject(projectId: string, userId: string, email: string): Promise<void> {
    // プロジェクトの所有者確認
    const project = await this.getProject(projectId, userId)
    if (!project) throw new Error('Project not found')

    const { error } = await this.supabase
      .from('project_shares')
      .delete()
      .eq('project_id', projectId)
      .eq('shared_with_email', email)

    if (error) throw error
  }

  // 共有されたプロジェクト一覧取得
  async getSharedProjects(userEmail: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('project_shares')
      .select(`
        permission,
        projects (*)
      `)
      .eq('shared_with_email', userEmail)

    if (error) throw error

    return data.map((share: any) => ({
      id: share.projects.id,
      name: share.projects.name,
      description: share.projects.description || '',
      buildingData: share.projects.building_data as BuildingData,
      calculationResult: share.projects.calculation_result as CalculationResult,
      createdAt: new Date(share.projects.created_at),
      updatedAt: new Date(share.projects.updated_at),
    }))
  }
}