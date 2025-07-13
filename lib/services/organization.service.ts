import { BaseService } from "./base.service";

export interface OrganizationData {
  name: string;
  description?: string;
  logo?: string;
  slug?: string;
}

export interface ComptaSettingsData {
  fiscalYear: Date;
  taxIdentification?: string;
  currency: string;
  defaultTaxRate?: number;
  invoicePrefix?: string;
  invoiceNumberFormat?: string;
}

export interface UpdateOrganizationData extends OrganizationData {
  id: string;
}

export class OrganizationService extends BaseService {
  /**
   * Récupère les informations de l'organisation actuelle
   */
  async getCurrentOrganization() {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      return await this.prisma.organization.findUnique({
        where: { id: organizationId },
        include: {
          comptaSettings: true,
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getCurrentOrganization");
    }
  }

  /**
   * Met à jour les informations de l'organisation
   */
  async updateOrganization(data: UpdateOrganizationData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canEdit = await this.checkPermission("canEditOrganization");
      if (!canEdit) {
        throw new Error("Vous n'êtes pas autorisé à modifier cette organisation");
      }

      // Vérifier que l'organisation appartient à l'utilisateur
      if (data.id !== organizationId) {
        throw new Error("Organisation introuvable ou accès non autorisé");
      }

      // Mettre à jour l'organisation
      const updatedOrganization = await this.prisma.organization.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          logo: data.logo,
          slug: data.slug,
        },
        include: {
          comptaSettings: true,
        },
      });

      return updatedOrganization;
    } catch (error) {
      this.handleDatabaseError(error, "updateOrganization");
    }
  }

  /**
   * Récupère les paramètres comptables de l'organisation
   */
  async getComptaSettings() {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      return await this.prisma.comptaSettings.findUnique({
        where: { organizationId },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getComptaSettings");
    }
  }

  /**
   * Met à jour ou crée les paramètres comptables
   */
  async updateComptaSettings(data: ComptaSettingsData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canEdit = await this.checkPermission("canEditOrganization");
      if (!canEdit) {
        throw new Error("Vous n'êtes pas autorisé à modifier les paramètres comptables");
      }

      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      // Vérifier si les paramètres existent déjà
      const existingSettings = await this.prisma.comptaSettings.findUnique({
        where: { organizationId },
      });

      if (existingSettings) {
        // Mettre à jour les paramètres existants
        return await this.prisma.comptaSettings.update({
          where: { organizationId },
          data: {
            fiscalYear: data.fiscalYear,
            taxIdentification: data.taxIdentification,
            currency: data.currency,
            defaultTaxRate: data.defaultTaxRate,
            invoicePrefix: data.invoicePrefix,
            invoiceNumberFormat: data.invoiceNumberFormat,
          },
        });
      } else {
        // Créer de nouveaux paramètres
        return await this.prisma.comptaSettings.create({
          data: {
            fiscalYear: data.fiscalYear,
            taxIdentification: data.taxIdentification,
            currency: data.currency,
            defaultTaxRate: data.defaultTaxRate,
            invoicePrefix: data.invoicePrefix,
            invoiceNumberFormat: data.invoiceNumberFormat,
            organizationId,
          },
        });
      }
    } catch (error) {
      this.handleDatabaseError(error, "updateComptaSettings");
    }
  }

  /**
   * Récupère les statistiques de l'organisation
   */
  async getOrganizationStats() {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      // Récupérer les statistiques en parallèle
      const [
        totalClients,
        totalEmployees,
        totalProcedures,
        totalTransactions,
        activeProcedures,
        completedProcedures,
      ] = await Promise.all([
        this.prisma.client.count({ where: { organizationId } }),
        this.prisma.admin.count({ where: { organizationId } }),
        this.prisma.procedure.count({ where: { organizationId } }),
        this.prisma.transaction.count({ where: { organizationId } }),
        this.prisma.clientProcedure.count({
          where: {
            organizationId,
            status: "IN_PROGRESS",
          },
        }),
        this.prisma.clientProcedure.count({
          where: {
            organizationId,
            status: "COMPLETED",
          },
        }),
      ]);

      return {
        totalClients,
        totalEmployees,
        totalProcedures,
        totalTransactions,
        activeProcedures,
        completedProcedures,
      };
    } catch (error) {
      this.handleDatabaseError(error, "getOrganizationStats");
    }
  }

  /**
   * Vérifie si l'organisation est active
   */
  async isOrganizationActive() {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        return false;
      }

      const organization = await this.prisma.organization.findUnique({
        where: { id: organizationId },
        select: { active: true },
      });

      return organization?.active || false;
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de l'organisation:", error);
      return false;
    }
  }

  /**
   * Récupère les informations de base de l'organisation
   */
  async getOrganizationInfo() {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      return await this.prisma.organization.findUnique({
        where: { id: organizationId },
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          slug: true,
          active: true,
          createdAt: true,
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getOrganizationInfo");
    }
  }
} 