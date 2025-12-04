import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// User role type - matches database enum
type UserRole = 'admin' | 'user' | 'viewer';

// AuthContext provides authentication state and methods throughout the app
interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  isAdmin: boolean;
  isViewer: boolean;
  canModify: boolean; // True if user can add/edit/delete products
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Computed permissions
  const isAdmin = userRole === 'admin';
  const isViewer = userRole === 'viewer';
  const canModify = userRole === 'admin'; // Only admins can modify

  // Check user role from database
  const checkUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setUserRole(data.role as UserRole);
    } else {
      // Default to 'user' role if not found
      setUserRole('user');
    }
  };

  useEffect(() => {
    // Set up authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check role when user changes
        if (currentSession?.user) {
          setTimeout(() => {
            checkUserRole(currentSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        checkUserRole(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userRole, 
      isAdmin, 
      isViewer, 
      canModify, 
      loading, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
