import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from './types'

export interface RealtimeSubscriptionOptions {
  onProjectUpdate?: (payload: any) => void
  onProjectInsert?: (payload: any) => void
  onProjectDelete?: (payload: any) => void
  onProfileUpdate?: (payload: any) => void
}

export class RealtimeService {
  private subscriptions: Map<string, RealtimeChannel> = new Map()

  constructor(private supabase: SupabaseClient<Database>) {}

  // プロジェクトの変更をリアルタイムで監視
  subscribeToUserProjects(
    userId: string,
    options: RealtimeSubscriptionOptions
  ): string {
    const subscriptionId = `user_projects_${userId}_${Date.now()}`
    
    const channel = this.supabase
      .channel(`user_projects:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Project updated:', payload)
          options.onProjectUpdate?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Project inserted:', payload)
          options.onProjectInsert?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Project deleted:', payload)
          options.onProjectDelete?.(payload)
        }
      )
      .subscribe()

    this.subscriptions.set(subscriptionId, channel)
    return subscriptionId
  }

  // 特定のプロジェクトの変更を監視（協調作業用）
  subscribeToProject(
    projectId: string,
    options: RealtimeSubscriptionOptions
  ): string {
    const subscriptionId = `project_${projectId}_${Date.now()}`
    
    const channel = this.supabase
      .channel(`project:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Project updated:', payload)
          options.onProjectUpdate?.(payload)
        }
      )
      .subscribe()

    this.subscriptions.set(subscriptionId, channel)
    return subscriptionId
  }

  // ユーザープロファイルの変更を監視
  subscribeToUserProfile(
    userId: string,
    options: RealtimeSubscriptionOptions
  ): string {
    const subscriptionId = `user_profile_${userId}_${Date.now()}`
    
    const channel = this.supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated:', payload)
          options.onProfileUpdate?.(payload)
        }
      )
      .subscribe()

    this.subscriptions.set(subscriptionId, channel)
    return subscriptionId
  }

  // プロジェクト共有の変更を監視
  subscribeToProjectShares(
    userEmail: string,
    onShareUpdate: (payload: any) => void
  ): string {
    const subscriptionId = `project_shares_${userEmail}_${Date.now()}`
    
    const channel = this.supabase
      .channel(`shares:${userEmail}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_shares',
          filter: `shared_with_email=eq.${userEmail}`,
        },
        (payload) => {
          console.log('Project share changed:', payload)
          onShareUpdate(payload)
        }
      )
      .subscribe()

    this.subscriptions.set(subscriptionId, channel)
    return subscriptionId
  }

  // カスタムイベント送信（協調作業用）
  async sendProjectUpdate(projectId: string, eventType: string, data: any) {
    const channel = this.supabase.channel(`project:${projectId}`)
    
    await channel.send({
      type: 'broadcast',
      event: eventType,
      payload: data,
    })
  }

  // カスタムイベント監視
  subscribeToProjectEvents(
    projectId: string,
    eventType: string,
    callback: (payload: any) => void
  ): string {
    const subscriptionId = `project_events_${projectId}_${eventType}_${Date.now()}`
    
    const channel = this.supabase
      .channel(`project:${projectId}`)
      .on('broadcast', { event: eventType }, callback)
      .subscribe()

    this.subscriptions.set(subscriptionId, channel)
    return subscriptionId
  }

  // 購読解除
  unsubscribe(subscriptionId: string): void {
    const channel = this.subscriptions.get(subscriptionId)
    if (channel) {
      this.supabase.removeChannel(channel)
      this.subscriptions.delete(subscriptionId)
    }
  }

  // すべての購読解除
  unsubscribeAll(): void {
    this.subscriptions.forEach((channel, id) => {
      this.supabase.removeChannel(channel)
    })
    this.subscriptions.clear()
  }

  // 接続状態確認
  getConnectionStatus(): string {
    return 'connected' // simplified for now
  }

  // 手動再接続
  reconnect(): void {
    this.supabase.realtime.disconnect()
    this.supabase.realtime.connect()
  }
}