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
            step:true
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

export type procedureDetailsDb = Prisma.PromiseReturnType<typeof getProcedureDetails>



// ===== STEP QUERIES =====


/**
 * Récupère les détails d'une procédure avec toutes ses étapes
 * @param procedureId - L'identifiant unique de la procédure
 * @returns Les détails de la procédure et ses étapes, ou null si non trouvée
 */
export async function getProcedureWithStepsDb(procedureId: string) {
  try {
    return await prisma.procedure.findUnique({
      where: {
        id: procedureId,
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la procédure:', error);
    throw error;
  }
}

export type ProcedureWithStepsDb = Prisma.PromiseReturnType<typeof getProcedureWithStepsDb>;



/**
 * Récupère les détails d'une procédure avec ses étapes et le nombre de procédures clients
 * associées dans chaque statut
 * @param procedureId - L'identifiant unique de la procédure
 * @returns Les détails complets de la procédure avec statistiques
 */
export async function getProcedureDetailsStepsDB(procedureId: string) {
  try {
    // Récupérer la procédure avec ses étapes
    const procedure = await prisma.procedure.findUnique({
      where: {
        id: procedureId,
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
        clientProcedures: {
          include: {
            invoice: true,
          },
        },
      },
    });

    if (!procedure) {
      return null;
    }

    // Calculer les statistiques
    const inProgressCount = procedure.clientProcedures.filter(cp => 
      cp.status === 'IN_PROGRESS'
    ).length;
    
    const completedCount = procedure.clientProcedures.filter(cp => 
      cp.status === 'COMPLETED'
    ).length;
    
    const cancelledCount = procedure.clientProcedures.filter(cp => 
      cp.status === 'CANCELLED' || cp.status === 'REJECTED'
    ).length;
    
    // Calculer les revenus
    const totalRevenue = procedure.clientProcedures
      .filter(cp => cp.invoice && cp.invoice.status === 'PAID')
      .reduce((sum, cp) => sum + (cp.invoice?.totalAmount || 0), 0);
    
    const pendingRevenue = procedure.clientProcedures
      .filter(cp => cp.invoice && cp.invoice.status !== 'PAID' && cp.invoice.status !== 'CANCELLED')
      .reduce((sum, cp) => sum + (cp.invoice?.totalAmount || 0), 0);

    // Construire l'objet de résultat
    return {
      ...procedure,
      totalStep: procedure.steps.length,
      inProgressCount,
      completedCount,
      cancelledCount,
      totalRevenue,
      pendingRevenue,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de procédure:', error);
    throw error;
  }
}

export type ProcedureDetailsWithStats = Prisma.PromiseReturnType<typeof getProcedureDetailsStepsDB>;


export const getStepsProcedureDB = async(procedureId:string)=>{
  return prisma.procedure.findUnique({
    where:{id:procedureId},
    select:{
      steps:true,
    }
  })
}

export type StepsProcedureDB = Prisma.PromiseReturnType<typeof getStepsProcedureDB>


// ===== Details Step Procedure =====
export const getStepProcedureDetails = async (stepId: string) => {
  return await prisma.stepProcedure.findUnique({
    where: { id: stepId },
    include: {
      clientSteps: {
        include: {
          clientProcedure: {
            include: {
              client: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export type StepProcedureDetails = Prisma.PromiseReturnType<typeof getStepProcedureDetails>;


// ===== CLIENT Procdures QUERIES =====

export const getClientProcedureWithSteps = async (clientProcedureId: string, procedureId: string) => {
  try {
    return await prisma.clientProcedure.findFirst({
      where: {
        id: clientProcedureId,
      },
      include: {
        procedure: true,
        client:{
          include:{
            user:true
          }
        },
        steps: {
          include: {
            step: true,
          },
        }
    }});
  } catch (error) {
    console.error('Error fetching client procedure:', error);
    throw error;
  }
};

export type ClientProcedureWithSteps = Prisma.PromiseReturnType<typeof getClientProcedureWithSteps>;
