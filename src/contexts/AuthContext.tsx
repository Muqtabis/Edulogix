import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'teacher' | 'student' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  userName: string;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer fetching user role with setTimeout to avoid deadlock
          setTimeout(() => {
            fetchUserRole(session.user.id);
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setUserName('');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setRole(data.role as UserRole);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setUserName(data.full_name);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: new Error('Invalid email or password. Please try again.') };
        } else if (error.message.includes('Email not confirmed')) {
          return { error: new Error('Please confirm your email address before signing in.') };
        }
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: new Error('An unexpected error occurred during sign in. Please try again.') };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, selectedRole: UserRole) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        // Provide more user-friendly error messages
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          return { error: new Error('This email is already registered. Please sign in instead.') };
        } else if (error.message.includes('Password')) {
          return { error: new Error('Password must be at least 6 characters long.') };
        }
        return { error };
      }

      // If signup successful and we have a user, assign the role
      if (data.user && selectedRole) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: selectedRole,
          });

        if (roleError) {
          console.error('Error assigning role:', roleError);
          // Even if role assignment fails, the account is created
          // User can contact support to have role assigned manually
          return { 
            error: new Error(
              'Account created successfully, but there was an issue assigning your role. ' +
              'Please contact support or try signing in. Your email: ' + email
            ) 
          };
        }
      }

      return { error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: new Error('An unexpected error occurred during sign up. Please try again.') };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      role, 
      userName, 
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
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
