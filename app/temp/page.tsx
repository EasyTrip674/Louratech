"use client";
import { login } from "@/lib/BackendConfig/auth";
import useAuth from "@/lib/BackendConfig/useAuth";
import { useState } from "react";

export default function HomePage() {
  const { user, isLoading,  logout } = useAuth();
  const [username, setUsername] = useState("salim");
  const [password, setPassword] = useState("12345678");

  if (isLoading) return <p>Chargement...</p>;   

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user ? (
        <div>
          <p>Connecté en tant que {user.username}</p>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : (
        <div>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => login(username, password)}>Se connecter</button>
        </div>
      )}
    </div>
  );
}
