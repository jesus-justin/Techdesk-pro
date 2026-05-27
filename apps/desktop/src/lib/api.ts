import axios from "axios";
import { getValue, setValue } from "./store";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

api.interceptors.request.use(async (config) => {
  const token = await getValue("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getValue("refreshToken");
  if (!refreshToken) {
    return null;
  }

  const response = await axios.post("http://localhost:3000/api/v1/auth/refresh-token", { refreshToken });
  const token = response.data?.data?.accessToken as string | undefined;
  if (!token) {
    return null;
  }

  await setValue("accessToken", token);
  return token;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as { _retry?: boolean; headers: Record<string, string> };
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const token = await refreshPromise;
    if (!token) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api(originalRequest);
  }
);

export default api;
