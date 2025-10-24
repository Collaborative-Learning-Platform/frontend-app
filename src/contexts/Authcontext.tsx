import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";

type AuthContextType = {
  role: string | null;
  user_id: string | null;
  name: string | null;
  email: string | null;
  loading: boolean;
  profilePicture: string | null;
  setAuth: (user_id: string, role: string) => void;
  setProfilePicture: (url: string | null) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const [user_id, setUser_id] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/auth/get-user/${userId}`);
      console.log("Fetched user data:", response.data);

      if (response.data.success) {
        const user = response.data.user;
        setName(user.name);
        setEmail(user.email);
        
        try {
          const picRes = await axiosInstance.post(
            '/storage/generate-profile-pic-download-url',
            { userId }
          );
          if (picRes.data?.downloadUrl) {
            setProfilePicture(picRes.data.downloadUrl);
          } else {
            setProfilePicture(null);
          }
        } catch (err) {
          console.warn('Could not fetch profile picture URL', err);
          setProfilePicture(null);
        }
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedRole = localStorage.getItem("role");
    if (!storedUserId) {
      clearAuth();
      setLoading(false);
      return;
    }
    setUser_id(storedUserId);
    setRole(storedRole);
    fetchUserData(storedUserId);
  }, []);

  const setAuth = (newUserId: string, newRole: string) => {
    localStorage.setItem("user_id", newUserId);
    localStorage.setItem("role", newRole);
    setUser_id(newUserId);
    setRole(newRole);
    fetchUserData(newUserId);
  };

  const clearAuth = () => {
    setRole(null);
    setUser_id(null);
    setName(null);
    setEmail(null);
    setProfilePicture(null);
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ role, user_id, name, email, loading, profilePicture, setProfilePicture, setAuth, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
