import axios from "axios";
import { getRefreshToken, getToken, setToken } from "./storage";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
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

  const response = await axios.post("http://localhost:3000/api/v1/auth/refresh-token", { refreshToken });
  const nextToken = response.data?.data?.accessToken as string | undefined;
  if (!nextToken) {
    return null;
  }

  await setToken(nextToken);
  return nextToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as { _retry?: boolean; headers: Record<string, string> };
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshingPromise ??= refreshAccessToken().finally(() => {
      refreshingPromise = null;
    });

    const newToken = await refreshingPromise;
    if (!newToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  }
);

export default api;
