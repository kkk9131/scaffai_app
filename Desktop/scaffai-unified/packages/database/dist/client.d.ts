import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
export declare class DatabaseClient {
    private client;
    constructor(supabaseUrl?: string, supabaseKey?: string);
    get supabase(): SupabaseClient<Database, "public", any>;
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
}
export declare function getSupabaseClient(url?: string, key?: string): DatabaseClient;
export declare function getSupabase(): SupabaseClient<Database, "public", any>;
//# sourceMappingURL=client.d.ts.map