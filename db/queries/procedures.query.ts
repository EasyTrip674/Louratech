import { Prisma, ProcedureStatus, StepStatus } from "@prisma/client";
import prisma from "../prisma";

// ===== PROCEDURE QUERIES =====
export const getAllProcedures = async (organizationId?: string) => {
  return await prisma.procedure.findMany({
    where: organizationId ? { organizationId } : undefined,
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
};

export const getProcedureById = async (id: string) => {
  return await prisma.procedure.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: {
          order: "asc",
        },
      },
      clientProcedures: {
        include: {
          client: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
};

export const getProcedureWithStats = async () => {
  const procedures = await prisma.procedure.findMany({
    include: {
      clientProcedures: true,
    },
  });

  const proceduresFinal = await Promise.all(
    procedures.map(async (proc) => {
      const clientProcedures = proc.clientProcedures;
      const totalClients = clientProcedures.length;
      const inProgress = clientProcedures.filter(
        (cp) => cp.status === ProcedureStatus.IN_PROGRESS
      ).length;
      const completed = clientProcedures.filter(
        (cp) => cp.status === ProcedureStatus.COMPLETED
      ).length;
      const failed = clientProcedures.filter(
        (cp) =>
          cp.status === ProcedureStatus.CANCELLED ||
          cp.status === ProcedureStatus.REJECTED
      ).length;

      // Calculate change compared to previous month (mock data, replace with actual calculation)
      const change = Math.random() * 20 - 10; // Random -10% to +10% change

      return {
        id: proc.id,
        title: proc.name,
        totalClients,
        change,
        inProgress,
        completed,
        failed,
        timeframe: "Ce mois-ci",
      };
    })
  );

  return proceduresFinal;
};

export const getActiveProcedures = async (organizationId?: string) => {
  return await prisma.procedure.findMany({
    where: {
      isActive: true,
      organizationId: organizationId ? organizationId : undefined,
    },
    include: {
      steps: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};




export async function getProcedureDetails(id: string) {
  try {
    // Récupération de la procédure avec ses étapes
    const procedure = await prisma.procedure.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!procedure) {
      return null;
    }

    // Récupération de toutes les procédures client liées à cette procédure
    const clientProcedures = await prisma.clientProcedure.findMany({
      where: {
        procedureId: id,
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                active: true,
              },
            },
          },
        },
        steps: {
          select: {
            id: true,
            status: true,
            startDate: true,
            completionDate: true,
          },
          orderBy: {
            step: {
              order: 'asc',
            },
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
          },
        },
      },
    });

    // Calcul des statistiques
    const totalClients = clientProcedures.length;
    const inProgressCount = clientProcedures.filter(cp => cp.status === 'IN_PROGRESS').length;
    const completedCount = clientProcedures.filter(cp => cp.status === 'COMPLETED').length;
    const cancelledCount = clientProcedures.filter(cp => cp.status === 'CANCELLED').length;

    // Calcul des revenus
    const totalRevenue = clientProcedures.reduce((sum, cp) => {
      return sum + (cp.invoice?.totalAmount || 0);
    }, 0);

    const pendingRevenue = clientProcedures.reduce((sum, cp) => {
      // On considère comme "pending" tous les revenus de factures qui ne sont pas "PAID"
      if (cp.invoice && cp.invoice.status !== 'PAID') {
        return sum + cp.invoice.totalAmount;
      }
      return sum;
    }, 0);

    // Calcul du pourcentage de progression pour chaque procédure client
    const clientProceduresWithProgress = clientProcedures.map(cp => {
      const totalSteps = cp.steps.length;
      const completedSteps = cp.steps.filter(step => 
        step.status === 'COMPLETED'
      ).length;
      
      // Calcul du pourcentage de progression (arrondi à l'entier)
      const stepProgress = totalSteps > 0 
        ? Math.round((completedSteps / totalSteps) * 100) 
        : 0;
      
      return {
        ...cp,
        stepProgress
      };
    });

    // Assemblage des données finales
    return {
      id: procedure.id,
      name: procedure.name,
      description: procedure.description,
      price: procedure.price,
      estimatedDuration: procedure.estimatedDuration,
      category: procedure.category,
      isActive: procedure.isActive,
      steps: procedure.steps,
      clientProcedures: clientProceduresWithProgress,
      totalClients,
      inProgressCount,
      completedCount,
      cancelledCount,
      totalRevenue,
      pendingRevenue
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la procédure:', error);
    throw error;
  }
}
