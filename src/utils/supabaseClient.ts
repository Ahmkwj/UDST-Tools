import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error("Invalid Supabase URL format.");
}

// Create typed Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "X-Client-Info": "udst-tools@1.0.0",
      },
    },
  }
);

// Error handling utility
export const handleSupabaseError = (error: unknown): string => {
  if (!error) return "An unknown error occurred";
  
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    
    // Handle Supabase-specific errors
    if (err.code) {
      switch (err.code) {
        case "23505":
          return "This record already exists";
        case "23503":
          return "Referenced record not found";
        case "PGRST116":
          return "No data found";
        case "42501":
          return "Insufficient permissions";
        default:
          return err.message || "Database error occurred";
      }
    }
    
    // Handle general errors
    if (err.message) {
      return err.message;
    }
  }
  
  return "An unexpected error occurred";
};

// Health check utility
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
};

// Type-safe query builder utilities
export const createQuery = (tableName: keyof Database["public"]["Tables"]) => {
  return supabase.from(tableName) as any;
};

// Retry mechanism for failed requests
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i === maxRetries - 1) break;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError;
};
