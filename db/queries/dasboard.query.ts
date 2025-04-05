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

  // Calculer le pourcentage de changement par rapport au mois dernier
  const lastMonthAmount = lastMonthRevenue._sum.amount || 0;
  const currentMonthAmount = currentMonthRevenue._sum.amount || 0;
  const percentageChange = lastMonthAmount > 0 
    ? ((currentMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
    : 0;

  // Calculer le pourcentage de progression
  const target = 20000; // Cette valeur pourrait être récupérée depuis les paramètres de l'organisation
  const progress = Math.min(Math.round((currentMonthAmount / target) * 100), 100);

  // Générer un message en fonction de la progression
  let message = "";
  if (progress >= 100) {
    message = "Félicitations ! Vous avez dépassé votre objectif mensuel !";
  } else if (progress >= 75) {
    message = "Excellent travail ! Vous êtes sur la bonne voie pour atteindre votre objectif mensuel.";
  } else if (progress >= 50) {
    message = "Vous êtes à mi-chemin ! Continuez comme ça.";
  } else {
    message = "Travaillons plus dur pour atteindre votre objectif mensuel.";
  }

  return {
    target: target / 1000, // Convertir en K pour l'affichage
    revenue: currentMonthAmount / 1000, // Convertir en K pour l'affichage
    progress: progress,
    growth: Math.round(percentageChange),
    message: message,
    today: (todayRevenue._sum.amount || 0) / 1000, // Convertir en K pour l'affichage
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
    monthlyData[month] = (revenue._sum.amount || 0) / 1000; // Convertir en K pour l'affichage
  });

  return {
    series: [{
      name: "Sales",
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
    const month = new Date(transaction.date).getMonth();
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
        name: "Expense",
        data: expenseData,
      },
    ],
  };
}

export type getStatisticsDataType = Prisma.PromiseReturnType<
  typeof getStatisticsData
>;


export async function getDemographicData() {
  const organizationId = await getOrgnaizationId();
  const currentYear = new Date().getFullYear();

  // Récupérer les clients avec leurs procédures pour l'année en cours
  const clients = await prisma.client.findMany({
    where: {
      organizationId,
      user: {
       client:{
        clientProcedures: {
            some: {
              startDate: {
                gte: new Date(currentYear, 0, 1),
                lte: new Date(currentYear, 11, 31),
              }
            }
          }
       }
      }
    },
    include: {
      user: {
        include: {
          client: {
            include:{
                clientProcedures:{
                    where: {
                        startDate: {
                          gte: new Date(currentYear, 0, 1),
                          lte: new Date(currentYear, 11, 31),
                        }
                      },
                      include: {
                        procedure: true
                      }
                }
            }
          }
        }
      }
    }
  });

  // Compter les clients par pays (utilisant l'adresse comme indicateur)
  const countryStats = clients.reduce((acc, client) => {
    const country = client.address?.split(',')?.pop()?.trim() || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculer le total des clients
  const totalClients = Object.values(countryStats).reduce((sum, count) => sum + count, 0);

  // Convertir en pourcentages et formater pour le graphique
  const formattedData = Object.entries(countryStats).map(([country, count]) => ({
    country,
    customers: count,
    percentage: Math.round((count / totalClients) * 100)
  }));

  return {
    total: totalClients,
    data: formattedData
  };
}

export type getDemographicDataType = Prisma.PromiseReturnType<
  typeof getDemographicData
>;
