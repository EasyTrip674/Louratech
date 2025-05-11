"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Button = ({ styles,text , href }:{styles?:string, text?:string , href?:string}) => {
  const router = useRouter()
  return (
   href ? (
    <button
      className={`${styles} bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
      onClick={() => router.push(href)}
    >
      {text}
    </button>
   ) : (
    <button
      className={`${styles} bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
    >
      {text}
    </button>
   )
  );
}

export default Button;
