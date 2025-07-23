import { User, Session, AuthResponse, UserResponse } from "@supabase/supabase-js";
import { supabase, handleSupabaseError, withRetry } from "../utils/supabaseClient";

export interface AuthService {
  signUp: (email: string, password: string, name: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: string | null }>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<UserResponse>;
  updatePassword: (password: string) => Promise<UserResponse>;
  getCurrentUser: () => Promise<User | null>;
  getCurrentSession: () => Promise<Session | null>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  verifyEmail: (token: string) => Promise<{ error: string | null }>;
}

class AuthServiceImpl implements AuthService {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Input validation
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      const result = await withRetry(async () => {
        return await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });
      });

      if (result.error) {
        throw result.error;
      }

      return result;
    } catch (error) {
      const message = handleSupabaseError(error);
      return {
        data: { user: null, session: null },
        error: { message, name: "AuthError", status: 400 },
      } as AuthResponse;
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const result = await withRetry(async () => {
        return await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        });
      });

      if (result.error) {
        throw result.error;
      }

      return result;
    } catch (error) {
      const message = handleSupabaseError(error);
      return {
        data: { user: null, session: null },
        error: { message, name: "AuthError", status: 401 },
      } as AuthResponse;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      return { error: handleSupabaseError(error) };
    }
  }

  /**
   * Update user profile information
   */
  async updateProfile(data: { name?: string; email?: string }): Promise<UserResponse> {
    try {
      const { name, email } = data;
      const updates: any = {};

      // Validate and prepare updates
      if (name !== undefined) {
        if (!name.trim()) {
          throw new Error("Name cannot be empty");
        }
        updates.data = { ...updates.data, name: name.trim() };
      }

      if (email !== undefined) {
        if (!email.trim()) {
          throw new Error("Email cannot be empty");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid email address");
        }
        
        updates.email = email.toLowerCase().trim();
      }

      const result = await withRetry(async () => {
        return await supabase.auth.updateUser(updates);
      });

      if (result.error) {
        throw result.error;
      }

      return result;
    } catch (error) {
      const message = handleSupabaseError(error);
      return {
        data: { user: null },
        error: { message, name: "AuthError", status: 400 },
      } as UserResponse;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(password: string): Promise<UserResponse> {
    try {
      // Validate password
      if (!password) {
        throw new Error("Password is required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const result = await withRetry(async () => {
        return await supabase.auth.updateUser({ password });
      });

      if (result.error) {
        throw result.error;
      }

      return result;
    } catch (error) {
      const message = handleSupabaseError(error);
      return {
        data: { user: null },
        error: { message, name: "AuthError", status: 400 },
      } as UserResponse;
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.warn("Error getting current user:", error);
        return null;
      }

      return data.user;
    } catch (error) {
      console.warn("Unexpected error getting current user:", error);
      return null;
    }
  }

  /**
   * Get the current session
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn("Error getting current session:", error);
        return null;
      }

      return data.session;
    } catch (error) {
      console.warn("Unexpected error getting current session:", error);
      return null;
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      return { error: handleSupabaseError(error) };
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ error: string | null }> {
    try {
      if (!token) {
        throw new Error("Verification token is required");
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      return { error: handleSupabaseError(error) };
    }
  }
}

// Export singleton instance
export const authService = new AuthServiceImpl(); 