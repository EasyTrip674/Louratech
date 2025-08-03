import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { getOrgnaizationId } from "./utils.query";

export async function getMonthlyTargetStats() {
  const organizationId = await getOrgnaizationId();
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));
  const endOfLastMonth = endOfMonth(subMonths(now, 1));

  // Récupérer le revenu total du mois en cours
  const currentMonthRevenue = await prisma.transaction.aggregate({
    where: {
      organizationId,
      type: "REVENUE",
      status: "APPROVED",
      date: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Récupérer le revenu total du mois dernier
  const lastMonthRevenue = await prisma.transaction.aggregate({
    where: {
      organizationId,
      type: "REVENUE",
      status: "APPROVED",
      date: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Récupérer le revenu d'aujourd'hui
  const todayRevenue = await prisma.transaction.aggregate({
    where: {
      organizationId,
      type: "REVENUE",
      status: "APPROVED",
      date: {
        gte: new Date(now.setHours(0, 0, 0, 0)),
        lte: new Date(now.setHours(23, 59, 59, 999)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Statistiques des employés - Procédures en cours par employé
  const employeeStats = await prisma.user.findMany({
    where: {
      organizationId,
      role: { in: ["USER", "EMPLOYEE", "ADMIN"] },
      active: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      name: true,
      assignedClientProcedures: {
        where: {
          status: "IN_PROGRESS",
        },
        select: {
          id: true,
          procedure: {
            select: {
              name: true,
            }
          }
        }
      },
      managedClientProcedures: {
        where: {
          status: "IN_PROGRESS",
        },
        select: {
          id: true,
        }
      },
      processedClientSteps: {
        where: {
          status: "COMPLETED",
          completionDate: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          }
        },
        select: {
          id: true,
        }
      }
    }
  });

  // Calculer les totaux pour les employés
  const totalActiveEmployees = employeeStats.length;
  const totalActiveProcedures = await prisma.clientProcedure.count({
    where: {
      organizationId,
      status: "IN_PROGRESS",
    }
  });

  const totalCompletedProcedures = await prisma.clientProcedure.count({
    where: {
      organizationId,
      status: "COMPLETED",
      completionDate: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      }
    }
  });

  // Calculer la charge de travail moyenne
  const averageWorkload = totalActiveEmployees > 0 
    ? Math.round(totalActiveProcedures / totalActiveEmployees) 
    : 0;

  // Calcul des montants
  const currentMonthAmount = currentMonthRevenue._sum?.amount || 0;
  const lastMonthAmount = lastMonthRevenue._sum?.amount || 0;
  const todayAmount = todayRevenue._sum?.amount || 0;

  // Définir un objectif mensuel basé sur 120% du revenu du mois dernier
  const target = Math.max(1000, Math.round(lastMonthAmount * 1.2));

  // Calculer le pourcentage de changement par rapport au mois dernier
  const percentageChange = lastMonthAmount > 0 
    ? ((currentMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
    : 0;

  // Générer un message en fonction de la progression
  let message = "";
  if (percentageChange > 0) {
    message = `📈 Vous avez augmenté votre revenu de ${Math.round(percentageChange)}% par rapport au mois dernier.`;
  } else if (percentageChange < 0) {
    message = `📉 Vous avez diminué votre revenu de ${Math.abs(Math.round(percentageChange))}% par rapport au mois dernier.`;
  } else if (percentageChange === 0 && lastMonthAmount === 0) {
    message = `⚖️ Vous n'avez pas fait de chiffre le mois dernier.`;
  } else if (percentageChange === 0 && lastMonthAmount > 0) {
    message = `⚖️ Vous n'avez pas fait de chiffre ce mois-ci.`;
  } else {
    message = `⚖️ Vous avez le même revenu que le mois dernier.`;
  }

  // Calcul du taux d'efficacité des employés (procédures terminées vs en cours)
  const efficiencyRate = totalActiveProcedures > 0 
    ? Math.round((totalCompletedProcedures / (totalActiveProcedures + totalCompletedProcedures)) * 100)
    : 0;

  return {
    // Données financières
    target: target,
    lastMonthAmount: lastMonthAmount,
    revenue: currentMonthAmount,
    progress: Math.min(100, Math.round((currentMonthAmount / target) * 100)),
    growth: Math.round(percentageChange),
    message: message,
    currentMonthAmount: currentMonthAmount,
    today: todayAmount,

    // Statistiques des employés
    employeeMetrics: {
      totalActiveEmployees,
      totalActiveProcedures,
      totalCompletedProcedures,
      averageWorkload,
      efficiencyRate,
      topPerformers: employeeStats
        .map(emp => ({
          id: emp.id,
          name: emp.firstName && emp.lastName 
            ? `${emp.firstName} ${emp.lastName}` 
            : emp.name || 'Employé',
          activeProcedures: emp.assignedClientProcedures.length,
          managedProcedures: emp.managedClientProcedures.length,
          completedSteps: emp.processedClientSteps.length,
          totalWorkload: emp.assignedClientProcedures.length + emp.managedClientProcedures.length
        }))
        .sort((a, b) => b.completedSteps - a.completedSteps)
        .slice(0, 5)
    }
  };
}

export type getMonthlyTargetStatsType = Prisma.PromiseReturnType<
  typeof getMonthlyTargetStats
>;

export async function getMonthlySalesData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const organizationId = await getOrgnaizationId();

  // Récupérer les revenus mensuels pour l'année en cours
  const monthlyRevenues = await prisma.transaction.groupBy({
    by: ['date'],
    where: {
      organizationId,
      type: "REVENUE",
      status: "APPROVED",
      date: {
        gte: new Date(currentYear, 0, 1), // Début de l'année
        lte: new Date(currentYear, 11, 31), // Fin de l'année
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Initialiser les données mensuelles
  const monthlyData = Array(12).fill(0);

  // Remplir les données mensuelles
  monthlyRevenues.forEach(revenue => {
    const month = new Date(revenue.date).getMonth();
    monthlyData[month] = (revenue._sum?.amount || 0) / 1000; // Convertir en K pour l'affichage
  });

  return {
    series: [{
      name: "Revenue",
      data: monthlyData,
    }],
  };
}

export type getMonthlySalesDataType = Prisma.PromiseReturnType<
  typeof getMonthlySalesData
>;

export async function getStatisticsData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const organizationId = await getOrgnaizationId();

  // Récupérer les transactions approuvées pour l'année en cours
  const monthlyTransactions = await prisma.transaction.groupBy({
    by: ['date', 'type'],
    where: {
      organizationId,
      status: "APPROVED",
      type: {
        in: ["REVENUE", "EXPENSE"]
      },
      date: {
        gte: new Date(currentYear, 0, 1),
        lte: new Date(currentYear, 11, 31),
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Initialiser les données mensuelles
  const revenueData = Array(12).fill(0);
  const expenseData = Array(12).fill(0);

  // Remplir les données mensuelles
  monthlyTransactions.forEach(transaction => {
    const month = new Date(transaction?.date).getMonth();
    const amount = (transaction._sum?.amount || 0) / 1000; // Convertir en K pour l'affichage
    
    if (transaction.type === "REVENUE") {
      revenueData[month] = amount;
    } else if (transaction.type === "EXPENSE") {
      expenseData[month] = amount;
    }
  });

  return {
    series: [
      {
        name: "Revenue",
        data: revenueData,
      },
      {
        name: "Depense",
        data: expenseData,
      },
    ],
  };
}

export type getStatisticsDataType = Prisma.PromiseReturnType<
  typeof getStatisticsData
>;

export async function getClientServiceData(timeRange: 'month' | 'year' | 'all' = 'all' ) {
  const organizationId = await getOrgnaizationId();
  const now = new Date();
  
  // Define the time range based on the parameter
  let startDate;
  switch (timeRange) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      startDate = new Date(2000, 0, 1); // Going far back to include all data
      break;
  }

  // Get all procedures in the organization
  const procedures = await prisma.procedure.findMany({
    where: {
      organizationId,
      isActive: true
    },
    select: {
      id: true,
      name: true
    }
  });

  // For each procedure, get the client registration data over time
  const seriesData = await Promise.all(
    procedures.map(async (procedure) => {
      // Get client procedures for this specific procedure
      const clientProcedures = await prisma.clientProcedure.findMany({
        where: {
          organizationId,
          procedureId: procedure.id,
          startDate: {
            gte: startDate
          }
        },
        orderBy: {
          startDate: 'asc'
        },
        select: {
          startDate: true,
          procedureId: true
        }
      });

      // Group the data by date - count registrations on each date
      const groupedByDate = clientProcedures.reduce((acc, cp) => {
        // Format the date to YYYY-MM-DD for grouping
        const dateKey = cp.startDate.toISOString().split('T')[0];
        
        if (!acc[dateKey]) {
          acc[dateKey] = 0;
        }
        acc[dateKey]++;
        
        return acc;
      }, {} as Record<string, number>);

      // Convert to cumulative data for showing total clients over time
      const cumulativeData : Array<{
          x: Date;
          y: number;
        }> = [];
      let cumulativeCount = 0;
      
      Object.keys(groupedByDate).sort().forEach(date => {
        cumulativeCount += groupedByDate[date];
        cumulativeData.push({
          x: new Date(date),
          y: cumulativeCount
        });
      });

      // Return the series data in format required by ApexCharts
      return {
        name: procedure.name,
        data: cumulativeData
      };
    })
  );

  // Filter out procedures with no client data
  const filteredSeriesData = seriesData.filter(series => series.data.length > 0);

  return {
    series: filteredSeriesData
  };
}

export type getClientServiceDataType = Prisma.PromiseReturnType<
  typeof getClientServiceData
>;

export const recentOrders = async () => {
  const organizationId = await getOrgnaizationId()
  return await prisma.clientProcedure.findMany({
    where:{
      organizationId: organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include:{
        client:true
    },
    take: 5,
  });
}

export type recentOrdersType = Prisma.PromiseReturnType<
  typeof recentOrders
>;