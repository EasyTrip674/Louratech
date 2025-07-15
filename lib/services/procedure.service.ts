import { BaseService } from "./base.service";
import { ProcedureStatus } from "@prisma/client";

export interface CreateProcedureData {
  name: string;
  description?: string;
}

export interface UpdateProcedureData {
  id: string;
  name: string;
  description?: string;
}

export interface CreateStepData {
  name: string;
  description?: string;
  price?: number;
  procedureId: string;
  order?: number;
  required?: boolean;
  estimatedDuration?: number;
}

export interface UpdateStepData {
  id: string;
  name: string;
  description?: string;
  price?: number;
  required?: boolean;
  estimatedDuration?: number;
}

export class ProcedureService extends BaseService {
  /**
   * Crée une nouvelle procédure
   */
  async createProcedure(data: CreateProcedureData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      // Vérifier les autorisations
      const canCreate = await this.checkPermission("canCreateProcedure");
      if (!canCreate) {
        throw new Error("Vous n'êtes pas autorisé à créer une procédure");
      }

      // Vérifier l'existence de la procédure
      const existingProcedure = await this.prisma.procedure.findFirst({
        where: {
          name: data.name,
          organizationId,
        }
      });

      if (existingProcedure) {
        throw new Error("Une procédure avec ce nom existe déjà");
      }

      // Créer la procédure
      const procedure = await this.prisma.procedure.create({
        data: {
          name: data.name,
          description: data.description || "",
          organizationId,
        },
        include: {
          steps: {
            orderBy: {
              order: "asc",
            },
          },
          _count: {
            select: {
              steps: true,
              clientProcedures: true,
            },
          },
        },
      });

      // Créer une catégorie pour la procédure
      await this.prisma.category.create({
        data: {
          name: data.name,
          type: "REVENUE",
          description: `Catégorie de transaction pour la procédure : ${data.name}`,
          organizationId,
        },
      });

      return procedure;
    } catch (error) {
      this.handleDatabaseError(error, "createProcedure");
    }
  }

  /**
   * Met à jour une procédure
   */
  async updateProcedure(data: UpdateProcedureData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canEdit = await this.checkPermission("canEditProcedure");
      if (!canEdit) {
        throw new Error("Vous n'êtes pas autorisé à modifier cette procédure");
      }

      // Vérifier que la procédure appartient à l'organisation
      const existingProcedure = await this.prisma.procedure.findUnique({
        where: { id: data.id },
        include: { organization: true }
      });

      if (!existingProcedure || existingProcedure.organizationId !== organizationId) {
        throw new Error("Procédure introuvable ou accès non autorisé");
      }

      // Mettre à jour la procédure
      const updatedProcedure = await this.prisma.procedure.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description || "",
        },
        include: {
          steps: {
            orderBy: {
              order: "asc",
            },
          },
          _count: {
            select: {
              steps: true,
              clientProcedures: true,
            },
          },
        },
      });

      return updatedProcedure;
    } catch (error) {
      this.handleDatabaseError(error, "updateProcedure");
    }
  }

  /**
   * Supprime une procédure
   */
  async deleteProcedure(procedureId: string, deleteTransaction: boolean) {
    try {
      const organizationId = await this.getOrganizationId();
      // Vérifier les autorisations
      const canDelete = await this.checkPermission("canDeleteProcedure");
      if (!canDelete) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cette procédure");
      }
      // Vérifier que la procédure appartient à l'organisation
      const procedure = await this.prisma.procedure.findUnique({
        where: { id: procedureId },
        include: {
          organization: true,
          clientProcedures: true,
          steps: true,
          transactions: true,
          invoiceItems: true,
        },
      });
      if (!procedure || procedure.organizationId !== organizationId) {
        throw new Error("Procédure introuvable ou accès non autorisé");
      }
      // Vérifier s'il y a des procédures client actives
      const activeClientProcedures = procedure.clientProcedures.filter(
        cp => cp.status === ProcedureStatus.IN_PROGRESS
      );
      if (activeClientProcedures.length > 0) {
        throw new Error("Impossible de supprimer cette procédure car elle a des clients actifs");
      }
      // Supprimer toutes les associations et gérer les transactions
      await this.prisma.$transaction(async (tx) => {
        // Supprimer les étapes (et leurs associations)
        await tx.stepProcedure.deleteMany({ where: { procedureId } });
        // Supprimer les clientProcedures (et leurs associations)
        await tx.clientProcedure.deleteMany({ where: { procedureId } });
        // Supprimer les invoiceItems liés à la procédure
        await tx.invoiceItem.deleteMany({ where: { procedureId } });
        // Gérer les transactions liées à la procédure
        if (deleteTransaction) {
          await tx.transaction.deleteMany({ where: { procedureId } });
        } else {
          await tx.transaction.updateMany({
            where: { procedureId },
            data: { procedureId: null },
          });
        }
        // Supprimer la procédure
        await tx.procedure.delete({ where: { id: procedureId } });
      });
      return { success: true };
    } catch (error) {
      this.handleDatabaseError(error, "deleteProcedure");
    }
  }

  /**
   * Crée une nouvelle étape
   */
  async createStep(data: CreateStepData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canCreate = await this.checkPermission("canCreateStep");
      if (!canCreate) {
        throw new Error("Vous n'êtes pas autorisé à créer une étape");
      }

      // Vérifier que la procédure appartient à l'organisation
      const procedure = await this.prisma.procedure.findUnique({
        where: {
          id: data.procedureId,
          organizationId,
        }
      });

      if (!procedure) {
        throw new Error("Procédure introuvable ou accès non autorisé");
      }

      // Vérifier l'existence de l'étape
      const existingStep = await this.prisma.stepProcedure.findFirst({
        where: {
          name: data.name,
          procedureId: data.procedureId,
        }
      });

      if (existingStep) {
        throw new Error("Une étape avec ce nom existe déjà dans cette procédure");
      }

      // Déterminer l'ordre de l'étape
      const lastStep = await this.prisma.stepProcedure.findFirst({
        where: { procedureId: data.procedureId },
        orderBy: { order: "desc" }
      });

      const order = data.order || (lastStep ? lastStep.order + 1 : 1);

      // Créer l'étape
      const step = await this.prisma.stepProcedure.create({
        data: {
          name: data.name,
          description: data.description || "",
          price: data.price,
          order,
          required: data.required ?? true,
          estimatedDuration: data.estimatedDuration,
          procedureId: data.procedureId,
        },
        include: {
          procedure: true,
        },
      });

      return step;
    } catch (error) {
      this.handleDatabaseError(error, "createStep");
    }
  }

  /**
   * Met à jour une étape
   */
  async updateStep(data: UpdateStepData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canEdit = await this.checkPermission("canEditStep");
      if (!canEdit) {
        throw new Error("Vous n'êtes pas autorisé à modifier cette étape");
      }

      // Vérifier que l'étape appartient à une procédure de l'organisation
      const step = await this.prisma.stepProcedure.findUnique({
        where: { id: data.id },
        include: {
          procedure: {
            select: { organizationId: true }
          }
        }
      });

      if (!step || step.procedure.organizationId !== organizationId) {
        throw new Error("Étape introuvable ou accès non autorisé");
      }

      // Mettre à jour l'étape
      const updatedStep = await this.prisma.stepProcedure.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description || "",
          price: data.price,
          required: data.required ?? true,
          estimatedDuration: data.estimatedDuration,
        },
        include: {
          procedure: true,
        },
      });

      return updatedStep;
    } catch (error) {
      this.handleDatabaseError(error, "updateStep");
    }
  }

  /**
   * Supprime une étape
   */
  async deleteStep(stepId: string, deleteTransaction: boolean) {
    try {
      const organizationId = await this.getOrganizationId();
      // Vérifier les autorisations
      const canDelete = await this.checkPermission("canDeleteStep");
      if (!canDelete) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cette étape");
      }
      // Vérifier que l'étape appartient à une procédure de l'organisation
      const step = await this.prisma.stepProcedure.findUnique({
        where: { id: stepId },
        include: {
          procedure: { select: { organizationId: true } },
          clientSteps: true,
          transactions: true,
        },
      });
      if (!step || step.procedure.organizationId !== organizationId) {
        throw new Error("Étape introuvable ou accès non autorisé");
      }
      // Vérifier s'il y a des étapes client actives
      const activeClientSteps = step.clientSteps.filter(
        cs => cs.status === "IN_PROGRESS"
      );
      if (activeClientSteps.length > 0) {
        throw new Error("Impossible de supprimer cette étape car elle a des clients actifs");
      }
      // Supprimer toutes les associations et gérer les transactions
      await this.prisma.$transaction(async (tx) => {
        // Supprimer les clientSteps liés à cette étape
        await tx.clientStep.deleteMany({ where: { stepId } });
        // Gérer les transactions liées à l'étape
        if (deleteTransaction) {
          await tx.transaction.deleteMany({ where: { stepId } });
        } else {
          await tx.transaction.updateMany({
            where: { stepId },
            data: { stepId: null },
          });
        }
        // Supprimer l'étape
        await tx.stepProcedure.delete({ where: { id: stepId } });
      });
      return { success: true };
    } catch (error) {
      this.handleDatabaseError(error, "deleteStep");
    }
  }

  /**
   * Récupère toutes les procédures de l'organisation
   */
  async getAllProcedures() {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.procedure.findMany({
        where: { organizationId },
        include: {
          _count: {
            select: {
              steps: true,
              clientProcedures: true,
            },
          },
          steps: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getAllProcedures");
    }
  }

  /**
   * Récupère une procédure par son ID
   */
  async getProcedureById(procedureId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.procedure.findUnique({
        where: {
          id: procedureId,
          organizationId,
        },
        include: {
          steps: {
            orderBy: {
              order: "asc",
            },
          },
          clientProcedures: {
            include: {
              client: true
            },
          },
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getProcedureById");
    }
  }

  /**
   * Récupère les procédures avec leurs statistiques
   */
  async getProceduresWithStats() {
    try {
      const organizationId = await this.getOrganizationId();
      
      const procedures = await this.prisma.procedure.findMany({
        where: { organizationId },
        include: {
          clientProcedures: true,
        },
      });

      return procedures.map(proc => {
        const clientProcedures = proc.clientProcedures;
        const totalClients = clientProcedures.length;
        const inProgress = clientProcedures.filter(
          cp => cp.status === ProcedureStatus.IN_PROGRESS
        ).length;
        const completed = clientProcedures.filter(
          cp => cp.status === ProcedureStatus.COMPLETED
        ).length;
        const failed = clientProcedures.filter(
          cp =>
            cp.status === ProcedureStatus.CANCELLED ||
            cp.status === ProcedureStatus.FAILED
        ).length;

        return {
          id: proc.id,
          title: proc.name,
          totalClients,
          description: proc.description,
          change: Math.random() * 20 - 10, // Mock data
          inProgress,
          completed,
          failed,
          timeframe: "Ce mois-ci",
        };
      });
    } catch (error) {
      this.handleDatabaseError(error, "getProceduresWithStats");
    }
  }
} 