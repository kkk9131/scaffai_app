import type { User, UserInsert } from './types';
export declare class AuthService {
    private supabase;
    signUp(email: string, password: string, userData?: Partial<UserInsert>): Promise<{
        data: {
            user: import("@supabase/supabase-js").AuthUser | null;
            session: import("@supabase/supabase-js").AuthSession | null;
        };
        error: null;
    }>;
    signIn(email: string, password: string): Promise<{
        data: {
            user: import("@supabase/supabase-js").AuthUser;
            session: import("@supabase/supabase-js").AuthSession;
            weakPassword?: import("@supabase/supabase-js").WeakPassword;
        };
        error: null;
    }>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    updateProfile(userId: string, updates: Partial<User>): Promise<any>;
    resetPassword(email: string): Promise<void>;
    updatePassword(newPassword: string): Promise<void>;
    onAuthStateChange(callback: (event: string, session: any) => void): {
        data: {
            subscription: import("@supabase/supabase-js").Subscription;
        };
    };
    getSession(): Promise<{
        data: {
            session: import("@supabase/supabase-js").AuthSession;
        } | {
            session: null;
        } | {
            session: null;
        };
        error: import("@supabase/supabase-js").AuthError | null;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.d.ts.map