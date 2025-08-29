import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  role: string | null;
  userId: string | null;
  setAuth: (role: string, userId: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const setAuth = (newRole: string, newUserId: string) => {
    setRole(newRole);
    setUserId(newUserId);
  };

  const clearAuth = () => {
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ role, userId, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
