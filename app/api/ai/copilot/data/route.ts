// app/api/copilot/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authorization, PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Types pour les données agrégées
interface AggregatedData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organizationId: string | null;
  };
  organization: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
  } | null;
  permissions: authorization | null;
  statistics: {
    clients: {
      total: number;
      recent: number; // Derniers 30 jours
    };
    procedures: {
      total: number;
      active: number;
      inProgress: number;
      completed: number;
    };
    transactions: {
      total: number;
      totalAmount: number;
      expenses: number;
      revenues: number;
      pending: number;
    };
    invoices: {
      total: number;
      totalAmount: number;
      paid: number;
      pending: number;
      overdue: number;
    };
  };
  recentActivity: Array<{
    type: 'client' | 'procedure' | 'transaction' | 'invoice';
    id: string;
    title: string;
    description: string;
    date: string;
    status?: string;
    amount?: number;
  }>;
  clients: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    reference: string | null;
    activeProcedures: number;
    totalInvoiced: number;
    lastActivity: string;
  }>;
  procedures: Array<{
    id: string;
    name: string;
    description: string;
    price: number | null;
    category: string | null;
    isActive: boolean;
    totalClients: number;
    averageDuration: number | null;
    completionRate: number;
  }>;
  financials: {
    monthlyRevenues: Array<{
      month: string;
      amount: number;
    }>;
    monthlyExpenses: Array<{
      month: string;
      amount: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      amount: number;
      type: 'EXPENSE' | 'REVENUE';
    }>;
  };
}

// Fonction pour vérifier les permissions
async function getUserPermissions(userId: string) {
  const authorization = await prisma.authorization.findUnique({
    where: { userId }
  });
  
  return authorization;
}

// Fonction pour filtrer les données selon les permissions
function filterDataByPermissions(data: AggregatedData, permissions: authorization | null) {
  const filtered: Partial<AggregatedData> = {
    user: data.user,
    organization: data.organization,
    permissions: permissions,
    statistics: data.statistics,
    recentActivity: data.recentActivity
  };

  // Filtrer les clients si pas d'autorisation de lecture
  if (permissions?.canReadClient) {
    filtered.clients = data.clients;
  }

  // Filtrer les procédures si pas d'autorisation de lecture
  if (permissions?.canReadProcedure) {
    filtered.procedures = data.procedures;
  }

  // Filtrer les données financières si pas d'autorisation
  if (permissions?.canReadTransaction || permissions?.canReadRevenue || permissions?.canReadExpense) {
    filtered.financials = data.financials;
  }

  return filtered;
}

