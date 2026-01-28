import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;

  signOut: () => Promise<void>;
  updateProfile: (updates: { fullName?: string; avatarUrl?: string }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Sign out API call failed, clearing local session:', error);
    }
    // Always clear local state, even if API call fails
    setUser(null);
    setSession(null);
    // Force clear localStorage as backup
    localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
  };

  const updateProfile = async (updates: { fullName?: string; avatarUrl?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
        },
      });

      if (error) {
        const errorMessage = error.message?.toLowerCase() || '';
        if (errorMessage.includes('failed to fetch') || errorMessage.includes('network error')) {
          return { error: new Error('Unable to connect to server. Please check your internet connection.') };
        }
        return { error };
      }

      // Manually update local state to reflect changes immediately
      try {
        const { data: { session: newSession } } = await supabase.auth.refreshSession();
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
        }
      } catch (refreshError) {
        console.warn('Failed to refresh session, but profile was updated:', refreshError);
      }

      return { error: null };
    } catch (networkError: any) {
      console.error('Network error updating profile:', networkError);
      // Convert network error to a more user-friendly message
      const errorMessage = networkError.message || 'Failed to update profile';
      const isFetchError = errorMessage.toLowerCase().includes('fetch') ||
        errorMessage.includes('network') ||
        errorMessage.includes('connection');

      const userFriendlyError = new Error(
        isFetchError
          ? 'Unable to connect to server. Please check your internet connection.'
          : errorMessage
      );
      return { error: userFriendlyError };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
