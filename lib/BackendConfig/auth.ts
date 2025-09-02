import  {baseApi,api, setTokens, loadTokens } from "./api";

export const login = async (email: string, password: string) => {
  try {
    const res = await baseApi.post("/api/accounts/auth/login/", { email, password });
    
    if (res.status === 401) {
      throw new Error("Les informations sont incorrectes");
    }

    const { access, refresh } = res.data;
    setTokens(access, refresh);
    return res.data;
    
  } catch (error: any) {
    if (error.response) {
      // Erreurs backend avec un status (400, 401, 500...)
      if (error.response.status === 400) {
        throw new Error("Veuillez remplir tous les champs");
      } else if (error.response.status === 401) {
        throw new Error("Email ou mot de passe incorrect");
      } else {
        throw new Error(error.response.data.error || "Une erreur est survenue");
      }
    } else if (error.request) {
      // Pas de réponse backend (timeout, serveur down)
      throw new Error("Impossible de contacter le serveur");
    } else {
      // Erreur JS (ex: setTokens cassé)
      throw new Error("Erreur interne : " + error.message);
    }
  }
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