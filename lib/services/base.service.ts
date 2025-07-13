import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Récupère l'ID de l'organisation de l'utilisateur connecté
   */
  protected async getOrganizationId(): Promise<string> {
    const user = await auth.api.getSession({
      headers: await headers(),
    });
    return user?.userDetails?.organizationId ?? "";
  }

  /**
   * Récupère l'utilisateur connecté avec ses détails
   */
  protected async getCurrentUser() {
    const user = await auth.api.getSession({
      headers: await headers(),
    });
    return user;
  }

  /**
   * Vérifie si l'utilisateur a une autorisation spécifique
   */
  protected async checkPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    const authorization = user?.userDetails?.authorize?.[permission as keyof typeof user.userDetails.authorize];
    return Boolean(authorization);
  }

  /**
   * Valide que l'utilisateur appartient à l'organisation
   */
  protected async validateOrganizationAccess(organizationId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.userDetails?.organizationId === organizationId;
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
    
    throw new Error('Une erreur est survenue lors de l\'opération');
  }

  /**
   * Méthode pour nettoyer les ressources
   */
  async dispose(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 