export async function GET() {
  try {
    // Récupérer la session utilisateur
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Récupérer l'utilisateur avec ses relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        authorize: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const organizationId = user.organizationId;
    const permission = await getUserPermissions(userId);

    // Préparer les filtres de base pour l'organisation
    const orgFilter = organizationId ? { organizationId } : {};

    // Début de l'agrégation des données
    const aggregatedData: AggregatedData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      },
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name,
        description: user.organization.description,
        active: user.organization.active
      } : null,
      permissions: permission,
      statistics: {
        clients: { total: 0, recent: 0 },
        procedures: { total: 0, active: 0, inProgress: 0, completed: 0 },
        transactions: { total: 0, totalAmount: 0, expenses: 0, revenues: 0, pending: 0 },
        invoices: { total: 0, totalAmount: 0, paid: 0, pending: 0, overdue: 0 }
      },
      recentActivity: [],
      clients: [],
      procedures: [],
      financials: {
        monthlyRevenues: [],
        monthlyExpenses: [],
        categoryBreakdown: []
      }
    };

    // Statistiques des clients
    if (permission && organizationId) {
      const clientsCount = await prisma.client.count({
        where: orgFilter
      });

      const recentClientsCount = await prisma.client.count({
        where: {
          ...orgFilter,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
          }
        }
      });

      aggregatedData.statistics.clients = {
        total: clientsCount,
        recent: recentClientsCount
      };

      // Détails des clients
      aggregatedData.clients = await prisma.client.findMany({
        where: orgFilter,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          reference: true,
          createdAt: true,
          clientProcedures: {
            where: {
              status: 'IN_PROGRESS'
            },
            select: { id: true }
          },
          invoices: {
            select: {
              totalAmount: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      }).then(clients => 
        clients.map(client => ({
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          reference: client.reference,
          activeProcedures: client.clientProcedures.length,
          totalInvoiced: client.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
          lastActivity: client.createdAt.toISOString()
        }))
      );
    }

    // Statistiques des procédures
    if (permission && organizationId) {
      const proceduresStats = await prisma.procedure.findMany({
        where: orgFilter,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          isActive: true,
          clientProcedures: {
            select: {
              status: true,
              startDate: true,
              completionDate: true
            }
          }
        }
      });

      aggregatedData.statistics.procedures = {
        total: proceduresStats.length,
        active: proceduresStats.filter(p => p.isActive).length,
        inProgress: proceduresStats.reduce((sum, p) => 
          sum + p.clientProcedures.filter(cp => cp.status === 'IN_PROGRESS').length, 0),
        completed: proceduresStats.reduce((sum, p) => 
          sum + p.clientProcedures.filter(cp => cp.status === 'COMPLETED').length, 0)
      };

      // Détails des procédures
      aggregatedData.procedures = proceduresStats.map(proc => ({
        id: proc.id,
        name: proc.name,
        description: proc.description,
        price: proc.price,
        category: proc.category,
        isActive: proc.isActive,
        totalClients: proc.clientProcedures.length,
        averageDuration: proc.clientProcedures
          .filter(cp => cp.completionDate && cp.startDate)
          .reduce((sum, cp, _, arr) => {
            const duration = (cp.completionDate!.getTime() - cp.startDate.getTime()) / (1000 * 60 * 60 * 24);
            return arr.length > 0 ? sum + duration / arr.length : 0;
          }, 0),
        completionRate: proc.clientProcedures.length > 0 
          ? (proc.clientProcedures.filter(cp => cp.status === 'COMPLETED').length / proc.clientProcedures.length) * 100
          : 0
      }));
    }

    // Statistiques des transactions
    if ((permission?.canReadTransaction || permission?.canReadExpense || permission?.canReadRevenue) && organizationId) {
      const transactions = await prisma.transaction.findMany({
        where: orgFilter,
        select: {
          id: true,
          amount: true,
          type: true,
          status: true,
          date: true,
          description: true,
          category: {
            select: {
              name: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });

      const totalAmount = transactions.reduce((sum, t) => 
        t.type === 'REVENUE' ? sum + t.amount : sum - t.amount, 0);
      
      aggregatedData.statistics.transactions = {
        total: transactions.length,
        totalAmount,
        expenses: transactions.filter(t => t.type === 'EXPENSE').length,
        revenues: transactions.filter(t => t.type === 'REVENUE').length,
        pending: transactions.filter(t => t.status === 'PENDING').length
      };

      // Activité récente des transactions
      aggregatedData.recentActivity.push(
        ...transactions.slice(0, 10).map(t => ({
          type: 'transaction' as const,
          id: t.id,
          title: `${t.type === 'REVENUE' ? 'Recette' : 'Dépense'}: ${t.amount}€`,
          description: t.description,
          date: t.date.toISOString(),
          status: t.status,
          amount: t.amount
        }))
      );

      // Données financières mensuelles
      const monthlyData = transactions.reduce((acc, t) => {
        const month = t.date.toISOString().substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { revenues: 0, expenses: 0 };
        }
        if (t.type === 'REVENUE') {
          acc[month].revenues += t.amount;
        } else if (t.type === 'EXPENSE') {
          acc[month].expenses += t.amount;
        }
        return acc;
      }, {} as Record<string, { revenues: number; expenses: number }>);

      aggregatedData.financials.monthlyRevenues = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, amount: data.revenues }))
        .sort((a, b) => a.month.localeCompare(b.month));

      aggregatedData.financials.monthlyExpenses = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, amount: data.expenses }))
        .sort((a, b) => a.month.localeCompare(b.month));

      // Répartition par catégorie
      const categoryData = transactions.reduce((acc, t) => {
        const categoryName = t.category?.name || 'Non catégorisé';
        if (!acc[categoryName]) {
          acc[categoryName] = { REVENUE: 0, EXPENSE: 0 };
        }
        acc[categoryName][t.type as 'REVENUE' | 'EXPENSE'] += t.amount;
        return acc;
      }, {} as Record<string, { REVENUE: number; EXPENSE: number }>);

      aggregatedData.financials.categoryBreakdown = Object.entries(categoryData).flatMap(
        ([category, amounts]) => [
          { category, amount: amounts.REVENUE, type: 'REVENUE' as const },
          { category, amount: amounts.EXPENSE, type: 'EXPENSE' as const }
        ]
      ).filter(item => item.amount > 0);
    }

    // Statistiques des factures
    if (permission && organizationId) {
      const invoices = await prisma.invoice.findMany({
        where: orgFilter,
        select: {
          id: true,
          invoiceNumber: true,
          totalAmount: true,
          status: true,
          issuedDate: true,
          dueDate: true,
          client: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { issuedDate: 'desc' }
      });

      const now = new Date();
      aggregatedData.statistics.invoices = {
        total: invoices.length,
        totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
        paid: invoices.filter(inv => inv.status === 'PAID').length,
        pending: invoices.filter(inv => 
          inv.status === 'SENT' || inv.status === 'PARTIALLY_PAID'
        ).length,
        overdue: invoices.filter(inv => 
          inv.status !== 'PAID' && inv.dueDate < now
        ).length
      };

      // Activité récente des factures
      aggregatedData.recentActivity.push(
        ...invoices.slice(0, 5).map(inv => ({
          type: 'invoice' as const,
          id: inv.id,
          title: `Facture ${inv.invoiceNumber}`,
          description: `Client: ${inv.client?.firstName || ''} ${inv.client?.lastName || ''}`.trim(),
          date: inv.issuedDate.toISOString(),
          status: inv.status,
          amount: inv.totalAmount
        }))
      );
    }

    // Trier l'activité récente par date
    aggregatedData.recentActivity.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Filtrer les données selon les permissions
    const filteredData = filterDataByPermissions(aggregatedData, permission);

    return NextResponse.json(filteredData);

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query, filters } = body;

    // Ici vous pouvez implémenter une logique de recherche/filtrage plus avancée
    // basée sur les queries naturelles de CopilotKit
    
    // Par exemple, parser la query pour comprendre ce que l'utilisateur cherche
    const userId = session.user.id;
    const permissions = await getUserPermissions(userId);
    
    // Logique de recherche contextuelle basée sur la query
    let searchResults = {};
    
    if (query.toLowerCase().includes('client')) {
      if (permissions?.canReadClient) {
        // Rechercher dans les clients
        searchResults = await prisma.client.findMany({
          where: {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          },
          take: 10
        });
      }
    }
    
    // ... autres logiques de recherche

    return NextResponse.json({ 
      query, 
      filters, 
      results: searchResults,
      permissions 
    });

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}