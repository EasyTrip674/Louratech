"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, Loader2, Calendar, DollarSign, Star } from 'lucide-react';
import { PaymentHistory, PlanCard, Subscription, SubscriptionPlan, SubscriptionStatusBadge } from './temp';


// Composant principal pour la gestion des abonnements
const SubscriptionDashboard: React.FC<{ organizationId: string }> = ({ organizationId }) => {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
    fetchAvailablePlans();
  }, [organizationId]);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch(`/api/subscription/status/${organizationId}`);
      if (response.ok) {
        const subscription = await response.json();
        setCurrentSubscription(subscription);
      } else if (response.status !== 404) {
        throw new Error('Erreur lors du chargement de l\'abonnement');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const response = await fetch('/api/subscription/plans');
      if (response.ok) {
        const plans = await response.json();
        setAvailablePlans(plans);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async (planId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/subscription/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          organizationId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Rediriger vers l'URL de paiement
        if (result.payment_url) {
          window.location.href = result.payment_url;
        }
      } else {
        throw new Error('Erreur lors de la création du paiement');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;
    
    setActionLoading(true);
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: currentSubscription.id,
        }),
      });

      if (response.ok) {
        await fetchSubscriptionData(); // Refresh data
      } else {
        throw new Error('Erreur lors de l\'annulation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Abonnements</h1>
        <p className="text-gray-600">Gérez votre abonnement et accédez à toutes les fonctionnalités</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Abonnement actuel */}
      {currentSubscription && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Abonnement actuel</h2>
            <SubscriptionStatusBadge status={currentSubscription.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">{currentSubscription.plan.name}</div>
              <div className="text-sm text-gray-600">Plan actuel</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">
                {formatDate(currentSubscription.currentPeriodEnd)}
              </div>
              <div className="text-sm text-gray-600">Prochaine facturation</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: currentSubscription.plan.currency
                }).format(currentSubscription.plan.amount / 100)}
              </div>
              <div className="text-sm text-gray-600">
                / {currentSubscription.plan.interval.toLowerCase()}
              </div>
            </div>

            {currentSubscription.trialEnd && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(currentSubscription.trialEnd)}
                </div>
                <div className="text-sm text-gray-600">Fin d&apos;essai</div>
              </div>
            )}
          </div>

          {currentSubscription.cancelAtPeriodEnd && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-orange-800">
                  Votre abonnement sera annulé le {formatDate(currentSubscription.currentPeriodEnd)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!currentSubscription.cancelAtPeriodEnd && (
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  'Annuler l\'abonnement'
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plans disponibles */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {currentSubscription ? 'Changer de plan' : 'Choisir un plan'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePlans.map((plan) => (
            <PlanCard

              key={plan.id}
              plan={plan}
              currentPlan={currentSubscription?.plan.id === plan.id}
              onSubscribe={handleSubscription}
              isLoading={actionLoading}
            />
          ))}
        </div>
      </div>

      {/* Historique des paiements */}
      {currentSubscription && currentSubscription.payments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Historique des paiements</h2>
          <PaymentHistory payments={currentSubscription.payments} />
        </div>
      )}
    </div>
  );
};

export default SubscriptionDashboard;