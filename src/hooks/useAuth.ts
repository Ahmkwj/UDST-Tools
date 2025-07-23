import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { authService } from "../services/authService";
import { supabase } from "../utils/supabaseClient";

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!session;

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        // Handle specific auth events
        switch (event) {
          case "SIGNED_IN":
            console.log("User signed in:", session?.user?.email);
            break;
          case "SIGNED_OUT":
            console.log("User signed out");
            break;
          case "TOKEN_REFRESHED":
            console.log("Token refreshed");
            break;
          case "USER_UPDATED":
            console.log("User updated");
            break;
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      const result = await authService.signUp(email, password, name);
      if (result.error) {
        return { error: result.error.message };
      }
      return { error: null };
    } catch (error) {
      return { error: "An unexpected error occurred during sign up" };
    }
  }, []);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password);
      if (result.error) {
        return { error: result.error.message };
      }
      return { error: null };
    } catch (error) {
      return { error: "An unexpected error occurred during sign in" };
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      return await authService.signOut();
    } catch (error) {
      return { error: "An unexpected error occurred during sign out" };
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
    try {
      const result = await authService.updateProfile(data);
      if (result.error) {
        return { error: result.error.message };
      }
      return { error: null };
    } catch (error) {
      return { error: "An unexpected error occurred updating profile" };
    }
  }, []);

  // Update password function
  const updatePassword = useCallback(async (password: string) => {
    try {
      const result = await authService.updatePassword(password);
      if (result.error) {
        return { error: result.error.message };
      }
      return { error: null };
    } catch (error) {
      return { error: "An unexpected error occurred updating password" };
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      return { error: "An unexpected error occurred sending reset email" };
    }
  }, []);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword,
    resetPassword,
    isAuthenticated,
  };
}; 