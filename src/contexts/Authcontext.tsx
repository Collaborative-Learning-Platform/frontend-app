import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  role: string | null;
  user_id: string | null;
  setAuth: (role: string, user_id: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [user_id, setUser_id] = useState<string | null>(null);

  useEffect(()=>{
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("user_id");
    if (storedRole && storedUserId) {
      setRole(storedRole);
      setUser_id(storedUserId);
    }
  }, [])


  const setAuth = (newRole: string, newUserId: string) => {
    setRole(newRole);
    setUser_id(newUserId);
    localStorage.setItem("role", newRole);
    localStorage.setItem("user_id", newUserId);
  };

  const clearAuth = () => {
    setRole(null);
    setUser_id(null);
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
  };

  return (
    <AuthContext.Provider value={{ role, user_id, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
