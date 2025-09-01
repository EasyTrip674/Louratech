import api, { setTokens, loadTokens } from "./api";

export const login = async (username: string, password: string) => {
  const res = await api.post("/api/token/", { username, password });
  const { access, refresh } = res.data;
  setTokens(access, refresh);
  return res.data;
};

export const fetchMe = async () => {
  loadTokens();
  const res = await api.get("/api/core/me/");
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
