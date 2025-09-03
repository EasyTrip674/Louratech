// lib/serverApi.ts
import { cookies } from "next/headers"; // pour Next.js App Router

const API_URL = "http://127.0.0.1:8000";

export async function serverFetchWithTokens(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  // Récupérer les tokens depuis les cookies
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access")?.value || null;
  const refreshToken = cookieStore.get("refresh")?.value || null;
  console.log(accessToken);
  

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };
  
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Première requête
  let res = await fetch(`${API_URL}/${url}`, { ...options, headers });

  // Si 401 et refresh token disponible
  if (res.status === 401 && refreshToken) {
    // Rafraîchir le token
    const refreshRes = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!refreshRes.ok) {
      throw new Error("Refresh token invalide, rediriger login");
    }

    const refreshData = await refreshRes.json();
    accessToken = refreshData.access;

    // Réessaie la requête originale avec le nouveau token
    headers["Authorization"] = `Bearer ${accessToken}`;
    res = await fetch(`${API_URL}${url}`, { ...options, headers });

    if (!res.ok) {
      throw new Error(`Erreur API après refresh token : ${res.status}`);
    }
  }

  if (!res.ok) {
    throw new Error(`Erreur API : ${res.status}`);
  }

  return res.json();
}
