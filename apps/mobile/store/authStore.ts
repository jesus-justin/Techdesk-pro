import { create } from "zustand";
import api from "../lib/api";
import { clearAll, setAccessToken, setRefreshToken } from "../lib/storage";
import type { User } from "@techdesk-pro/types";

type SafeUser = Omit<User, "passwordHash" | "refreshToken">;

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: SafeUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const data = response.data.data as {
      accessToken: string;
      refreshToken: string;
      user: SafeUser;
    };

    await setAccessToken(data.accessToken);
    await setRefreshToken(data.refreshToken);

    set({
      user: data.user,
      accessToken: data.accessToken,
      isAuthenticated: true
    });
  },
  logout: async () => {
    await clearAll();
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false
    });
  },
  setUser: (user) => {
    set({
      user,
      isAuthenticated: Boolean(user)
    });
  }
}));
