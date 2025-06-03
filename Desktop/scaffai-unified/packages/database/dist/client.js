import { createClient } from '@supabase/supabase-js';
export class DatabaseClient {
    client;
    constructor(supabaseUrl, supabaseKey) {
        const url = supabaseUrl || process.env.SUPABASE_URL;
        const key = supabaseKey || process.env.SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new Error('Supabase URL and anonymous key are required');
        }
        this.client = createClient(url, key, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            },
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        });
    }
    get supabase() {
        return this.client;
    }
    async connect() {
        try {
            const { error } = await this.client.auth.getSession();
            if (error) {
                console.warn('Supabase connection warning:', error.message);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
    }
    async disconnect() {
        // Cleanup any active subscriptions
        this.client.removeAllChannels();
    }
}
// Singleton instance
let dbClient = null;
export function getSupabaseClient(url, key) {
    if (!dbClient) {
        dbClient = new DatabaseClient(url, key);
    }
    return dbClient;
}
// Direct access to Supabase client
export function getSupabase() {
    return getSupabaseClient().supabase;
}
