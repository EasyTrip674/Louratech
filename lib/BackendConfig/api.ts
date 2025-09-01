import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

export const loadTokens = () => {
  accessToken = localStorage.getItem("access");
  refreshToken = localStorage.getItem("refresh");
};

const baseApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
const api = baseApi;


// Inject token avant chaque requête
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Gérer expiration → refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && refreshToken) {
      try {
        const res = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        const newAccess = res.data.access;
        accessToken = newAccess;
        localStorage.setItem("access", newAccess);
        console.log("newAccess", newAccess)

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (err) {
        console.error("⚠️ Refresh token invalide, rediriger login");
      }
    }
    return Promise.reject(error);
  }
);

export {api, baseApi};

