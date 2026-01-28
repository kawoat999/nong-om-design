/**
 * Authentication Utilities
 * Shared helper functions for auth-related operations
 */

/**
 * Get userId from localStorage (set by Supabase auth)
 * Searches through localStorage keys to find Supabase session data
 */
export const getUserId = (): string | null => {
    // Try all localStorage keys that might contain Supabase session
    const keys = Object.keys(localStorage);

    for (const key of keys) {
        // Supabase stores auth in keys like 'sb-xxx-auth-token'
        if (key.includes('auth') || key.includes('supabase')) {
            try {
                const data = localStorage.getItem(key);
                if (!data) continue;

                const parsed = JSON.parse(data);

                // Check various possible structures
                if (parsed?.user?.id) return parsed.user.id;
                if (parsed?.currentSession?.user?.id) return parsed.currentSession.user.id;
                if (parsed?.session?.user?.id) return parsed.session.user.id;

            } catch {
                // Not JSON, skip
            }
        }
    }

    console.warn('getUserId: No userId found in localStorage');
    return null;
};
