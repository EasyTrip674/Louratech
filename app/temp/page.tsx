"use client";
import { login } from "@/lib/BackendConfig/auth";
import useAuth from "@/lib/BackendConfig/useAuth";
import { useState } from "react";

export default function HomePage() {
  const { user, isLoading,  logout } = useAuth();
  const [email, setemail] = useState("salim@gmail.com");
  const [password, setPassword] = useState("test123");

  if (isLoading) return <p>Chargement...</p>;   

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user ? (
        <div>
          <p>Connecté en tant que {user.name}</p>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : (
        <div>
          <input value={email} onChange={(e) => setemail(e.target.value)} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => login(email, password)}>Se connecter</button>
        </div>
      )}
    </div>
  );
}
