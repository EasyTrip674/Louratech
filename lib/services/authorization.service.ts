import { BaseService } from "./base.service";

/**
 * Interface complète des autorisations (54 permissions)
 * Correspond exactement au modèle authorization de Prisma
 */
export interface AuthorizationData {
  // Permissions générales (2)
  canChangeUserAuthorization: boolean;
  canChangeUserPassword: boolean;

  // Permissions de création (13)
  canCreateOrganization: boolean;
  canCreateStep: boolean;
  canCreateClient: boolean;
  canCreateProcedure: boolean;
  canCreateTransaction: boolean;
  canCreateAdmin: boolean;
  canCreateInvoice: boolean;
  canCreateExpense: boolean;
  canCreateRevenue: boolean;
  canCreateComptaSettings: boolean;
  canCreateClientProcedure: boolean;
  canCreateClientStep: boolean;
  canCreateClientDocument: boolean;

  // Permissions de lecture (13)
  canReadOrganization: boolean;
  canReadStep: boolean;
  canReadClient: boolean;
  canReadProcedure: boolean;
  canReadTransaction: boolean;
  canReadInvoice: boolean;
  canReadExpense: boolean;
  canReadRevenue: boolean;
  canReadComptaSettings: boolean;
  canReadAdmin: boolean;
  canReadClientProcedure: boolean;
  canReadClientStep: boolean;
  canReadClientDocument: boolean;

  // Permissions de modification (13)
  canEditOrganization: boolean;
  canEditStep: boolean;
  canEditClient: boolean;
  canEditProcedure: boolean;
  canEditTransaction: boolean;
  canEditInvoice: boolean;
  canEditExpense: boolean;
  canEditRevenue: boolean;
  canEditComptaSettings: boolean;
  canEditAdmin: boolean;
  canEditClientProcedure: boolean;
  canEditClientStep: boolean;
  canEditClientDocument: boolean;

  // Permissions de suppression (13)
  canDeleteOrganization: boolean;
  canDeleteStep: boolean;
  canDeleteClient: boolean;
  canDeleteProcedure: boolean;
  canDeleteTransaction: boolean;
  canDeleteInvoice: boolean;
  canDeleteExpense: boolean;
  canDeleteRevenue: boolean;
  canDeleteComptaSettings: boolean;
  canDeleteAdmin: boolean;
  canDeleteClientProcedure: boolean;
  canDeleteClientStep: boolean;
  canDeleteClientDocument: boolean;
}

/**
 * Type partiel pour les mises à jour d'autorisations
 */
export type PartialAuthorizationData = Partial<AuthorizationData>;

export class AuthorizationService extends BaseService {
  /**
   * Récupère toutes les clés de permissions
   */
  private getAllPermissionKeys(): Array<keyof AuthorizationData> {
    return [
      // Général
      "canChangeUserAuthorization", "canChangeUserPassword",
      // Create
      "canCreateOrganization", "canCreateStep", "canCreateClient", "canCreateProcedure",
      "canCreateTransaction", "canCreateAdmin", "canCreateInvoice", "canCreateExpense",
      "canCreateRevenue", "canCreateComptaSettings", "canCreateClientProcedure",
      "canCreateClientStep", "canCreateClientDocument",
      // Read
      "canReadOrganization", "canReadStep", "canReadClient", "canReadProcedure",
      "canReadTransaction", "canReadInvoice", "canReadExpense", "canReadRevenue",
      "canReadComptaSettings", "canReadAdmin", "canReadClientProcedure",
      "canReadClientStep", "canReadClientDocument",
      // Edit
      "canEditOrganization", "canEditStep", "canEditClient", "canEditProcedure",
      "canEditTransaction", "canEditInvoice", "canEditExpense", "canEditRevenue",
      "canEditComptaSettings", "canEditAdmin", "canEditClientProcedure",
      "canEditClientStep", "canEditClientDocument",
      // Delete
      "canDeleteOrganization", "canDeleteStep", "canDeleteClient", "canDeleteProcedure",
      "canDeleteTransaction", "canDeleteInvoice", "canDeleteExpense", "canDeleteRevenue",
      "canDeleteComptaSettings", "canDeleteAdmin", "canDeleteClientProcedure",
      "canDeleteClientStep", "canDeleteClientDocument",
    ];
  }

