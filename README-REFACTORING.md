# Architecture Refactorisée - LouraTech

## 🚀 Vue d'ensemble

Ce projet a été refactorisé pour améliorer la scalabilité et appliquer les bonnes pratiques. L'architecture utilise maintenant une couche de services pour séparer la logique métier des actions serveur.

## 📁 Structure des Services

```
lib/
├── services/
│   ├── base.service.ts          # Service de base avec méthodes communes
│   ├── client.service.ts        # Gestion des clients
│   ├── employee.service.ts      # Gestion des employés
│   ├── transaction.service.ts   # Gestion des transactions
│   ├── procedure.service.ts     # Gestion des procédures
│   ├── authorization.service.ts # Gestion des autorisations
│   └── index.ts                 # Export de tous les services
├── actions/
│   └── client.actions.ts        # Actions serveur refactorisées
└── examples/
    └── service-usage.ts         # Exemples d'utilisation
```

## 🔧 Utilisation des Services

### 1. Import des Services

```typescript
import { 
  clientService, 
  employeeService, 
  transactionService,
  procedureService,
  authorizationService 
} from "@/lib/services";
```

### 2. Exemples d'Utilisation

#### Gestion des Clients

```typescript
// Créer un client
const client = await clientService.createClient({
  email: "client@example.com",
  firstName: "Jean",
  lastName: "Dupont",
  phone: "+33123456789",
  address: "123 Rue de la Paix, Paris",
});

// Récupérer tous les clients
const clients = await clientService.getAllClients();

// Mettre à jour un client
const updatedClient = await clientService.updateClient({
  id: "client-id",
  email: "jean.dupont@example.com",
  firstName: "Jean",
  lastName: "Dupont",
});

// Supprimer un client
await clientService.deleteClient("client-id");
```

#### Gestion des Employés

```typescript
// Créer un employé
const employee = await employeeService.createEmployee({
  email: "employe@example.com",
  firstName: "Marie",
  lastName: "Martin",
  password: "motdepasse123",
  phone: "+33123456789",
});

// Récupérer tous les employés
const employees = await employeeService.getAllEmployees();
```

#### Gestion des Transactions

```typescript
// Créer une transaction
const transaction = await transactionService.createTransaction({
  amount: 1000,
  type: "REVENUE",
  paymentMethod: "CASH",
  description: "Paiement pour procédure",
  date: new Date().toISOString(),
});

// Récupérer les statistiques
const stats = await transactionService.getFinancialStats();
```

#### Gestion des Procédures

```typescript
// Créer une procédure
const procedure = await procedureService.createProcedure({
  name: "Procédure Administrative",
  description: "Procédure pour les démarches",
});

// Créer une étape
const step = await procedureService.createStep({
  name: "Vérification des documents",
  description: "Vérification de tous les documents",
  price: 50,
  procedureId: procedure.id,
  order: 1,
  required: true,
});
```

## 🛡️ Gestion des Autorisations

Les services vérifient automatiquement les autorisations :

```typescript
// Le service vérifie automatiquement si l'utilisateur peut créer un client
const client = await clientService.createClient(data);
// Si l'utilisateur n'a pas l'autorisation, une erreur est levée
```

## 🔄 Actions Serveur Refactorisées

### Avant (Ancienne Architecture)

```typescript
export const doCreateClient = adminAction
  .metadata({ actionName: "create client" })
  .schema(createClientSchema)
  .action(async ({ clientInput, ctx }) => {
    // Beaucoup de code dupliqué
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      throw new Error("Organisation introuvable");
    }
    
    // Vérification des autorisations
    if (ctx.user.userDetails?.authorize?.canCreateClient === false) {
      throw new Error("Non autorisé");
    }
    
    // Logique métier mélangée avec l'action
    const existingClient = await prisma.user.findFirst({
      where: { email: clientInput.email }
    });
    
    if (existingClient) {
      throw new Error("Client existe déjà");
    }
    
    // Création du client...
    const client = await prisma.client.create({
      data: { /* ... */ }
    });
    
    revalidatePath("/app/(admin)/services/gestion/clients");
    return { success: true, client };
  });
```

