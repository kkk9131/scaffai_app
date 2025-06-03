import { getSupabase } from './client'
import type { 
  Project, 
  ProjectInsert, 
  Drawing, 
  DrawingInsert,
  Condition,
  ConditionInsert,
  Calculation,
  CalculationInsert 
} from './types'

export class ProjectService {
  private supabase = getSupabase()

  // Project CRUD operations
  async createProject(projectData: ProjectInsert): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getProjects(ownerId: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('owner_id', ownerId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) throw error
  }

  // Drawing operations
  async createDrawing(drawingData: DrawingInsert): Promise<Drawing> {
    const { data, error } = await this.supabase
      .from('drawings')
      .insert(drawingData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getDrawings(projectId: string): Promise<Drawing[]> {
    const { data, error } = await this.supabase
      .from('drawings')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async updateDrawing(drawingId: string, updates: Partial<Drawing>): Promise<Drawing> {
    const { data, error } = await this.supabase
      .from('drawings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', drawingId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteDrawing(drawingId: string): Promise<void> {
    const { error } = await this.supabase
      .from('drawings')
      .delete()
      .eq('id', drawingId)
    
    if (error) throw error
  }

  // Condition operations
  async createCondition(conditionData: ConditionInsert): Promise<Condition> {
    const { data, error } = await this.supabase
      .from('conditions')
      .insert(conditionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getCondition(projectId: string): Promise<Condition | null> {
    const { data, error } = await this.supabase
      .from('conditions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  async updateCondition(conditionId: string, updates: Partial<Condition>): Promise<Condition> {
    const { data, error } = await this.supabase
      .from('conditions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', conditionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Calculation operations
  async createCalculation(calculationData: CalculationInsert): Promise<Calculation> {
    const { data, error } = await this.supabase
      .from('calculations')
      .insert(calculationData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getCalculations(projectId: string): Promise<Calculation[]> {
    const { data, error } = await this.supabase
      .from('calculations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getLatestCalculation(projectId: string): Promise<Calculation | null> {
    const { data, error } = await this.supabase
      .from('calculations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  async updateCalculation(calculationId: string, updates: Partial<Calculation>): Promise<Calculation> {
    const { data, error } = await this.supabase
      .from('calculations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', calculationId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteCalculation(calculationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('calculations')
      .delete()
      .eq('id', calculationId)
    
    if (error) throw error
  }

  // Composite operations
  async getProjectWithDetails(projectId: string) {
    const [project, drawings, condition, calculations] = await Promise.all([
      this.getProject(projectId),
      this.getDrawings(projectId),
      this.getCondition(projectId),
      this.getCalculations(projectId)
    ])

    return {
      project,
      drawings,
      condition,
      calculations
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService()