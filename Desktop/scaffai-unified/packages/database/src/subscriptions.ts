import { getSupabase } from './client'
import type { 
  Subscription, 
  SubscriptionInsert, 
  SubscriptionEvent,
  SubscriptionEventInsert,
  SubscriptionInfo,
  SubscriptionPlan,
  SubscriptionStatus,
  Platform,
  Store,
  User
} from './types'

export class SubscriptionService {
  private supabase = getSupabase()

  // Get user's current subscription
  async getCurrentSubscription(userId: string): Promise<SubscriptionInfo | null> {
    const { data, error } = await this.supabase
      .rpc('get_user_subscription', { user_uuid: userId })
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // No subscription found
      throw error
    }
    
    return data
  }

  // Create new subscription
  async createSubscription(subscriptionData: SubscriptionInsert): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update subscription status
  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Get user's subscription history
  async getSubscriptionHistory(userId: string): Promise<Subscription[]> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Record subscription event
  async recordEvent(eventData: SubscriptionEventInsert): Promise<SubscriptionEvent> {
    const { data, error } = await this.supabase
      .from('subscription_events')
      .insert(eventData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Get subscription events
  async getSubscriptionEvents(subscriptionId: string): Promise<SubscriptionEvent[]> {
    const { data, error } = await this.supabase
      .from('subscription_events')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .order('event_timestamp', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Update user's subscription status
  async updateUserSubscriptionStatus(
    userId: string, 
    plan: SubscriptionPlan,
    status: SubscriptionStatus,
    endDate?: string,
    revenueCatUserId?: string
  ): Promise<User> {
    const updates: any = {
      plan,
      subscription_status: status,
      updated_at: new Date().toISOString()
    }
    
    if (endDate) {
      updates.subscription_end_date = endDate
    }
    
    if (revenueCatUserId) {
      updates.revenuecat_user_id = revenueCatUserId
    }
    
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getCurrentSubscription(userId)
    return subscription?.is_active || false
  }

  // Check if user has specific plan
  async hasActivePlan(userId: string, plan: SubscriptionPlan): Promise<boolean> {
    const subscription = await this.getCurrentSubscription(userId)
    return subscription?.is_active && subscription.plan_type === plan || false
  }

  // Get subscription by RevenueCat subscriber ID
  async getSubscriptionByRevenueCatId(revenueCatId: string): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('revenuecat_subscriber_id', revenueCatId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    
    return data
  }

  // Handle RevenueCat webhook
  async handleRevenueCatWebhook(webhookData: any): Promise<void> {
    const { event, app_user_id } = webhookData
    
    if (!app_user_id) {
      throw new Error('Missing app_user_id in webhook data')
    }

    // Find user by RevenueCat user ID or email
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .or(`revenuecat_user_id.eq.${app_user_id},email.eq.${app_user_id}`)
      .single()
    
    if (userError || !user) {
      console.error('User not found for RevenueCat webhook:', app_user_id)
      return
    }

    const eventType = event.type
    const productId = event.product_id
    const transactionId = event.id
    
    // Record the event
    await this.recordEvent({
      subscription_id: '', // Will be updated after subscription creation/update
      user_id: user.id,
      event_type: eventType,
      event_data: webhookData,
      revenuecat_event_id: transactionId,
      event_timestamp: new Date(event.event_timestamp_ms).toISOString()
    })

    // Handle different event types
    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        await this.handlePurchaseEvent(user, event, webhookData)
        break
      
      case 'CANCELLATION':
        await this.handleCancellationEvent(user, event)
        break
      
      case 'EXPIRATION':
        await this.handleExpirationEvent(user, event)
        break
      
      default:
        console.log('Unhandled RevenueCat event type:', eventType)
    }
  }

  private async handlePurchaseEvent(user: User, event: any, webhookData: any): Promise<void> {
    const plan = this.mapProductIdToPlan(event.product_id)
    const expiresAt = event.expiration_time_ms 
      ? new Date(event.expiration_time_ms).toISOString()
      : null

    // Create or update subscription
    await this.createSubscription({
      user_id: user.id,
      revenuecat_subscriber_id: webhookData.app_user_id,
      product_id: event.product_id,
      plan_type: plan,
      status: 'active',
      starts_at: new Date(event.purchase_date_ms).toISOString(),
      expires_at: expiresAt,
      price_cents: event.price_in_purchased_currency_cents || null,
      currency: event.currency || 'JPY',
      platform: event.store === 'APP_STORE' ? 'ios' : 'android',
      store: event.store === 'APP_STORE' ? 'app_store' : 'play_store',
      webhook_data: webhookData
    })

    // Update user status
    await this.updateUserSubscriptionStatus(
      user.id,
      plan,
      'active',
      expiresAt || undefined,
      webhookData.app_user_id
    )
  }

  private async handleCancellationEvent(user: User, event: any): Promise<void> {
    const subscription = await this.getSubscriptionByRevenueCatId(event.app_user_id)
    if (subscription) {
      await this.cancelSubscription(subscription.id)
    }
  }

  private async handleExpirationEvent(user: User, event: any): Promise<void> {
    await this.updateUserSubscriptionStatus(
      user.id,
      'free',
      'expired'
    )
  }

  private mapProductIdToPlan(productId: string): SubscriptionPlan {
    if (productId.includes('pro')) return 'pro'
    if (productId.includes('enterprise')) return 'enterprise'
    return 'free'
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService()

// Constants for product IDs
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'com.scaffai.pro.monthly',
  PRO_YEARLY: 'com.scaffai.pro.yearly',
  ENTERPRISE_MONTHLY: 'com.scaffai.enterprise.monthly',
  ENTERPRISE_YEARLY: 'com.scaffai.enterprise.yearly'
} as const

// Pricing information
export const PRICING = {
  PRO_MONTHLY: { price: 2980, currency: 'JPY', period: 'monthly' },
  PRO_YEARLY: { price: 29800, currency: 'JPY', period: 'yearly' }, // 2 months free
  ENTERPRISE_MONTHLY: { price: 9800, currency: 'JPY', period: 'monthly' },
  ENTERPRISE_YEARLY: { price: 98000, currency: 'JPY', period: 'yearly' } // 2 months free
} as const