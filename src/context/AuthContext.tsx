import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{
    error: string | null;
  }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: string | null;
  }>;
  signOut: () => Promise<{ error: string | null }>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<{
    error: string | null;
  }>;
  updatePassword: (password: string) => Promise<{
    error: string | null;
  }>;
  resetPassword: (email: string) => Promise<{
    error: string | null;
  }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Keep the old export for backward compatibility
export { useAuthContext as useAuth };
