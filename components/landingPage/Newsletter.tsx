"use client";
import { useState } from "react";
import Button from "./Button";


export const Newsletter: React.FC = () => {
    const [email, setEmail] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Logique d'inscription à la newsletter
      alert(`Merci de vous être inscrit avec ${email}!`);
      setEmail("");
    };
    
    return (
      <section className="py-16 ">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Inscrivez-vous à notre newsletter
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Recevez les dernières nouvelles, mises à jour et offres spéciales directement dans votre boîte de réception
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="w-full sm:w-auto h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:border-brand-500 focus:ring focus:ring-brand-500/10"
              required
            />
            <Button
              styles="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              text="S'inscrire"
            />
          </form>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            Nous respectons votre vie privée. Vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </section>
    );
  }