### Après (Nouvelle Architecture)

```typescript
export const createClientAction = adminAction
  .metadata({ actionName: "create client" })
  .schema(createClientSchema)
  .action(async ({ clientInput }) => {
    try {
      const client = await clientService.createClient(clientInput);
      revalidatePath("/app/(admin)/services/gestion/clients");
      return { success: true, client };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });
```

## 🧪 Tests

### Structure Recommandée

```
tests/
├── services/
│   ├── client.service.test.ts
│   ├── employee.service.test.ts
│   └── transaction.service.test.ts
├── actions/
│   ├── client.actions.test.ts
│   └── employee.actions.test.ts
└── integration/
    └── api.test.ts
```

### Exemple de Test

```typescript
import { clientService } from "@/lib/services";

describe("ClientService", () => {
  it("should create a client", async () => {
    const clientData = {
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    };
    
    const client = await clientService.createClient(clientData);
    
    expect(client).toBeDefined();
    expect(client.email).toBe(clientData.email);
  });
});
```

## 🚀 Migration

### 1. Script de Migration

Utilisez le script de migration pour identifier les actions à migrer :

```bash
npx tsx scripts/migration-guide.ts
```

### 2. Étapes de Migration

1. **Identifier** les anciennes actions avec le script
2. **Créer** les nouvelles actions utilisant les services
3. **Tester** chaque migration
4. **Mettre à jour** les imports dans les composants
5. **Supprimer** les anciennes actions

### 3. Exemple de Migration

**Ancienne action :**
```typescript
export const doCreateClient = adminAction...
```

**Nouvelle action :**
```typescript
export const createClientAction = adminAction...
```

## 📚 Documentation

- [Documentation complète](./docs/REFACTORING.md)
- [Exemples d'utilisation](./lib/examples/service-usage.ts)
- [Script de migration](./scripts/migration-guide.ts)

## 🔧 Configuration

### Variables d'Environnement

Assurez-vous d'avoir configuré :

```env
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
GMAIL_USER=your_email
GMAIL_APP_PASSWORD=your_app_password
NEXT_PUBLIC_APP_URL=your_app_url
```

### Dépendances

Les services utilisent :
- `@prisma/client` pour l'accès aux données
- `next-safe-action` pour les actions serveur
- `zod` pour la validation
- `nodemailer` pour l'envoi d'emails

## 🎯 Avantages

### 1. Séparation des Responsabilités
- **Services** : Logique métier
- **Actions** : Validation et gestion des réponses
- **Composants** : Interface utilisateur

### 2. Réutilisabilité
- Services utilisables dans différents contextes
- Logique métier centralisée
- Facilite l'ajout de nouvelles fonctionnalités

### 3. Maintenabilité
- Code plus lisible et organisé
- Gestion d'erreurs centralisée
- Validation et autorisations cohérentes

### 4. Scalabilité
- Architecture modulaire
- Services indépendants et testables
- Facilite l'ajout de nouveaux modules

## 🚨 Gestion d'Erreurs

Les services gèrent automatiquement :
- Vérification des autorisations
- Validation de l'accès aux ressources
- Gestion des erreurs de base de données
- Messages d'erreur cohérents

## 🔒 Sécurité

- Vérification des autorisations dans chaque service
- Validation de l'accès aux ressources
- Protection contre les injections
- Gestion sécurisée des sessions

## 📈 Performance

- Services optimisés pour les requêtes fréquentes
- Gestion efficace des connexions de base de données
- Cache recommandé pour les données statiques

## 🤝 Contribution

1. Suivez l'architecture des services
2. Ajoutez des tests pour les nouvelles fonctionnalités
3. Documentez les nouvelles méthodes
4. Utilisez les services existants quand possible

## 📞 Support

Pour toute question sur l'architecture refactorisée :
1. Consultez la documentation
2. Regardez les exemples d'utilisation
3. Utilisez le script de migration
4. Contactez l'équipe de développement 