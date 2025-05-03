"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TransactionDetailsSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
      {/* Header avec statut et actions */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/services/gestion/finances"
            className="inline-flex items-center text-brand-600 hover:text-brand-800 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour aux transactions
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex items-center">
              <div className="mr-4">
                <Skeleton className="w-6 h-6 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <div className="flex items-center mt-2 space-x-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Montant bien visible */}
      <div className="bg-white dark:bg-gray-800 shadow-sm mb-6">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-36 mb-2 ml-auto" />
              <Skeleton className="h-6 w-28 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="col-span-2 space-y-6">
            {/* Informations de la transaction */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <Skeleton className="h-6 w-64" />
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            
            {/* Détails de la dépense/revenu */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Pièces jointes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <Skeleton className="h-6 w-36" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Skeleton className="w-10 h-10 rounded-lg mr-3" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="w-4 h-4 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Entités liées */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {[...Array(2)].map((_, index) => (
                    <li key={index}>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Skeleton className="w-4 h-4 mr-2 rounded" />
                        <Skeleton className="h-5 w-36" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Métadonnées */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="p-6">
                <dl className="space-y-4">
                  {[...Array(2)].map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-3 w-24 mb-2" />
                      <div className="mt-1 flex items-center">
                        <Skeleton className="w-8 h-8 rounded-full mr-2" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}