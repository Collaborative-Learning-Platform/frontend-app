import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './Authcontext';

export type UserSettings = {
  // Whiteboard settings
  showGrid: boolean;
  defaultBrushSize: number; // maps to defaultBrushSize
  defaultCursorType: 'default' | 'text' | 'resize-corner' | 'nesw-rotate'; // maps to defaultCursorType

  // Document editor preferences
  fontSize: number;
  lineHeight: number;

  //Notifications
  emailNotifications: boolean;

  // Theme preferences
  themeMode: 'light' | 'dark'; // maps to themeMode: ThemeMode.DARK | LIGHT

  // Optional metadata
  createdAt?: string; // maps to created_at
  updatedAt?: string; // maps to updated_at
};

type UserSettingsContextType = {
  settings: UserSettings | null;
  loading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => void;
  reloadSettings: () => Promise<void>;
};

const defaultSettings: UserSettings = {
  defaultBrushSize: 3, // matches defaultBrushSize in entity
  defaultCursorType: 'default', // matches defaultCursorType
  showGrid: true, // matches showGrid
  themeMode: 'light', // corresponds to ThemeMode.LIGHT
  fontSize: 14, // default fontSize
  lineHeight: 1.5,
  emailNotifications: true, // default emailNotifications
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user_id } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings from backend
  const fetchSettings = async () => {
    if (!user_id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/users/preferences/${user_id}`);
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
        console.log(`User Preferences: ${res.data.data}`);
        // Optional: save to localStorage for faster reload
        localStorage.setItem(
          'user_settings',
          JSON.stringify(res.data.data)
        );
      } else {
        setSettings(defaultSettings);
        localStorage.setItem('user_settings', JSON.stringify(defaultSettings));
        console.warn('No user preferences found, using defaults.');
      }
    } catch (err) {
      console.error('Failed to fetch user settings:', err);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  // Update settings in backend and local state
  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user_id) return;
    const newSettings = { ...settings, ...updates } as UserSettings;
    setSettings(newSettings);
    localStorage.setItem('user_settings', JSON.stringify(newSettings));

    try {
      const res = await axiosInstance.put(
        `/users/preferences/${user_id}`,
        updates
      );
      if (!res.data.success) {
        console.error('Failed to update user settings:', res.data.message);
      }
    } catch (err) {
      console.error('Failed to update user settings:', err);
    }
  };

  // Reload settings from backend
  const reloadSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('user_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
      setLoading(false);
    } else {
      fetchSettings();
    }
  }, [user_id]);

  return (
    <UserSettingsContext.Provider
      value={{ settings, loading, updateSettings, reloadSettings }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const ctx = useContext(UserSettingsContext);
  if (!ctx)
    throw new Error('useUserSettings must be used within UserSettingsProvider');
  return ctx;
};
