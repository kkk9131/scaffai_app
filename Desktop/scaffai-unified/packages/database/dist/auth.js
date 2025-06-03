import { getSupabase } from './client';
export class AuthService {
    supabase = getSupabase();
    async signUp(email, password, userData) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });
        if (error)
            throw error;
        // Create user profile if auth was successful
        if (data.user) {
            const profileData = {
                id: data.user.id,
                email: data.user.email,
                full_name: userData?.full_name,
                role: userData?.role || 'user',
                plan: userData?.plan || 'free'
            };
            const { error: profileError } = await this.supabase
                .from('users')
                .insert(profileData);
            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Don't throw here as auth succeeded, just log the error
            }
        }
        return { data, error };
    }
    async signIn(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error)
            throw error;
        return { data, error };
    }
    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error)
            throw error;
    }
    async getCurrentUser() {
        const { data: authData } = await this.supabase.auth.getUser();
        if (!authData.user)
            return null;
        const { data: userData, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        if (error) {
            console.error('Failed to fetch user profile:', error);
            return null;
        }
        return userData;
    }
    async updateProfile(userId, updates) {
        const { data, error } = await this.supabase
            .from('users')
            .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
            .eq('id', userId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async resetPassword(email) {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window?.location?.origin}/reset-password`
        });
        if (error)
            throw error;
    }
    async updatePassword(newPassword) {
        const { error } = await this.supabase.auth.updateUser({
            password: newPassword
        });
        if (error)
            throw error;
    }
    // Listen for auth state changes
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange(callback);
    }
    // Get current session
    async getSession() {
        const { data, error } = await this.supabase.auth.getSession();
        return { data, error };
    }
}
// Export singleton instance
export const authService = new AuthService();
