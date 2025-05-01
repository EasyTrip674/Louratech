import { getTransactionsDB } from "@/db/queries/finances.query";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle } from "lucide-react";

export default async function StatsTransactionLayout() {

const transactions = await getTransactionsDB();

const totalRevenues = transactions
.filter(t => t.type === "REVENUE" && t.status === "APPROVED")
.reduce((sum, t) => sum + t.amount, 0);

const totalExpenses = transactions
.filter(t => t.type === "EXPENSE" && t.status === "APPROVED")
.reduce((sum, t) => sum + t.amount, 0);

const balance = totalRevenues - totalExpenses;


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Entrées</h3>
        <ArrowUpCircle className="w-6 h-6 text-green-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {totalRevenues.toLocaleString('fr-FR')} FNG
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Total des revenus approuvés
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Sorties</h3>
        <ArrowDownCircle className="w-6 h-6 text-red-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {totalExpenses.toLocaleString('fr-FR')} FNG
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Total des dépenses approuvées
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Balance</h3>
        <CheckCircle className="w-6 h-6 text-blue-500" />
      </div>
      <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {balance.toLocaleString('fr-FR')} FNG
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Différence entrées/sorties
      </div>
    </div>
  </div>
  );
}