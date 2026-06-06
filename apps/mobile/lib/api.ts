import axios from "axios";
import Constants from "expo-constants";
import { clearAll, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "./storage";

function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const host =
    Constants.expoConfig?.hostUri?.split(":").shift() ??
    Constants.expoGoConfig?.debuggerHost?.split(":").shift();

  return `http://${host ?? "localhost"}:3000/api/v1`;
}

const apiBaseUrl = getApiBaseUrl();

const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const refreshClient = axios.create({ baseURL: apiBaseUrl });
  const response = await refreshClient.post("/auth/refresh-token", { refreshToken });
  const nextToken = response.data?.data?.accessToken as string | undefined;
  const nextRefreshToken = response.data?.data?.refreshToken as string | undefined;
  if (!nextToken) {
    return null;
  }

  await setAccessToken(nextToken);
  if (nextRefreshToken) {
    await setRefreshToken(nextRefreshToken);
  }
  return nextToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as { _retry?: boolean; url?: string; headers: Record<string, string> };
    const isAuthRoute = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh-token");

    if (error.response?.status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshingPromise ??= refreshAccessToken().finally(() => {
      refreshingPromise = null;
    });

    const newToken = await refreshingPromise;
    if (!newToken) {
      await clearAll().catch(() => undefined);
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  }
);

export default api;
