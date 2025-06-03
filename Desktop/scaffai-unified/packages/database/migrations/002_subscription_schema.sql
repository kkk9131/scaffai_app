-- Subscription Management Schema
-- Created: 2025-06-04

-- Add subscription fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS revenuecat_user_id TEXT;

-- Create subscription plans enum
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');

-- Update user_plan enum to match subscription_plan
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'free';
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'pro';
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'enterprise';

-- Create subscriptions table for detailed tracking
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- RevenueCat integration
    revenuecat_subscriber_id TEXT NOT NULL,
    revenuecat_original_app_user_id TEXT,
    
    -- Subscription details
    product_id TEXT NOT NULL, -- com.scaffai.pro, com.scaffai.enterprise
    plan_type subscription_plan NOT NULL,
    status TEXT NOT NULL, -- active, expired, cancelled, trial
    
    -- Dates
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Financial
    price_cents INTEGER, -- Price in cents (¥2980 = 298000)
    currency TEXT DEFAULT 'JPY',
    billing_period TEXT, -- monthly, yearly
    
    -- Platform info
    platform TEXT NOT NULL, -- ios, android, web
    store TEXT, -- app_store, play_store, stripe
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    webhook_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one active subscription per user per product
    UNIQUE(user_id, product_id, status) DEFERRABLE INITIALLY DEFERRED
);

-- Create subscription history for audit trail
CREATE TABLE subscription_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event details
    event_type TEXT NOT NULL, -- purchase, renewal, cancellation, refund, etc.
    event_data JSONB NOT NULL,
    revenuecat_event_id TEXT,
    
    -- Timestamps
    event_timestamp TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_revenuecat_id ON subscriptions(revenuecat_subscriber_id);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX idx_subscriptions_product_id ON subscriptions(product_id);

CREATE INDEX idx_subscription_events_subscription_id ON subscription_events(subscription_id);
CREATE INDEX idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_type ON subscription_events(event_type);
CREATE INDEX idx_subscription_events_timestamp ON subscription_events(event_timestamp DESC);

-- Add updated_at trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for subscription events  
CREATE POLICY "Users can view their own subscription events" ON subscription_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert subscription events" ON subscription_events
    FOR INSERT WITH CHECK (true); -- Allow webhook inserts

-- Create useful views
CREATE VIEW active_subscriptions AS
SELECT 
    s.*,
    u.email,
    u.full_name
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active' 
  AND (s.expires_at IS NULL OR s.expires_at > NOW());

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    plan_type TEXT,
    status TEXT,
    expires_at TIMESTAMPTZ,
    is_trial BOOLEAN,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.plan_type::TEXT,
        s.status,
        s.expires_at,
        (s.trial_ends_at IS NOT NULL AND s.trial_ends_at > NOW()) as is_trial,
        (s.status = 'active' AND (s.expires_at IS NULL OR s.expires_at > NOW())) as is_active
    FROM subscriptions s
    WHERE s.user_id = user_uuid
      AND s.status IN ('active', 'trial')
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;