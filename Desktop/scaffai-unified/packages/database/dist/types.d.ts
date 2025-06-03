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
                    updated_at?: string;
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
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DrawingInsert = Database['public']['Tables']['drawings']['Insert'];
export type ConditionInsert = Database['public']['Tables']['conditions']['Insert'];
export type CalculationInsert = Database['public']['Tables']['calculations']['Insert'];
//# sourceMappingURL=types.d.ts.map