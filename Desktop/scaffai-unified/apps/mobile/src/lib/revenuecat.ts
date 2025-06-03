import Purchases, { 
  PurchasesOffering, 
  PurchasesPackage, 
  CustomerInfo,
  PurchasesEntitlementInfo
} from 'react-native-purchases'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService, subscriptionService } from '@scaffai/database'

// RevenueCat API Keys - これは実際のキーに置き換える必要があります
const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || 'appl_YOUR_IOS_KEY',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || 'goog_YOUR_ANDROID_KEY'
}

export class RevenueCatService {
  private isInitialized = false
  private currentUserId: string | null = null

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize RevenueCat
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.INFO)
      
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: API_KEYS.ios })
      } else {
        await Purchases.configure({ apiKey: API_KEYS.android })
      }

      this.isInitialized = true
      console.log('RevenueCat initialized successfully')
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error)
      throw error
    }
  }

  async identifyUser(userId: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      await Purchases.logIn(userId)
      this.currentUserId = userId
      console.log('User identified in RevenueCat:', userId)
    } catch (error) {
      console.error('Failed to identify user in RevenueCat:', error)
      throw error
    }
  }

  async getOfferings(): Promise<PurchasesOffering[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const offerings = await Purchases.getOfferings()
      return Object.values(offerings.all)
    } catch (error) {
      console.error('Failed to get offerings:', error)
      throw error
    }
  }

  async getCurrentOffering(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings()
      return offerings.current
    } catch (error) {
      console.error('Failed to get current offering:', error)
      return null
    }
  }

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase)
      
      // Sync with our database
      await this.syncSubscriptionStatus(customerInfo)
      
      return customerInfo
    } catch (error) {
      console.error('Purchase failed:', error)
      throw error
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const customerInfo = await Purchases.restorePurchases()
      
      // Sync with our database
      await this.syncSubscriptionStatus(customerInfo)
      
      return customerInfo
    } catch (error) {
      console.error('Failed to restore purchases:', error)
      throw error
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return await Purchases.getCustomerInfo()
  }

  async logout(): Promise<void> {
    try {
      await Purchases.logOut()
      this.currentUserId = null
      await AsyncStorage.removeItem('revenuecat_user_id')
      console.log('Logged out from RevenueCat')
    } catch (error) {
      console.error('Failed to logout from RevenueCat:', error)
    }
  }

  // Check if user has active subscription
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo()
      return this.hasActiveEntitlements(customerInfo)
    } catch {
      return false
    }
  }

  // Check if user has pro subscription
  async hasProSubscription(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo()
      return this.hasActiveEntitlement(customerInfo, 'pro')
    } catch {
      return false
    }
  }

  // Check if user has enterprise subscription
  async hasEnterpriseSubscription(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo()
      return this.hasActiveEntitlement(customerInfo, 'enterprise')
    } catch {
      return false
    }
  }

  private hasActiveEntitlements(customerInfo: CustomerInfo): boolean {
    return Object.keys(customerInfo.entitlements.active).length > 0
  }

  private hasActiveEntitlement(customerInfo: CustomerInfo, entitlementId: string): boolean {
    const entitlement = customerInfo.entitlements.active[entitlementId]
    return entitlement?.isActive === true
  }

  // Sync subscription status with our database
  private async syncSubscriptionStatus(customerInfo: CustomerInfo): Promise<void> {
    if (!this.currentUserId) return

    try {
      const user = await authService.getCurrentUser()
      if (!user) return

      const activeEntitlements = customerInfo.entitlements.active
      const hasActiveSubscription = Object.keys(activeEntitlements).length > 0

      if (hasActiveSubscription) {
        // Determine the highest plan
        let plan: 'free' | 'pro' | 'enterprise' = 'free'
        let expirationDate: string | undefined

        if (activeEntitlements['enterprise']) {
          plan = 'enterprise'
          expirationDate = activeEntitlements['enterprise'].expirationDate
        } else if (activeEntitlements['pro']) {
          plan = 'pro'
          expirationDate = activeEntitlements['pro'].expirationDate
        }

        await subscriptionService.updateUserSubscriptionStatus(
          user.id,
          plan,
          'active',
          expirationDate,
          customerInfo.originalAppUserId
        )
      } else {
        // No active subscription
        await subscriptionService.updateUserSubscriptionStatus(
          user.id,
          'free',
          'expired'
        )
      }
    } catch (error) {
      console.error('Failed to sync subscription status:', error)
    }
  }

  // Listen for purchase updates
  setupPurchaseListener(): void {
    Purchases.addCustomerInfoUpdateListener((customerInfo: CustomerInfo) => {
      console.log('Customer info updated:', customerInfo)
      this.syncSubscriptionStatus(customerInfo)
    })
  }

  // Get subscription status for UI
  async getSubscriptionStatus(): Promise<{
    isActive: boolean
    plan: string
    expirationDate?: string
    isInTrial?: boolean
  }> {
    try {
      const customerInfo = await this.getCustomerInfo()
      const activeEntitlements = customerInfo.entitlements.active
      
      if (Object.keys(activeEntitlements).length === 0) {
        return { isActive: false, plan: 'free' }
      }

      // Find the highest tier active entitlement
      if (activeEntitlements['enterprise']) {
        const entitlement = activeEntitlements['enterprise']
        return {
          isActive: true,
          plan: 'enterprise',
          expirationDate: entitlement.expirationDate,
          isInTrial: entitlement.periodType === 'trial'
        }
      }

      if (activeEntitlements['pro']) {
        const entitlement = activeEntitlements['pro']
        return {
          isActive: true,
          plan: 'pro',
          expirationDate: entitlement.expirationDate,
          isInTrial: entitlement.periodType === 'trial'
        }
      }

      return { isActive: false, plan: 'free' }
    } catch (error) {
      console.error('Failed to get subscription status:', error)
      return { isActive: false, plan: 'free' }
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService()

// Product IDs that match RevenueCat dashboard configuration
export const PRODUCT_IDS = {
  PRO_MONTHLY: 'com.scaffai.pro.monthly',
  PRO_YEARLY: 'com.scaffai.pro.yearly',
  ENTERPRISE_MONTHLY: 'com.scaffai.enterprise.monthly',
  ENTERPRISE_YEARLY: 'com.scaffai.enterprise.yearly'
} as const

// Entitlement IDs
export const ENTITLEMENT_IDS = {
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const