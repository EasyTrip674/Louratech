"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { authClient } from "@/lib/auth-client";

export function useCopilotActions() {
  const { data: session } = authClient.useSession();
  const organizationId = session?.userDetails?.organizationId;

  // Rendre les données de l'organisation accessibles à CopilotKit
  useCopilotReadable({
    description: "Informations sur l'organisation actuelle",
    value: {
      organizationId,
      organizationName: session?.userDetails?.organization?.name,
      userRole: session?.userDetails?.role,
      userName: session?.userDetails?.name,
    },
  });

  

  // Action pour rechercher des clients
  useCopilotAction({
    name: "searchClients",
    description: "Rechercher des clients dans l'organisation",
    parameters: [
      {
        name: "query",
        type: "string",
        description: `Terme de recherche pour les clients 
        🎯 Scénarios Implémentés
1. DÉTECTION DES DETTES

Clients avec des procédures non payées
Calcul automatique du montant dû vs montant payé
Détection des factures impayées et en retard
Détail précis de chaque dette par procédure

2. ANALYSE DE L'HISTORIQUE CLIENT

Taux de completion des procédures
Nombre de procédures annulées vs terminées
Score de fidélité calculé automatiquement
Historique des paiements (ponctualité, retards)

3. ÉVALUATION DE LA CAPACITÉ DE PAIEMENT

Score de crédit basé sur l'historique
Comportement de paiement (EXCELLENT/GOOD/POOR)
Limite de crédit recommandée
Niveau de risque auto-calculé

4. DÉTECTION DES CONFLITS

Procédures similaires déjà en cours
Procédures dupliquées
Conflits de ressources ou de timing

5. SCORE DE RISQUE GLOBAL

Calcul automatique sur 100 points
Prise en compte de tous les facteurs
Recommandations personnalisées

🚀 Fonctionnalités Automatiques
✅ Analyse complète à chaque création de procédure
✅ Rapport détaillé ajouté automatiquement aux notes
✅ Recommandations intelligentes
✅ Alertes visuelles (🔴🟡🟢) selon le niveau de risque
✅ Suggestions d'actions (acompte, surveillance, avantages fidélité)
📊 Nouveaux Champs de Réponse
L'API retourne maintenant un objet clientAnalysis contenant :

debtInfo : Toutes les informations sur les dettes
history : Historique complet du client
paymentCapacity : Évaluation de la solvabilité
conflicts : Conflits détectés
riskScore : Score de risque sur 100
recommendations : Liste des recommandations

Cette API transforme chaque création de procédure client en une analyse complète et intelligente qui aide à la prise de décision business !
        `,
      },
    ],
    handler: async ({ query }) => {
      try {
        const response = await fetch(`/api/clients/search?q=${encodeURIComponent(query)}&organizationId=${organizationId}`);
        const clients = await response.json();
        return {
          success: true,
          data: clients,
          message: `Trouvé ${clients.length} client(s) correspondant à "${query}"`,
        };
      } catch(error)  {
        return { success: false, error};
      }
    },
  });

  // Action pour obtenir les statistiques de l'organisation
  useCopilotAction({
    name: "getOrganizationStats",
    description: "Obtenir les statistiques générales de l'organisation",
    parameters: [],
    handler: async () => {
      try {
        const response = await fetch(`/api/dashboard/stats?organizationId=${organizationId}`);
        const stats = await response.json();
        return {
          success: true,
          data: stats,
          message: "Statistiques de l'organisation récupérées avec succès",
        };
      } catch  {
        return { success: false, error: "Erreur lors de la récupération des statistiques" };
      }
    },
  });

  // Action pour rechercher des procédures
  useCopilotAction({
    name: "searchProcedures",
    description: "Rechercher des procédures dans l'organisation",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "Terme de recherche pour les procédures",
      },
      {
        name: "status",
        type: "string",
        description: "Statut des procédures (optionnel): IN_PROGRESS, COMPLETED, CANCELLED, FAILED",
        required: false,
      },
    ],
    handler: async ({ query, status }) => {
      try {
        const params = new URLSearchParams({
          q: query,
          organizationId: organizationId || "",
        });
        if (status) params.append("status", status);

        const response = await fetch(`/api/procedures/search?${params}`);
        const procedures = await response.json();
        return {
          success: true,
          data: procedures,
          message: `Trouvé ${procedures.length} procédure(s)`,
        };
      } catch  {
        return { success: false, error: "Erreur lors de la recherche de procédures" };
      }
    },
  });

  // Action pour obtenir les transactions récentes
  useCopilotAction({
    name: "getRecentTransactions",
    description: "Obtenir les transactions récentes de l'organisation",
    parameters: [
      {
        name: "limit",
        type: "number",
        description: "Nombre de transactions à récupérer (défaut: 10)",
        required: false,
      },
      {
        name: "type",
        type: "string",
        description: "Type de transaction: EXPENSE, REVENUE, TRANSFER",
        required: false,
      },
    ],
    handler: async ({ limit = 10, type }) => {
      try {
        const params = new URLSearchParams({
          organizationId: organizationId || "",
          limit: limit.toString(),
        });
        if (type) params.append("type", type);

        const response = await fetch(`/api/transactions/recent?${params}`);
        const transactions = await response.json();
        return {
          success: true,
          data: transactions,
          message: `${transactions.length} transaction(s) récente(s) récupérée(s)`,
        };
      } catch  {
        return { success: false, error: "Erreur lors de la récupération des transactions" };
      }
    },
  });

  // Action pour créer une nouvelle procédure client
  useCopilotAction({
    name: "createClientProcedure",
    description: "Créer une nouvelle procédure pour un client",
    parameters: [
      {
        name: "clientId",
        type: "string",
        description: "ID du client",
      },
      {
        name: "procedureId",
        type: "string",
        description: "ID de la procédure à suivre",
      },
      {
        name: "notes",
        type: "string",
        description: "Notes sur cette procédure client",
        required: false,
      },
      {
        name: "dueDate",
        type: "string",
        description: "Date d'échéance prévue (format ISO)",
        required: false,
      },
    ],
    handler: async ({ clientId, procedureId, notes, dueDate }) => {
      try {
        const response = await fetch("/api/client-procedures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            procedureId,
            organizationId,
            notes,
            dueDate: dueDate ? new Date(dueDate) : undefined,
          }),
        });
        const result = await response.json();
        return {
          success: true,
          data: result,
          message: "Procédure client créée avec succès",
        };
      } catch  {
        return { success: false, error: "Erreur lors de la création de la procédure client" };
      }
    },
  });

  // Action pour obtenir le résumé financier
  useCopilotAction({
    name: "getFinancialSummary",
    description: "Obtenir un résumé financier de l'organisation",
    parameters: [
      {
        name: "period",
        type: "string",
        description: "Période: 'month', 'quarter', 'year'",
        required: false,
      },
    ],
    handler: async ({ period = "month" }) => {
      try {
        const response = await fetch(`/api/financial/summary?organizationId=${organizationId}&period=${period}`);
        const summary = await response.json();
        return {
          success: true,
          data: summary,
          message: `Résumé financier pour la période: ${period}`,
        };
      } catch  {
        return { success: false, error: "Erreur lors de la récupération du résumé financier" };
      }
    },
  });
}
