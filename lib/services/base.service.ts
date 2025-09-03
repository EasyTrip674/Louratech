import { PrismaClient } from "@prisma/client";
import useAuth from "../BackendConfig/useAuth";

export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Récupère l'ID de l'organisation de l'utilisateur connecté
   */
  protected async getOrganizationId(): Promise<string> {
    const s = useAuth()
    return s.user?.organization.id ?? "";
  }

  /**
   * Récupère l'utilisateur connecté avec ses détails
   */
  protected async getCurrentUser() {
    const s = useAuth()
    return s.user;
  }

  /**
   * Vérifie si l'utilisateur a une autorisation spécifique
   */
  protected async checkPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    const authorization = user?.authorization?.[permission as keyof typeof user.authorization];
    return Boolean(authorization);
  }

  /**
   * Valide que l'utilisateur appartient à l'organisation
   */
  protected async validateOrganizationAccess(organizationId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.organization.id === organizationId;
  }

  /**
   * Méthode utilitaire pour gérer les erreurs de base de données
   */
  protected handleDatabaseError(error: unknown, context: string): never {
    console.error(`Database error in ${context}:`, error);
    
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const dbError = error as { code: string };
      
      if (dbError.code === 'P2002') {
        throw new Error('Un enregistrement avec ces données existe déjà');
      }
      
      if (dbError.code === 'P2025') {
        throw new Error('Enregistrement introuvable');
      }
    }
    
    throw new Error(`Une erreur est survenue lors de l\'opération ${error}`);
  }

  /**
   * Méthode pour nettoyer les ressources
   */
  async dispose(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 