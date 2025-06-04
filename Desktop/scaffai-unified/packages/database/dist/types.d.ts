export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    role: 'user' | 'admin';
                    plan: 'free' | 'pro' | 'enterprise';
                    subscription_status: string;
                    subscription_end_date: string | null;
                    revenuecat_user_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: 'user' | 'admin';
                    plan?: 'free' | 'pro' | 'enterprise';
                    subscription_status?: string;
                    subscription_end_date?: string | null;
                    revenuecat_user_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: 'user' | 'admin';
                    plan?: 'free' | 'pro' | 'enterprise';
                    subscription_status?: string;
                    subscription_end_date?: string | null;
                    revenuecat_user_id?: string | null;
                    updated_at?: string;
                };
            };
            subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    revenuecat_subscriber_id: string;
                    revenuecat_original_app_user_id: string | null;
                    product_id: string;
                    plan_type: 'free' | 'pro' | 'enterprise';
                    status: string;
                    starts_at: string;
                    expires_at: string | null;
                    trial_ends_at: string | null;
                    cancelled_at: string | null;
                    price_cents: number | null;
                    currency: string;
                    billing_period: string | null;
                    platform: string;
                    store: string | null;
                    metadata: any;
                    webhook_data: any;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    revenuecat_subscriber_id: string;
                    revenuecat_original_app_user_id?: string | null;
                    product_id: string;
                    plan_type: 'free' | 'pro' | 'enterprise';
                    status: string;
                    starts_at: string;
                    expires_at?: string | null;
                    trial_ends_at?: string | null;
                    cancelled_at?: string | null;
                    price_cents?: number | null;
                    currency?: string;
                    billing_period?: string | null;
                    platform: string;
                    store?: string | null;
                    metadata?: any;
                    webhook_data?: any;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    revenuecat_subscriber_id?: string;
                    revenuecat_original_app_user_id?: string | null;
                    product_id?: string;
                    plan_type?: 'free' | 'pro' | 'enterprise';
                    status?: string;
                    starts_at?: string;
                    expires_at?: string | null;
                    trial_ends_at?: string | null;
                    cancelled_at?: string | null;
                    price_cents?: number | null;
                    currency?: string;
                    billing_period?: string | null;
                    platform?: string;
                    store?: string | null;
                    metadata?: any;
                    webhook_data?: any;
                    updated_at?: string;
                };
            };
            subscription_events: {
                Row: {
                    id: string;
                    subscription_id: string;
                    user_id: string;
                    event_type: string;
                    event_data: any;
                    revenuecat_event_id: string | null;
                    event_timestamp: string;
                    processed_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    subscription_id: string;
                    user_id: string;
                    event_type: string;
                    event_data: any;
                    revenuecat_event_id?: string | null;
                    event_timestamp: string;
                    processed_at?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    subscription_id?: string;
                    user_id?: string;
                    event_type?: string;
                    event_data?: any;
                    revenuecat_event_id?: string | null;
                    event_timestamp?: string;
                    processed_at?: string;
                    created_at?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    owner_id: string;
                    site_address: string | null;
                    status: 'draft' | 'in_progress' | 'completed';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    owner_id: string;
                    site_address?: string | null;
                    status?: 'draft' | 'in_progress' | 'completed';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    owner_id?: string;
                    site_address?: string | null;
                    status?: 'draft' | 'in_progress' | 'completed';
                    updated_at?: string;
                };
            };
            drawings: {
                Row: {
                    id: string;
                    project_id: string;
                    name: string;
                    dxf_blob: string | null;
                    svg_blob: string | null;
                    scale: number;
                    metadata: any | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    name: string;
                    dxf_blob?: string | null;
                    svg_blob?: string | null;
                    scale?: number;
                    metadata?: any | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    project_id?: string;
                    name?: string;
                    dxf_blob?: string | null;
                    svg_blob?: string | null;
                    scale?: number;
                    metadata?: any | null;
                    updated_at?: string;
                };
            };
            conditions: {
                Row: {
                    id: string;
                    project_id: string;
                    eave_depths: number[];
                    boundaries: any;
                    roof_type: string;
                    special_materials: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    eave_depths: number[];
                    boundaries: any;
                    roof_type: string;
                    special_materials?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    project_id?: string;
                    eave_depths?: number[];
                    boundaries?: any;
                    roof_type?: string;
                    special_materials?: string[];
                    updated_at?: string;
                };
            };
            calculations: {
                Row: {
                    id: string;
                    project_id: string;
                    algo_version: string;
                    result_json: any;
                    cost: number | null;
                    material_list: any | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    algo_version: string;
                    result_json: any;
                    cost?: number | null;
                    material_list?: any | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    project_id?: string;
                    algo_version?: string;
                    result_json?: any;
                    cost?: number | null;
                    material_list?: any | null;
                    updated_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            user_role: 'user' | 'admin';
            user_plan: 'free' | 'pro' | 'enterprise';
            project_status: 'draft' | 'in_progress' | 'completed';
        };
    };
}
export interface DatabaseConfig {
    url: string;
    key: string;
}
export type User = Database['public']['Tables']['users']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Drawing = Database['public']['Tables']['drawings']['Row'];
export type Condition = Database['public']['Tables']['conditions']['Row'];
export type Calculation = Database['public']['Tables']['calculations']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type SubscriptionEvent = Database['public']['Tables']['subscription_events']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DrawingInsert = Database['public']['Tables']['drawings']['Insert'];
export type ConditionInsert = Database['public']['Tables']['conditions']['Insert'];
export type CalculationInsert = Database['public']['Tables']['calculations']['Insert'];
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
export type SubscriptionEventInsert = Database['public']['Tables']['subscription_events']['Insert'];
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';
export type Platform = 'ios' | 'android' | 'web';
export type Store = 'app_store' | 'play_store' | 'stripe';
export interface SubscriptionInfo {
    subscription_id?: string;
    plan_type: SubscriptionPlan;
    status: SubscriptionStatus;
    expires_at?: string | null;
    is_trial: boolean;
    is_active: boolean;
}
//# sourceMappingURL=types.d.ts.map