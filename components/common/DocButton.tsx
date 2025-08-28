import { InfoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const DocHelpButton: React.FC = () => {
  return (
    <Link
      href="/docs/help"
      className="group relative inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 ease-in-out hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-blue-400"
      aria-label="Accéder à l'aide et à la documentation"
      title="Documentation et aide"
    >
      <InfoIcon 
        size={18} 
        className="transition-transform duration-200 group-hover:scale-110" 
        aria-hidden="true"
      />
      
      {/* Tooltip optionnel */}
      <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-700 whitespace-nowrap">
        Documentation
      </span>
    </Link>
  );
};