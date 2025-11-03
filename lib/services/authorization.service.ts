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
   * Met à jour les autorisations d'un utilisateur
   */
  async updateUserAuthorization(userId: string, authorizationId: string, data: PartialAuthorizationData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canManageAuth = await this.checkPermission("canChangeUserAuthorization");
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
    // Initialiser toutes les permissions à false
    const basePermissions: AuthorizationData = {
      canChangeUserAuthorization: false,
      canChangeUserPassword: false,
      canCreateOrganization: false,
      canCreateStep: false,
      canCreateClient: false,
      canCreateProcedure: false,
      canCreateTransaction: false,
      canCreateAdmin: false,
      canCreateInvoice: false,
      canCreateExpense: false,
      canCreateRevenue: false,
      canCreateComptaSettings: false,
      canCreateClientProcedure: false,
      canCreateClientStep: false,
      canCreateClientDocument: false,
      canReadOrganization: false,
      canReadStep: false,
      canReadClient: false,
      canReadProcedure: false,
      canReadTransaction: false,
      canReadInvoice: false,
      canReadExpense: false,
      canReadRevenue: false,
      canReadComptaSettings: false,
      canReadAdmin: false,
      canReadClientProcedure: false,
      canReadClientStep: false,
      canReadClientDocument: false,
      canEditOrganization: false,
      canEditStep: false,
      canEditClient: false,
      canEditProcedure: false,
      canEditTransaction: false,
      canEditInvoice: false,
      canEditExpense: false,
      canEditRevenue: false,
      canEditComptaSettings: false,
      canEditAdmin: false,
      canEditClientProcedure: false,
      canEditClientStep: false,
      canEditClientDocument: false,
      canDeleteOrganization: false,
      canDeleteStep: false,
      canDeleteClient: false,
      canDeleteProcedure: false,
      canDeleteTransaction: false,
      canDeleteInvoice: false,
      canDeleteExpense: false,
      canDeleteRevenue: false,
      canDeleteComptaSettings: false,
      canDeleteAdmin: false,
      canDeleteClientProcedure: false,
      canDeleteClientStep: false,
      canDeleteClientDocument: false,
    };

    switch (role) {
      case "ADMIN":
        // Admin a toutes les permissions
        return {
          canChangeUserAuthorization: true,
          canChangeUserPassword: true,
          canCreateOrganization: true,
          canCreateStep: true,
          canCreateClient: true,
          canCreateProcedure: true,
          canCreateTransaction: true,
          canCreateAdmin: true,
          canCreateInvoice: true,
          canCreateExpense: true,
          canCreateRevenue: true,
          canCreateComptaSettings: true,
          canCreateClientProcedure: true,
          canCreateClientStep: true,
          canCreateClientDocument: true,
          canReadOrganization: true,
          canReadStep: true,
          canReadClient: true,
          canReadProcedure: true,
          canReadTransaction: true,
          canReadInvoice: true,
          canReadExpense: true,
          canReadRevenue: true,
          canReadComptaSettings: true,
          canReadAdmin: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canEditOrganization: true,
          canEditStep: true,
          canEditClient: true,
          canEditProcedure: true,
          canEditTransaction: true,
          canEditInvoice: true,
          canEditExpense: true,
          canEditRevenue: true,
          canEditComptaSettings: true,
          canEditAdmin: true,
          canEditClientProcedure: true,
          canEditClientStep: true,
          canEditClientDocument: true,
          canDeleteOrganization: true,
          canDeleteStep: true,
          canDeleteClient: true,
          canDeleteProcedure: true,
          canDeleteTransaction: true,
          canDeleteInvoice: true,
          canDeleteExpense: true,
          canDeleteRevenue: true,
          canDeleteComptaSettings: true,
          canDeleteAdmin: true,
          canDeleteClientProcedure: true,
          canDeleteClientStep: true,
          canDeleteClientDocument: true,
        };

      case "USER":
        // User a des permissions de lecture et quelques créations
        return {
          ...basePermissions,
          canReadOrganization: true,
          canReadClient: true,
          canReadProcedure: true,
          canReadStep: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canCreateClient: true,
          canEditClient: true,
          canCreateClientProcedure: true,
          canEditClientProcedure: true,
          canCreateClientStep: true,
          canEditClientStep: true,
          canCreateClientDocument: true,
        };

      case "EMPLOYEE":
        // Employee a des permissions limitées aux procédures assignées
        return {
          ...basePermissions,
          canReadProcedure: true,
          canReadStep: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canEditClientStep: true,
          canCreateClientDocument: true,
        };

      case "CLIENT":
        // Client a accès uniquement à ses propres dossiers
        return {
          ...basePermissions,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
        };

      default:
        // Par défaut, aucune permission
        return basePermissions;
    }
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
    // Permissions de base (toutes à false)
    const basePermissions: AuthorizationData = {
      canChangeUserAuthorization: false,
      canChangeUserPassword: false,
      canCreateOrganization: false,
      canCreateStep: false,
      canCreateClient: false,
      canCreateProcedure: false,
      canCreateTransaction: false,
      canCreateAdmin: false,
      canCreateInvoice: false,
      canCreateExpense: false,
      canCreateRevenue: false,
      canCreateComptaSettings: false,
      canCreateClientProcedure: false,
      canCreateClientStep: false,
      canCreateClientDocument: false,
      canReadOrganization: false,
      canReadStep: false,
      canReadClient: false,
      canReadProcedure: false,
      canReadTransaction: false,
      canReadInvoice: false,
      canReadExpense: false,
      canReadRevenue: false,
      canReadComptaSettings: false,
      canReadAdmin: false,
      canReadClientProcedure: false,
      canReadClientStep: false,
      canReadClientDocument: false,
      canEditOrganization: false,
      canEditStep: false,
      canEditClient: false,
      canEditProcedure: false,
      canEditTransaction: false,
      canEditInvoice: false,
      canEditExpense: false,
      canEditRevenue: false,
      canEditComptaSettings: false,
      canEditAdmin: false,
      canEditClientProcedure: false,
      canEditClientStep: false,
      canEditClientDocument: false,
      canDeleteOrganization: false,
      canDeleteStep: false,
      canDeleteClient: false,
      canDeleteProcedure: false,
      canDeleteTransaction: false,
      canDeleteInvoice: false,
      canDeleteExpense: false,
      canDeleteRevenue: false,
      canDeleteComptaSettings: false,
      canDeleteAdmin: false,
      canDeleteClientProcedure: false,
      canDeleteClientStep: false,
      canDeleteClientDocument: false,
    };

    switch (templateName.toUpperCase()) {
      case "ADMIN_COMPLET":
      case "ADMINISTRATEUR":
        // Toutes les permissions
        return {
          canChangeUserAuthorization: true,
          canChangeUserPassword: true,
          canCreateOrganization: true,
          canCreateStep: true,
          canCreateClient: true,
          canCreateProcedure: true,
          canCreateTransaction: true,
          canCreateAdmin: true,
          canCreateInvoice: true,
          canCreateExpense: true,
          canCreateRevenue: true,
          canCreateComptaSettings: true,
          canCreateClientProcedure: true,
          canCreateClientStep: true,
          canCreateClientDocument: true,
          canReadOrganization: true,
          canReadStep: true,
          canReadClient: true,
          canReadProcedure: true,
          canReadTransaction: true,
          canReadInvoice: true,
          canReadExpense: true,
          canReadRevenue: true,
          canReadComptaSettings: true,
          canReadAdmin: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canEditOrganization: true,
          canEditStep: true,
          canEditClient: true,
          canEditProcedure: true,
          canEditTransaction: true,
          canEditInvoice: true,
          canEditExpense: true,
          canEditRevenue: true,
          canEditComptaSettings: true,
          canEditAdmin: true,
          canEditClientProcedure: true,
          canEditClientStep: true,
          canEditClientDocument: true,
          canDeleteOrganization: true,
          canDeleteStep: true,
          canDeleteClient: true,
          canDeleteProcedure: true,
          canDeleteTransaction: true,
          canDeleteInvoice: true,
          canDeleteExpense: true,
          canDeleteRevenue: true,
          canDeleteComptaSettings: true,
          canDeleteAdmin: true,
          canDeleteClientProcedure: true,
          canDeleteClientStep: true,
          canDeleteClientDocument: true,
        };

      case "MANAGER":
      case "GESTIONNAIRE":
        // Gestion opérationnelle sans suppressions critiques
        return {
          ...basePermissions,
          canReadOrganization: true,
          canReadClient: true,
          canReadProcedure: true,
          canReadStep: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canReadTransaction: true,
          canReadExpense: true,
          canReadRevenue: true,
          canReadInvoice: true,
          canCreateClient: true,
          canCreateProcedure: true,
          canCreateStep: true,
          canCreateClientProcedure: true,
          canCreateClientStep: true,
          canCreateClientDocument: true,
          canCreateTransaction: true,
          canEditClient: true,
          canEditProcedure: true,
          canEditStep: true,
          canEditClientProcedure: true,
          canEditClientStep: true,
          canEditClientDocument: true,
        };

      case "COMPTABLE":
        // Accès financier complet
        return {
          ...basePermissions,
          canReadOrganization: true,
          canReadClient: true,
          canReadProcedure: true,
          canReadClientProcedure: true,
          canReadTransaction: true,
          canReadExpense: true,
          canReadRevenue: true,
          canReadInvoice: true,
          canReadComptaSettings: true,
          canCreateTransaction: true,
          canCreateExpense: true,
          canCreateRevenue: true,
          canCreateInvoice: true,
          canCreateComptaSettings: true,
          canEditTransaction: true,
          canEditExpense: true,
          canEditRevenue: true,
          canEditInvoice: true,
          canEditComptaSettings: true,
          canDeleteTransaction: true,
          canDeleteExpense: true,
          canDeleteRevenue: true,
          canDeleteInvoice: true,
        };

      case "ASSISTANT":
      case "ASSISTANT_ADMIN":
        // Gestion des clients et dossiers
        return {
          ...basePermissions,
          canReadOrganization: true,
          canReadClient: true,
          canReadProcedure: true,
          canReadStep: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canCreateClient: true,
          canCreateClientProcedure: true,
          canCreateClientStep: true,
          canCreateClientDocument: true,
          canEditClient: true,
          canEditClientProcedure: true,
          canEditClientStep: true,
          canEditClientDocument: true,
          canDeleteClientDocument: true,
        };

      case "CONSULTANT":
      case "VIEWER":
        // Lecture seule
        return {
          ...basePermissions,
          canReadOrganization: true,
          canReadClient: true,
          canReadProcedure: true,
          canReadStep: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canReadTransaction: true,
          canReadExpense: true,
          canReadRevenue: true,
          canReadInvoice: true,
          canReadComptaSettings: true,
        };

      case "OPERATEUR":
        // Traitement des dossiers assignés
        return {
          ...basePermissions,
          canReadProcedure: true,
          canReadStep: true,
          canReadClientProcedure: true,
          canReadClientStep: true,
          canReadClientDocument: true,
          canEditClientStep: true,
          canCreateClientDocument: true,
        };

      default:
        return null;
    }
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