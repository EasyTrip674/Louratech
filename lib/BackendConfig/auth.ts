import  {baseApi,api, setTokens, loadTokens } from "./api";

export const login = async (email: string, password: string) => {
  const res = await baseApi.post("/api/accounts/auth/login/", { email, password });
  const { access, refresh } = res.data;
  setTokens(access, refresh);
  return res.data;
};

export const fetchMe = async () => {
  loadTokens();
  const res = await api.get("/api/core/me");
  console.log(res.data);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};