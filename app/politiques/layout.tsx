"use client"
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import Logo from "@/components/logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function PolitiquesLayout({ children  }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
         <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
            <Logo className="w-10 h-10" />
             
            </div>
          </div>
          <nav className="flex items-center space-x-4 mr-4">
            <Link href="/politiques/CGV" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors py-1">
                Conditions Générales de Vente
            </Link>
            <Link href="/politiques/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors py-1">
                Politique de confidentialité
            </Link>

            <ThemeToggleButton />
          </nav>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="flex items-center space-x-2 mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors py-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
        </Link>
        {children}
      </div>
    </div>
  );
}