import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== "undefined") {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  }
};

export const loadTokens = () => {
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("access");
    refreshToken = localStorage.getItem("refresh");
  }
};

const baseApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

const api = baseApi

// Inject token avant chaque requête
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Gérer expiration → refresh (sans async/await dans l'interceptor)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const original = error.config;
    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      
      return axios.post(`${API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      })
      .then((res) => {
        const newAccess = res.data.access;
        accessToken = newAccess;
        if (typeof window !== "undefined") {
          localStorage.setItem("access", newAccess);
        }
        console.log("newAccess", newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return baseApi(original);
      })
      .catch((err) => {
        console.error("⚠️ Refresh token invalide, rediriger login");
        // Nettoyer les tokens
        accessToken = null;
        refreshToken = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
        return Promise.reject(error);
      });
    }
    return Promise.reject(error);
  }
);

export { baseApi , api};