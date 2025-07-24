import prisma from '../prisma';
import { Prisma } from '@prisma/client';
import { startOfMonth, endOfMonth, subMonths, isAfter } from 'date-fns';

function removeId(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(removeId);
  } else if (obj && typeof obj === 'object') {
    const rest = { ...(obj as Record<string, unknown>) };
    delete rest.id;
    const cleaned: Record<string, unknown> = {};
    for (const key in rest) {
      cleaned[key] = removeId(rest[key]);
    }
    return cleaned;
  }
  return obj;
}

export async function getAISnapshot(organizationId: string) {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));
  const endOfLastMonth = endOfMonth(subMonths(now, 1));

  const [
    organization,
    procedures,
    transactions,
    employees,
    clients,
    invoices,
    categories,
    comptaSettings,
    totalProcedures,
    totalClients,
    totalEmployees,
    totalTransactions,
    currentMonthRevenue,
    lastMonthRevenue,
    todayRevenue,
    currentMonthExpenses,
    lastMonthExpenses,
    totalRevenue,
    totalExpenses,
  ] = await Promise.all([
    prisma.organization.findUnique({ where: { id: organizationId } }),
    prisma.procedure.findMany({
      where: { organizationId },
      include: {
        steps: { select: { id: true } },
        clientProcedures: { select: { id: true, status: true, completionDate: true, startDate: true } },
      },
    }),
    prisma.transaction.findMany({
      where: { organizationId },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        category: true,
        clientProcedure: { select: { id: true } },
        clientStep: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.admin.findMany({
      where: { organizationId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, active: true, role: true } },
      },
    }),
    prisma.client.findMany({
      where: { organizationId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        clientProcedures: { select: { id: true, status: true } },
        invoices: { select: { id: true, status: true, totalAmount: true, dueDate: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.findMany({
      where: { organizationId },
      select: {
        id: true,
        clientId: true,
        status: true,
        totalAmount: true,
        dueDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      where: { OR: [{ organizationId }, { organizationId: null }] },
      select: { id: true, name: true, parentId: true },
    }),
    prisma.comptaSettings.findUnique({ where: { organizationId } }),
    prisma.procedure.count({ where: { organizationId } }),
    prisma.client.count({ where: { organizationId } }),
    prisma.admin.count({ where: { organizationId } }),
    prisma.transaction.count({ where: { organizationId } }),
    prisma.transaction.aggregate({
      where: {
        organizationId,
        type: 'REVENUE',
        status: 'APPROVED',
        date: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        organizationId,
        type: 'REVENUE',
        status: 'APPROVED',
        date: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        organizationId,
        type: 'REVENUE',
        status: 'APPROVED',
        date: { gte: new Date(now.setHours(0, 0, 0, 0)), lte: new Date(now.setHours(23, 59, 59, 999)) },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        organizationId,
        type: 'EXPENSE',
        status: 'APPROVED',
        date: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        organizationId,
        type: 'EXPENSE',
        status: 'APPROVED',
        date: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        organizationId,
        type: 'REVENUE',
        status: 'APPROVED',
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        organizationId,
        type: 'EXPENSE',
        status: 'APPROVED',
      },
      _sum: { amount: true },
    }),
  ]);

  const overdueInvoices = invoices.filter(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED' && isAfter(now, inv.dueDate));
  const partiallyPaidInvoices = invoices.filter(inv => inv.status === 'PARTIALLY_PAID');
  const unpaidInvoices = invoices.filter(inv => inv.status === 'DRAFT' || inv.status === 'SENT');
  const clientsWithOverduePayments = [...new Set(overdueInvoices.map(inv => inv.clientId))];
  const clientsWithPartialPayments = [...new Set(partiallyPaidInvoices.map(inv => inv.clientId))];
  const unpaidAmountsByClientObj = overdueInvoices.reduce((acc, inv) => {
    acc[inv.clientId] = (acc[inv.clientId] || 0) + inv.totalAmount;
    return acc;
  }, {} as Record<string, number>);
  const unpaidAmountsByClient = unpaidAmountsByClientObj;

  const statistiquesMensuelles = {
    revenuMoisEnCours: currentMonthRevenue._sum.amount || 0,
    revenuMoisPrecedent: lastMonthRevenue._sum.amount || 0,
    revenuAujourdhui: todayRevenue._sum.amount || 0,
    depensesMoisEnCours: currentMonthExpenses._sum.amount || 0,
    depensesMoisPrecedent: lastMonthExpenses._sum.amount || 0,
    profitMoisEnCours: (currentMonthRevenue._sum.amount || 0) - (currentMonthExpenses._sum.amount || 0),
    profitMoisPrecedent: (lastMonthRevenue._sum.amount || 0) - (lastMonthExpenses._sum.amount || 0),
    revenuTotal: totalRevenue._sum.amount || 0,
    depensesTotales: totalExpenses._sum.amount || 0,
    profitTotal: (totalRevenue._sum.amount || 0) - (totalExpenses._sum.amount || 0),
    croissanceRevenu: lastMonthRevenue._sum.amount
      ? ((currentMonthRevenue._sum.amount || 0) - (lastMonthRevenue._sum.amount || 0)) / (lastMonthRevenue._sum.amount || 1) * 100
      : 0,
  };

  const statistiquesDetaillees = {
    proceduresTotal: totalProcedures,
    clientsTotal: totalClients,
    employesTotal: totalEmployees,
    transactionsTotal: totalTransactions,
    facturesEnRetard: overdueInvoices.length,
    facturesPartiellementPayees: partiallyPaidInvoices.length,
    facturesImpayees: unpaidInvoices.length,
    clientsAvecRetardPaiement: clientsWithOverduePayments.length,
    clientsAvecPaiementPartiel: clientsWithPartialPayments.length,
  };

  return {
    organisation: removeId(organization),
    procedures: removeId(procedures),
    transactions: removeId(transactions),
    employes: removeId(employees),
    clients: removeId(clients),
    factures: removeId(invoices),
    categories: removeId(categories),
    parametresComptables: removeId(comptaSettings),
    tableauDeBord: {
      statistiquesMensuelles,
      statistiquesDetaillees,
    },
    analysePaiements: {
      facturesEnRetard: removeId(overdueInvoices),
      facturesPartiellementPayees: removeId(partiallyPaidInvoices),
      facturesImpayees: removeId(unpaidInvoices),
      clientsAvecRetardPaiement: removeId(clientsWithOverduePayments),
      clientsAvecPaiementPartiel: removeId(clientsWithPartialPayments),
      montantsImpayesParClient: unpaidAmountsByClient,
    },
    dateGeneration: new Date(),
  };
}

export type getAISnapshotType = Prisma.PromiseReturnType<typeof getAISnapshot>;