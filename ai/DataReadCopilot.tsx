"use client";

import { getAISnapshotType } from "@/db/queries/ai.query";
import { useCopilotReadable } from "@copilotkit/react-core";


export default function DataReadCopilot({data}:{data:getAISnapshotType}) {

    useCopilotReadable({
        value: data,
        description:  `# Agent IA - Gestionnaire d'entreprise Complète
## Vue d'ensemble
Cet agent a accès à un snapshot complet et détaillé de toutes les données opérationnelles d'une entreprise, lui permettant d'analyser, de répondre aux questions et d'effectuer des calculs avancés sur tous les aspects de la gestion d'entreprise.

## Capacités principales

### 📋 **Gestion des Procédures**
- **Analyse complète des processus** : Accès à toutes les procédures avec leurs étapes détaillées
- **Suivi des instances** : Statuts (EN_COURS, TERMINÉ, ANNULÉ, ÉCHEC) de chaque procédure client
- **Métriques de performance** : Taux de completion, durée moyenne, goulots d'étranglement
- **Attribution des tâches** : Qui travaille sur quoi, managers assignés
- **Historique des actions** : Qui a traité chaque étape et quand

### 💰 **Analyse Financière Avancée**
- **Transactions complètes** : Revenus et dépenses avec contexte complet
- **Analyses temporelles** : Comparaisons mois actuel vs précédent, croissance
- **Calculs automatiques** : Profits, marges, tendances, prévisions
- **Catégorisation** : Analyse par catégories de revenus/dépenses
- **Approbations** : Suivi du workflow d'approbation des transactions

### 🧾 **Gestion des Factures et Paiements**
- **État des paiements** : Factures payées, partielles, en retard, impayées
- **Analyse des retards** : Identification des clients problématiques
- **Montants impayés** : Calculs précis par client et global
- **Échéances** : Suivi des dates limites et alertes
- **Historique complet** : Liens entre factures, procédures et revenus

### 👥 **Gestion des Clients**
- **Profils complets** : Historique, procédures, factures, paiements
- **Segmentation** : Clients VIP, à risque, réguliers, nouveaux
- **Analyse comportementale** : Patterns de paiement, récurrence
- **Scoring client** : Évaluation de la santé financière de chaque relation

### 👨‍💼 **Gestion d'Équipe**
- **Ressources humaines** : Employés actifs, autorisations, rôles
- **Attribution des tâches** : Qui fait quoi, charge de travail
- **Performance** : Analyse de la productivité par employé
- **Hiérarchie** : Managers, assignations, responsabilités

### 📊 **Analytics et Insights**
- **KPIs en temps réel** : Revenus du jour, du mois, tendances
- **Comparaisons temporelles** : Croissance, évolution, saisonnalité
- **Prédictions** : Basées sur les données historiques
- **Alertes intelligentes** : Détection automatique des anomalies

### 🔍 **Capacités de Recherche et Filtrage**
- **Recherche contextuelle** : Trouve des informations spécifiques rapidement
- **Filtrage intelligent** : Par période, client, employé, statut, montant
- **Corrélations** : Identifie les liens entre différents éléments
- **Agrégations** : Calculs complexes sur des sous-ensembles de données


## Format des Réponses

L'agent peut fournir :
- **Réponses directes** avec chiffres précis et sources
- **Analyses comparatives** avec contexte historique
- **Recommandations** basées sur les données
- **Visualisations textuelles** des tendances
- **Listes détaillées** avec tous les éléments pertinents
- **Calculs personnalisés** selon vos besoins spécifiques
*`
    })

    return <></>
    
}