import { BaseService } from "./base.service";

export interface AuthorizationData {
  canCreateClient: boolean;
  canEditClient: boolean;
  canDeleteClient: boolean;
  canCreateAdmin: boolean;
  canEditAdmin: boolean;
  canDeleteAdmin: boolean;
  canCreateProcedure: boolean;
  canEditProcedure: boolean;
  canDeleteProcedure: boolean;
  canCreateStep: boolean;
  canEditStep: boolean;
  canDeleteStep: boolean;
  canCreateRevenue: boolean;
  canEditRevenue: boolean;
  canDeleteRevenue: boolean;
  canCreateExpense: boolean;
  canEditExpense: boolean;
  canDeleteExpense: boolean;
  canCreateTransaction: boolean;
  canEditTransaction: boolean;
  canDeleteTransaction: boolean;
  canReadTransaction: boolean;
}

export class AuthorizationService extends BaseService {
  /**
   * Met à jour les autorisations d'un utilisateur
   */
  async updateUserAuthorization(userId: string, authorizationId: string, data: AuthorizationData) {
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
      const defaultAuth: AuthorizationData = {
        canCreateClient: user.role === "ADMIN",
        canEditClient: user.role === "ADMIN",
        canDeleteClient: user.role === "ADMIN",
        canCreateAdmin: user.role === "ADMIN",
        canEditAdmin: user.role === "ADMIN",
        canDeleteAdmin: user.role === "ADMIN",
        canCreateProcedure: user.role === "ADMIN",
        canEditProcedure: user.role === "ADMIN",
        canDeleteProcedure: user.role === "ADMIN",
        canCreateStep: user.role === "ADMIN",
        canEditStep: user.role === "ADMIN",
        canDeleteStep: user.role === "ADMIN",
        canCreateRevenue: user.role === "ADMIN",
        canEditRevenue: user.role === "ADMIN",
        canDeleteRevenue: user.role === "ADMIN",
        canCreateExpense: user.role === "ADMIN",
        canEditExpense: user.role === "ADMIN",
        canDeleteExpense: user.role === "ADMIN",
        canCreateTransaction: user.role === "ADMIN",
        canEditTransaction: user.role === "ADMIN",
        canDeleteTransaction: user.role === "ADMIN",
        canReadTransaction: user.role === "ADMIN",
      };

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