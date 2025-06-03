import { getSupabase } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

export interface RealtimePayload<T = any> {
  eventType: RealtimeEvent
  new: T
  old: T
  table: string
  schema: string
}

type PostgresChangesConfig = {
  event: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
  schema: string
  table?: string
  filter?: string
}

export class RealtimeService {
  private supabase = getSupabase()
  private channels = new Map<string, RealtimeChannel>()

  // Subscribe to project changes
  subscribeToProject(
    projectId: string, 
    callback: (payload: RealtimePayload) => void
  ): () => void {
    const channelName = `project:${projectId}`
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName)
    
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drawings',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conditions',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calculations',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)

    // Return unsubscribe function
    return () => this.unsubscribe(channelName)
  }

  // Subscribe to user's projects
  subscribeToUserProjects(
    userId: string,
    callback: (payload: RealtimePayload) => void
  ): () => void {
    const channelName = `user-projects:${userId}`
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName)
    
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `owner_id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)

    // Return unsubscribe function
    return () => this.unsubscribe(channelName)
  }

  // Subscribe to specific table changes
  subscribeToTable<T = any>(
    tableName: string,
    callback: (payload: any) => void,
    filter?: string
  ): () => void {
    const channelName = filter ? `${tableName}:${filter}` : tableName
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName)
    
    let channelBuilder = this.supabase.channel(channelName)
    
    if (filter) {
      channelBuilder = channelBuilder.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName, filter },
        callback
      )
    } else {
      channelBuilder = channelBuilder.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        callback
      )
    }
    
    const channel = channelBuilder.subscribe()
    this.channels.set(channelName, channel)

    // Return unsubscribe function
    return () => this.unsubscribe(channelName)
  }

  // Subscribe to calculation status updates for real-time progress
  subscribeToCalculationStatus(
    projectId: string,
    callback: (calculation: any) => void
  ): () => void {
    return this.subscribeToTable(
      'calculations',
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback(payload.new)
        }
      },
      `project_id=eq.${projectId}`
    )
  }

  // Send presence update (for collaborative editing)
  async sendPresence(channelName: string, state: any) {
    const channel = this.channels.get(channelName)
    if (channel) {
      await channel.track(state)
    }
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName)
    if (channel) {
      this.supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll(): void {
    for (const [channelName] of this.channels) {
      this.unsubscribe(channelName)
    }
  }

  // Get channel status
  getChannelStatus(channelName: string): string | null {
    const channel = this.channels.get(channelName)
    return channel ? channel.state : null
  }

  // List active channels
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys())
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService()