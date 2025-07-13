# Gestion Agence Tool

## SERVICE VOYAGE :
    

## SERVICE COMPTABILITE : 
J'ai intégré un système complet de gestion comptable pour votre agence. Voici les principales fonctionnalités ajoutées :

### Gestion des transactions
- **Modèle Transaction** central pour toutes les opérations financières
- Types de transactions (dépenses, revenus, transferts)
- Statuts de transactions (en attente, approuvée, rejetée)
- Méthodes de paiement diverses

### Gestion des dépenses
- **Modèle Expense** pour gérer les sorties d'argent
- Informations sur les fournisseurs et factures

### Gestion des revenus
- **Modèle Revenue** pour gérer les entrées d'argent
- Lié aux factures clients

### Système de facturation
- **Modèle Invoice** pour créer et suivre les factures clients
- Statuts de factures (brouillon, envoyée, partiellement payée, etc.)
- Items de facture détaillés avec liens aux procédures

### Catégorisation comptable
- **Modèle Category** pour classer les transactions
- Hiérarchie de catégories (catégories/sous-catégories)

### Paramètres comptables
- **Modèle ComptaSettings** pour configurer les préférences comptables
- Année fiscale, taux de TVA, formats de numérotation

### Traçabilité
- Suivi des créateurs et approbateurs de transactions
- Horodatage de toutes les opérations

Cette structure vous permettra de gérer l'ensemble des opérations comptables de votre agence, avec un suivi précis des dépenses et revenus, une gestion des factures clients, et la possibilité de générer des rapports financiers.



## NEXT OBJECTIF A: FINISH
  - Modifier le nom et le prix par defaut d'un step (module)
  - page client step() procedures
  - page client details with procedures
  - edit , add, change status step

## NEXT OBJECTIF B:FINISH
 - Gestion des transactions status (on ne peut qu'Approuvées) 
 - ajout des autorizations avec better auth !
 - change mot de passe !!
 - gestion des autorizations!!
 - gestion de la creation d'un employee
 - gestion des finances : ajout d'une depense etc ...
 -  gestion des authorizations

 ### NEXT OBJECTIF C: PENDING
  - gerer les stats du dasboard pour avoir les bonnes
  - gerer les suspenses chargements
  - gerer les differentes suppressions
  - gerer la modification d'une organization et sa suppression
  - gerer l'activation d'une organization


  ### NEXT OBJECTIF D 
  - INTEGRER LES PAYMENTS POUR LES ABONNEMENTS

      ### NEXT OBJECTIF F
  - GESTION DE LA COMPTABILITE

    ### NEXT OBJECTIF E 
  - INTEGRER L'AGENT IA






<!-- ETAPE -->

Reconnecter github sur vercel
faire pour que ca lance la nouvelle migration de faire de la relation client user optionnel
Decommenter l'update de user push encore pour update
apres supprimer la relation entre client et user sur prisma dans la branch gestion 
Push ca 
Update cote main 
ajouter une reference pour un client 
categoriser les services ! 
