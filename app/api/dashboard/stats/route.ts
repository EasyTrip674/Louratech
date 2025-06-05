import { getMonthlyTargetStats,getStatisticsData,recentOrders } from '@/db/queries/dasboard.query';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID requis' },
        { status: 400 }
      );
    }

    // Récupérer les statistiques principales pour le dashboard
    const [monthlyStats, generalStats, recentClients] = await Promise.all([
      getMonthlyTargetStats(),
      getStatisticsData(),
      recentOrders()
    ]);

    const dashboardStats = {
      // Statistiques mensuelles
      monthlyRevenue: monthlyStats.revenue,
      monthlyTarget: monthlyStats.target,
      monthlyProgress: monthlyStats.progress,
      monthlyGrowth: monthlyStats.growth,
      todayRevenue: monthlyStats.today,
      
      // Statistiques générales (somme des revenus et dépenses de l'année)
      yearlyRevenue: generalStats.series.find(s => s.name === 'Revenue')?.data.reduce((a, b) => a + b, 0) || 0,
      yearlyExpenses: generalStats.series.find(s => s.name === 'Depense')?.data.reduce((a, b) => a + b, 0) || 0,
      
      // Nombre de clients récents
      recentClientsCount: recentClients.length,
      
      // Message de performance
      performanceMessage: monthlyStats.message
    };

    return NextResponse.json(dashboardStats);

  } catch (error) {
    console.error('Erreur lors de la récupération des stats dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}