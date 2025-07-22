import React from 'react';
import {  Check, X, Clock, AlertCircle, Loader2,  DollarSign } from 'lucide-react';

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  interval: 'MONTH' | 'YEAR' | 'WEEK';
  intervalCount: number;
  trialDays: number | null;
  features: string[];
  isActive: boolean;
}

interface Subscription {
  id: string;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  plan: SubscriptionPlan;
  payments: Payment[];
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
}
export type {
    Subscription,SubscriptionPlan, Payment
}
// Composant pour afficher le statut de l'abonnement
export const SubscriptionStatusBadge: React.FC<{ status: Subscription['status'] }> = ({ status }) => {
  const getStatusConfig = (status: Subscription['status']) => {
    switch (status) {
      case 'TRIAL':
        return { icon: Clock, color: 'bg-blue-100 text-blue-800', text: 'Période d\'essai' };
      case 'ACTIVE':
        return { icon: Check, color: 'bg-green-100 text-green-800', text: 'Actif' };
      case 'PAST_DUE':
        return { icon: AlertCircle, color: 'bg-orange-100 text-orange-800', text: 'En retard' };
      case 'CANCELED':
        return { icon: X, color: 'bg-red-100 text-red-800', text: 'Annulé' };
      case 'EXPIRED':
        return { icon: X, color: 'bg-gray-100 text-gray-800', text: 'Expiré' };
    }
  };

  const { icon: Icon, color, text } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {text}
    </span>
  );
};

// Composant pour afficher une carte de plan
export const PlanCard: React.FC<{ 
  plan: SubscriptionPlan; 
  currentPlan?: boolean;
  onSubscribe: (planId: string) => void;
  isLoading?: boolean;
}> = ({ plan, currentPlan, onSubscribe, isLoading = false }) => {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Assuming amount is in cents
  };

  const getIntervalText = (interval: string, count: number) => {
    const intervals = {
      MONTH: count === 1 ? 'mois' : `${count} mois`,
      YEAR: count === 1 ? 'an' : `${count} ans`,
      WEEK: count === 1 ? 'semaine' : `${count} semaines`
    };
    return intervals[interval as keyof typeof intervals] || interval;
  };

  return (
    <div className={`relative rounded-xl border-2 p-6 ${currentPlan ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} hover:shadow-lg transition-shadow`}>
      {currentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Plan actuel
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        {plan.description && (
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
        )}
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(plan.amount, plan.currency)}
          </span>
          <span className="text-gray-600 ml-1">
            / {getIntervalText(plan.interval, plan.intervalCount)}
          </span>
        </div>
        {plan.trialDays && (
          <p className="text-sm text-blue-600 font-medium">
            {plan.trialDays} jours d'essai gratuit
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan.id)}
        disabled={currentPlan || !plan.isActive || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          currentPlan
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : plan.isActive
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
        ) : currentPlan ? (
          'Plan actuel'
        ) : plan.isActive ? (
          'S\'abonner'
        ) : (
          'Non disponible'
        )}
      </button>
    </div>
  );
};

// Composant pour l'historique des paiements
export const PaymentHistory: React.FC<{ payments: Payment[] }> = ({ payments }) => {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'REFUNDED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucun paiement effectué</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(payment.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatAmount(payment.amount, payment.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};