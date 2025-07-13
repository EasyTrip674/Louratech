// Exemples d'utilisation des services refactorisés

import { 
  clientService, 
  employeeService, 
  transactionService, 
  procedureService,
  authorizationService 
} from "@/lib/services";

// ===== EXEMPLE 1: Gestion des clients =====

export async function exampleClientManagement() {
  try {
    // Créer un nouveau client
    const newClient = await clientService.createClient({
      email: "client@example.com",
      firstName: "Jean",
      lastName: "Dupont",
      phone: "+33123456789",
      address: "123 Rue de la Paix, Paris",
    });

    console.log("Client créé:", newClient);

    // Récupérer tous les clients
    const allClients = await clientService.getAllClients();
    console.log("Tous les clients:", allClients);

    // Mettre à jour un client
    const updatedClient = await clientService.updateClient({
      id: newClient.id,
      email: "jean.dupont@example.com",
      firstName: "Jean",
      lastName: "Dupont",
      phone: "+33123456789",
    });

    console.log("Client mis à jour:", updatedClient);

  } catch (error) {
    console.error("Erreur lors de la gestion des clients:", error);
  }
}

// ===== EXEMPLE 2: Gestion des employés =====

export async function exampleEmployeeManagement() {
  try {
    // Créer un nouvel employé
    const newEmployee = await employeeService.createEmployee({
      email: "employe@example.com",
      firstName: "Marie",
      lastName: "Martin",
      password: "motdepasse123",
      phone: "+33123456789",
      address: "456 Avenue des Champs, Lyon",
    });

    console.log("Employé créé:", newEmployee);

    // Récupérer tous les employés
    const allEmployees = await employeeService.getAllEmployees();
    console.log("Tous les employés:", allEmployees);

  } catch (error) {
    console.error("Erreur lors de la gestion des employés:", error);
  }
}

// ===== EXEMPLE 3: Gestion des transactions =====

export async function exampleTransactionManagement() {
  try {
    // Créer une nouvelle transaction
    const newTransaction = await transactionService.createTransaction({
      amount: 1000,
      type: "REVENUE",
      paymentMethod: "CASH",
      description: "Paiement pour procédure administrative",
      date: new Date().toISOString(),
    });

    console.log("Transaction créée:", newTransaction);

    // Récupérer les statistiques financières
    const stats = await transactionService.getFinancialStats();
    console.log("Statistiques financières:", stats);

  } catch (error) {
    console.error("Erreur lors de la gestion des transactions:", error);
  }
}

// ===== EXEMPLE 4: Gestion des procédures =====

export async function exampleProcedureManagement() {
  try {
    // Créer une nouvelle procédure
    const newProcedure = await procedureService.createProcedure({
      name: "Procédure Administrative",
      description: "Procédure pour les démarches administratives",
    });

    console.log("Procédure créée:", newProcedure);

    // Créer une étape pour cette procédure
    const newStep = await procedureService.createStep({
      name: "Vérification des documents",
      description: "Vérification de tous les documents requis",
      price: 50,
      procedureId: newProcedure.id,
      order: 1,
      required: true,
      estimatedDuration: 2,
    });

    console.log("Étape créée:", newStep);

    // Récupérer toutes les procédures avec statistiques
    const proceduresWithStats = await procedureService.getProceduresWithStats();
    console.log("Procédures avec statistiques:", proceduresWithStats);

  } catch (error) {
    console.error("Erreur lors de la gestion des procédures:", error);
  }
}

// ===== EXEMPLE 5: Gestion des autorisations =====

export async function exampleAuthorizationManagement() {
  try {
    // Créer des autorisations par défaut pour un utilisateur
    const defaultAuth = await authorizationService.createDefaultAuthorization("user-id");
    console.log("Autorisations par défaut créées:", defaultAuth);

    // Vérifier une autorisation spécifique
    const canCreateClient = await authorizationService.checkUserPermission(
      "user-id", 
      "canCreateClient"
    );
    console.log("Peut créer un client:", canCreateClient);

    // Mettre à jour les autorisations
    const updatedAuth = await authorizationService.updateUserAuthorization(
      "user-id",
      "auth-id",
      {
        canCreateClient: true,
        canEditClient: true,
        canDeleteClient: false,
        canCreateAdmin: false,
        canEditAdmin: false,
        canDeleteAdmin: false,
        canCreateProcedure: true,
        canEditProcedure: true,
        canDeleteProcedure: false,
        canCreateStep: true,
        canEditStep: true,
        canDeleteStep: false,
        canCreateRevenue: true,
        canEditRevenue: true,
        canDeleteRevenue: false,
        canCreateExpense: true,
        canEditExpense: true,
        canDeleteExpense: false,
        canCreateTransaction: true,
        canEditTransaction: true,
        canDeleteTransaction: false,
        canReadTransaction: true,
      }
    );

    console.log("Autorisations mises à jour:", updatedAuth);

  } catch (error) {
    console.error("Erreur lors de la gestion des autorisations:", error);
  }
}

// ===== EXEMPLE 6: Utilisation dans un composant serveur =====

export async function ServerComponentExample() {
  try {
    // Récupérer les données nécessaires
    const [clients, employees, stats] = await Promise.all([
      clientService.getAllClients(),
      employeeService.getAllEmployees(),
      transactionService.getFinancialStats(),
    ]);

    return {
      clients,
      employees,
      stats,
    };
  } catch (error) {
    console.error("Erreur dans le composant serveur:", error);
    return {
      clients: [],
      employees: [],
      stats: null,
    };
  }
}

// ===== EXEMPLE 7: Gestion d'erreurs avancée =====

export async function exampleErrorHandling() {
  try {
    // Tentative de création d'un client avec des données invalides
    const client = await clientService.createClient({
      email: "invalid-email",
      firstName: "",
      lastName: "",
    });

    return { success: true, client };
  } catch (error) {
    // Les services gèrent automatiquement les erreurs
    if (error instanceof Error) {
      return { 
        success: false, 
        error: error.message,
        type: "VALIDATION_ERROR"
      };
    }
    
    return { 
      success: false, 
      error: "Erreur inconnue",
      type: "UNKNOWN_ERROR"
    };
  }
} 