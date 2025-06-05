import { NextRequest, NextResponse } from 'next/server';
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subMonths, subQuarters, subYears } from 'date-fns';
import prisma from '@/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const period = searchParams.get('period') || 'month';

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID requis' },
        { status: 400 }
      );
    }

    const now = new Date();
    let startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date;

    // Définir les dates selon la période
    switch (period) {
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        previousStartDate = startOfMonth(subMonths(now, 1));
        previousEndDate = endOfMonth(subMonths(now, 1));
        break;
      case 'quarter':
        startDate = startOfQuarter(now);
        endDate = endOfQuarter(now);
        previousStartDate = startOfQuarter(subQuarters(now, 1));
        previousEndDate = endOfQuarter(subQuarters(now, 1));
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        previousStartDate = startOfYear(subYears(now, 1));
        previousEndDate = endOfYear(subYears(now, 1));
        break;
      default:
        throw new Error('Période non supportée');
    }

    // Récupérer les données financières pour la période actuelle
    const currentPeriodData = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        organizationId,
        status: 'APPROVED',
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        amount: true
      }
    });

    // Récupérer les données financières pour la période précédente
    const previousPeriodData = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        organizationId,
        status: 'APPROVED',
        date: {
          gte: previousStartDate,
          lte: previousEndDate
        }
      },
      _sum: {
        amount: true
      }
    });

    // Calculer les totaux
    const currentRevenue = currentPeriodData.find(d => d.type === 'REVENUE')?._sum.amount || 0;
    const currentExpenses = currentPeriodData.find(d => d.type === 'EXPENSE')?._sum.amount || 0;
    const currentProfit = currentRevenue - currentExpenses;

    const previousRevenue = previousPeriodData.find(d => d.type === 'REVENUE')?._sum.amount || 0;
    const previousExpenses = previousPeriodData.find(d => d.type === 'EXPENSE')?._sum.amount || 0;
    const previousProfit = previousRevenue - previousExpenses;

    // Calculer les pourcentages de changement
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const expenseChange = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;
    const profitChange = previousProfit > 0 ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0;

    const summary = {
      period,
      currentPeriod: {
        revenue: currentRevenue,
        expenses: currentExpenses,
        profit: currentProfit,
        margin: currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0
      },
      previousPeriod: {
        revenue: previousRevenue,
        expenses: previousExpenses,
        profit: previousProfit,
        margin: previousRevenue > 0 ? (previousProfit / previousRevenue) * 100 : 0
      },
      changes: {
        revenue: Math.round(revenueChange * 100) / 100,
        expenses: Math.round(expenseChange * 100) / 100,
        profit: Math.round(profitChange * 100) / 100
      }
    };

    return NextResponse.json(summary);

  } catch (error) {
    console.error('Erreur lors de la récupération du résumé financier:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