  /**
   * Met à jour les autorisations d'un utilisateur
   */
  async updateUserAuthorization(userId: string, authorizationId: string, data: PartialAuthorizationData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canManageAuth = await this.checkPermission("canManageAuthorization");
      if (!canManageAuth) {
        throw new Error("Vous n'êtes pas autorisé à modifier les autorisations");
      }

      // Vérifier que l'utilisateur appartient à l'organisation
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { organization: true }
      });

      if (!user || user.organizationId !== organizationId) {
        throw new Error("Utilisateur introuvable ou accès non autorisé");
      }

      // Vérifier que l'autorisation existe
      const authorization = await this.prisma.authorization.findUnique({
        where: { id: authorizationId }
      });

      if (!authorization) {
        throw new Error("Autorisation introuvable");
      }

      // Mettre à jour l'autorisation
      const updatedAuthorization = await this.prisma.authorization.update({
        where: { id: authorizationId },
        data: {
          ...data,
        },
      });

      return updatedAuthorization;
    } catch (error) {
      this.handleDatabaseError(error, "updateUserAuthorization");
    }
  }

  /**
   * Récupère les autorisations d'un utilisateur
   */
  async getUserAuthorization(userId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
          organizationId,
        },
        include: {
          authorize: true,
        },
      });

      if (!user) {
        throw new Error("Utilisateur introuvable");
      }

      return user.authorize;
    } catch (error) {
      this.handleDatabaseError(error, "getUserAuthorization");
    }
  }

  /**
   * Crée des autorisations par défaut pour un nouvel utilisateur
   */
  async createDefaultAuthorization(userId: string) {
    try {
      const organizationId = await this.getOrganizationId();

      // Vérifier que l'utilisateur appartient à l'organisation
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
          organizationId,
        }
      });

      if (!user) {
        throw new Error("Utilisateur introuvable");
      }

      // Créer des autorisations par défaut selon le rôle
      const defaultAuth = this.getDefaultPermissionsByRole(user.role);

      const authorization = await this.prisma.authorization.create({
        data: {
          ...defaultAuth,
          userId,
        },
      });

      return authorization;
    } catch (error) {
      this.handleDatabaseError(error, "createDefaultAuthorization");
    }
  }

  /**
   * Récupère les permissions par défaut selon le rôle
   */
  private getDefaultPermissionsByRole(role: string): AuthorizationData {
    const allKeys = this.getAllPermissionKeys();
    const basePermissions: Record<string, boolean> = {};

    // Initialiser toutes les permissions à false
    allKeys.forEach(key => {
      basePermissions[key] = false;
    });

    switch (role) {
      case "ADMIN":
        // Admin a toutes les permissions
        allKeys.forEach(key => {
          basePermissions[key] = true;
        });
        break;

      case "USER":
        // User a des permissions de lecture et quelques créations
        basePermissions.canReadOrganization = true;
        basePermissions.canReadClient = true;
        basePermissions.canReadProcedure = true;
        basePermissions.canReadStep = true;
        basePermissions.canReadClientProcedure = true;
        basePermissions.canReadClientStep = true;
        basePermissions.canReadClientDocument = true;
        basePermissions.canCreateClient = true;
        basePermissions.canEditClient = true;
        basePermissions.canCreateClientProcedure = true;
        basePermissions.canEditClientProcedure = true;
        basePermissions.canCreateClientStep = true;
        basePermissions.canEditClientStep = true;
        basePermissions.canCreateClientDocument = true;
        break;

      case "EMPLOYEE":
        // Employee a des permissions limitées aux procédures assignées
        basePermissions.canReadProcedure = true;
        basePermissions.canReadStep = true;
        basePermissions.canReadClientProcedure = true;
        basePermissions.canReadClientStep = true;
        basePermissions.canReadClientDocument = true;
        basePermissions.canEditClientStep = true;
        basePermissions.canCreateClientDocument = true;
        break;

      case "CLIENT":
        // Client a accès uniquement à ses propres dossiers
        basePermissions.canReadClientProcedure = true;
        basePermissions.canReadClientStep = true;
        basePermissions.canReadClientDocument = true;
        break;

      default:
        // Par défaut, aucune permission
        break;
    }

    return basePermissions as AuthorizationData;
  }

  /**
   * Applique un template de rôle prédéfini à un utilisateur
   */
  async applyRoleTemplate(userId: string, templateName: string) {
    try {
      const organizationId = await this.getOrganizationId();

      // Vérifier les autorisations
      const canManageAuth = await this.checkPermission("canChangeUserAuthorization");
      if (!canManageAuth) {
        throw new Error("Vous n'êtes pas autorisé à modifier les autorisations");
      }

      // Vérifier que l'utilisateur appartient à l'organisation
      const user = await this.prisma.user.findUnique({
        where: { id: userId, organizationId },
        include: { authorize: true }
      });

      if (!user) {
        throw new Error("Utilisateur introuvable");
      }

      // Récupérer les permissions du template
      const templatePermissions = this.getRoleTemplatePermissions(templateName);

      if (!templatePermissions) {
        throw new Error(`Template "${templateName}" introuvable`);
      }

      // Mettre à jour ou créer l'autorisation
      if (user.authorize) {
        return await this.prisma.authorization.update({
          where: { userId },
          data: templatePermissions,
        });
      } else {
        return await this.prisma.authorization.create({
          data: {
            ...templatePermissions,
            userId,
          },
        });
      }
    } catch (error) {
      this.handleDatabaseError(error, "applyRoleTemplate");
    }
  }

  /**
   * Récupère les permissions d'un template de rôle
   */
  private getRoleTemplatePermissions(templateName: string): AuthorizationData | null {
    const allKeys = this.getAllPermissionKeys();
    const permissions: Record<string, boolean> = {};

    // Initialiser toutes à false
    allKeys.forEach(key => {
      permissions[key] = false;
    });

    switch (templateName.toUpperCase()) {
      case "ADMIN_COMPLET":
      case "ADMINISTRATEUR":
        // Toutes les permissions
        allKeys.forEach(key => {
          permissions[key] = true;
        });
        break;

      case "MANAGER":
      case "GESTIONNAIRE":
        // Read all
        permissions.canReadOrganization = true;
        permissions.canReadClient = true;
        permissions.canReadProcedure = true;
        permissions.canReadStep = true;
        permissions.canReadClientProcedure = true;
        permissions.canReadClientStep = true;
        permissions.canReadClientDocument = true;
        permissions.canReadTransaction = true;
        permissions.canReadExpense = true;
        permissions.canReadRevenue = true;
        permissions.canReadInvoice = true;

        // Create operational
        permissions.canCreateClient = true;
        permissions.canCreateProcedure = true;
        permissions.canCreateStep = true;
        permissions.canCreateClientProcedure = true;
        permissions.canCreateClientStep = true;
        permissions.canCreateClientDocument = true;
        permissions.canCreateTransaction = true;

        // Edit operational
        permissions.canEditClient = true;
        permissions.canEditProcedure = true;
        permissions.canEditStep = true;
        permissions.canEditClientProcedure = true;
        permissions.canEditClientStep = true;
        permissions.canEditClientDocument = true;

        // No critical deletes
        break;

      case "COMPTABLE":
        // Read all
        permissions.canReadOrganization = true;
        permissions.canReadClient = true;
        permissions.canReadProcedure = true;
        permissions.canReadClientProcedure = true;
        permissions.canReadTransaction = true;
        permissions.canReadExpense = true;
        permissions.canReadRevenue = true;
        permissions.canReadInvoice = true;
        permissions.canReadComptaSettings = true;

        // Full CRUD on financial
        permissions.canCreateTransaction = true;
        permissions.canCreateExpense = true;
        permissions.canCreateRevenue = true;
        permissions.canCreateInvoice = true;
        permissions.canCreateComptaSettings = true;

        permissions.canEditTransaction = true;
        permissions.canEditExpense = true;
        permissions.canEditRevenue = true;
        permissions.canEditInvoice = true;
        permissions.canEditComptaSettings = true;

        permissions.canDeleteTransaction = true;
        permissions.canDeleteExpense = true;
        permissions.canDeleteRevenue = true;
        permissions.canDeleteInvoice = true;
        break;

      case "ASSISTANT":
      case "ASSISTANT_ADMIN":
        // Read operational
        permissions.canReadOrganization = true;
        permissions.canReadClient = true;
        permissions.canReadProcedure = true;
        permissions.canReadStep = true;
        permissions.canReadClientProcedure = true;
        permissions.canReadClientStep = true;
        permissions.canReadClientDocument = true;

        // Create clients and procedures
        permissions.canCreateClient = true;
        permissions.canCreateClientProcedure = true;
        permissions.canCreateClientStep = true;
        permissions.canCreateClientDocument = true;

        // Edit
        permissions.canEditClient = true;
        permissions.canEditClientProcedure = true;
        permissions.canEditClientStep = true;
        permissions.canEditClientDocument = true;

        // Limited delete
        permissions.canDeleteClientDocument = true;
        break;

      case "CONSULTANT":
      case "VIEWER":
        // Read only (except admin data)
        permissions.canReadOrganization = true;
        permissions.canReadClient = true;
        permissions.canReadProcedure = true;
        permissions.canReadStep = true;
        permissions.canReadClientProcedure = true;
        permissions.canReadClientStep = true;
        permissions.canReadClientDocument = true;
        permissions.canReadTransaction = true;
        permissions.canReadExpense = true;
        permissions.canReadRevenue = true;
        permissions.canReadInvoice = true;
        permissions.canReadComptaSettings = true;
        break;

      case "OPERATEUR":
        // Read assigned procedures
        permissions.canReadProcedure = true;
        permissions.canReadStep = true;
        permissions.canReadClientProcedure = true;
        permissions.canReadClientStep = true;
        permissions.canReadClientDocument = true;

        // Update client steps
        permissions.canEditClientStep = true;

        // Add documents
        permissions.canCreateClientDocument = true;
        break;

      default:
        return null;
    }

    return permissions as AuthorizationData;
  }

  /**
   * Liste tous les templates de rôles disponibles
   */
  listRoleTemplates() {
    return [
      {
        name: "ADMIN_COMPLET",
        displayName: "Administrateur complet",
        description: "Accès total à toutes les fonctionnalités"
      },
      {
        name: "MANAGER",
        displayName: "Gestionnaire",
        description: "Gestion opérationnelle sans suppressions critiques"
      },
      {
        name: "COMPTABLE",
        displayName: "Comptable",
        description: "Accès financier complet, lecture des autres données"
      },
      {
        name: "ASSISTANT",
        displayName: "Assistant administratif",
        description: "Gestion des clients et dossiers, pas de finances"
      },
      {
        name: "CONSULTANT",
        displayName: "Consultant",
        description: "Lecture seule pour analyse et reporting"
      },
      {
        name: "OPERATEUR",
        displayName: "Opérateur de procédures",
        description: "Traitement des dossiers clients assignés"
      }
    ];
  }

  /**
   * Vérifie si un utilisateur a une autorisation spécifique
   */
  async checkUserPermission(userId: string, permission: keyof AuthorizationData): Promise<boolean> {
    try {
      const organizationId = await this.getOrganizationId();
      
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
          organizationId,
        },
        include: {
          authorize: true,
        },
      });

      if (!user || !user.authorize) {
        return false;
      }

      return Boolean(user.authorize[permission]);
    } catch (error) {
      console.error("Erreur lors de la vérification des autorisations:", error);
      return false;
    }
  }

  /**
   * Récupère tous les utilisateurs avec leurs autorisations
   */
  async getAllUsersWithAuthorization() {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.user.findMany({
        where: { organizationId },
        include: {
          authorize: true,
          admin: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getAllUsersWithAuthorization");
    }
  }
} 