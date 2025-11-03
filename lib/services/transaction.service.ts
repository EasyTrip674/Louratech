import { BaseService } from "./base.service";
import { PaymentMethod, TransactionStatus, TransactionType } from "@prisma/client";

export interface CreateTransactionData {
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  description: string;
  date: string;
  categoryId?: string;
  clientProcedureId?: string;
  clientStepId?: string;
  revenueId?: string;
  expenseId?: string;
}

export interface UpdateTransactionData {
  id: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  description: string;
  date: string;
  categoryId?: string;
}

export class TransactionService extends BaseService {
  /**
   * Crée une nouvelle transaction
   */
  async createTransaction(data: CreateTransactionData) {
    try {
      const organizationId = await this.getOrganizationId();
      const user = await this.getCurrentUser();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Vérifier les autorisations selon le type de transaction
      if (data.type === "REVENUE") {
        const canCreate = await this.checkPermission("canCreateRevenue");
        if (!canCreate) {
          throw new Error("Vous n'êtes pas autorisé à créer un revenu");
        }
      } else if (data.type === "EXPENSE") {
        const canCreate = await this.checkPermission("canCreateExpense");
        if (!canCreate) {
          throw new Error("Vous n'êtes pas autorisé à créer une dépense");
        }
      }

      // Vérifier s'il existe déjà une transaction récente (anti-doublon)
      const existingTransaction = await this.prisma.transaction.findFirst({
        where: {
          organizationId,
          createdAt: {
            gte: new Date(Date.now() - 5 * 1000), // 5 secondes
          }
        },
      });

      if (existingTransaction) {
        throw new Error("Une transaction existe déjà pour cette étape client");
      }

      // Créer la transaction
      const transaction = await this.prisma.transaction.create({
        data: {
          amount: data.amount,
          type: data.type,
          paymentMethod: data.paymentMethod,
          description: data.description,
          date: new Date(data.date),
          status: TransactionStatus.PENDING,
          organizationId,
          createdById: user.userDetails?.id,
          categoryId: data.categoryId,
          clientProcedureId: data.clientProcedureId,
          clientStepId: data.clientStepId,
          revenue: data.revenueId ? { connect: { id: data.revenueId } } : undefined,
          expense: data.expenseId ? { connect: { id: data.expenseId } } : undefined,
        },
        include: {
          category: true,
          expense: true,
          revenue: {
            include: {
              invoice: true,
            },
          },
          organization: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: true,
          clientProcedure: {
            include: {
              procedure: true,
              client:true
            },
          },
          clientStep: {
            include: {
              step: true,
              clientProcedure: true,
            },
          },
        },
      });

      return transaction;
    } catch (error) {
      this.handleDatabaseError(error, "createTransaction");
    }
  }

  /**
   * Met à jour une transaction
   */
  async updateTransaction(data: UpdateTransactionData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canEdit = await this.checkPermission("canEditTransaction");
      if (!canEdit) {
        throw new Error("Vous n'êtes pas autorisé à modifier cette transaction");
      }

      // Vérifier que la transaction appartient à l'organisation
      const existingTransaction = await this.prisma.transaction.findUnique({
        where: { id: data.id },
        include: { organization: true }
      });

      if (!existingTransaction || existingTransaction.organizationId !== organizationId) {
        throw new Error("Transaction introuvable ou accès non autorisé");
      }

      // Mettre à jour la transaction
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: data.id },
        data: {
          amount: data.amount,
          type: data.type,
          paymentMethod: data.paymentMethod,
          description: data.description,
          date: new Date(data.date),
          categoryId: data.categoryId,
        },
        include: {
          category: true,
          expense: true,
          revenue: true,
          organization: true,
          createdBy: true,
          approvedBy: true,
          clientProcedure: {
            include: {
              procedure: true,
              client: true
            },
          },
        },
      });

      return updatedTransaction;
    } catch (error) {
      this.handleDatabaseError(error, "updateTransaction");
    }
  }

  /**
   * Supprime une transaction
   */
  async deleteTransaction(transactionId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canDelete = await this.checkPermission("canDeleteTransaction");
      if (!canDelete) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cette transaction");
      }

      // Vérifier que la transaction appartient à l'organisation
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { organization: true }
      });

      if (!transaction || transaction.organizationId !== organizationId) {
        throw new Error("Transaction introuvable ou accès non autorisé");
      }

      await this.prisma.$transaction(async(tx)=>{

            // Supprimer les revenus et les depenses relatives
            await tx.revenue.deleteMany({
              where: { transactionId }
            });
            await tx.expense.deleteMany({
              where: { transactionId }
            });

           // Supprimer la transaction
            await tx.transaction.delete({
              where: { id: transactionId }
            });
      })

      return { success: true };
    } catch (error) {
      this.handleDatabaseError(error, "deleteTransaction");
    }
  }

  /**
   * Approuve une transaction
   */
  async approveTransaction(transactionId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      const user = await this.getCurrentUser();
      
      // Vérifier les autorisations
      const canApprove = await this.checkPermission("canApproveTransaction");
      if (!canApprove) {
        throw new Error("Vous n'êtes pas autorisé à approuver cette transaction");
      }

      // Vérifier que la transaction appartient à l'organisation
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { organization: true }
      });

      if (!transaction || transaction.organizationId !== organizationId) {
        throw new Error("Transaction introuvable ou accès non autorisé");
      }

      // Approuver la transaction
      const approvedTransaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: TransactionStatus.APPROVED,
          approvedById: user?.userDetails?.id,
          approvedAt: new Date(),
        },
        include: {
          category: true,
          expense: true,
          revenue: true,
          organization: true,
          createdBy: true,
          approvedBy: true,
        },
      });

      return approvedTransaction;
    } catch (error) {
      this.handleDatabaseError(error, "approveTransaction");
    }
  }

  /**
   * Récupère toutes les transactions de l'organisation avec pagination
   * @param page - Numéro de page (commence à 1)
   * @param limit - Nombre d'éléments par page
   * @param filters - Filtres optionnels (type, status, date range)
   */
  async getAllTransactions(
    page: number = 1,
    limit: number = 50,
    filters?: {
      type?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    try {
      const organizationId = await this.getOrganizationId();
      const skip = (page - 1) * limit;

      // Build where clause with filters
      const where: any = { organizationId };
      if (filters?.type) {
        where.type = filters.type;
      }
      if (filters?.status) {
        where.status = filters.status;
      }
      if (filters?.startDate || filters?.endDate) {
        where.date = {};
        if (filters.startDate) {
          where.date.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.date.lte = filters.endDate;
        }
      }

      // OPTIMIZATION: Use select instead of include to fetch only necessary fields
      const [transactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
          where,
          select: {
            id: true,
            amount: true,
            description: true,
            type: true,
            status: true,
            date: true,
            reference: true,
            paymentMethod: true,
            createdAt: true,
            updatedAt: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            approvedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
            expense: {
              select: {
                id: true,
                title: true,
                vendor: true,
                invoiceNumber: true,
              },
            },
            revenue: {
              select: {
                id: true,
                source: true,
                referenceNumber: true,
              },
            },
            clientProcedure: {
              select: {
                id: true,
                reference: true,
                client: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
                procedure: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        this.prisma.transaction.count({ where }),
      ]);

      return {
        transactions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleDatabaseError(error, "getAllTransactions");
    }
  }

  /**
   * Récupère toutes les transactions sans pagination (pour exports, etc.)
   * ⚠️ À utiliser avec précaution - peut retourner beaucoup de données
   */
  async getAllTransactionsUnpaginated() {
    try {
      const organizationId = await this.getOrganizationId();

      return await this.prisma.transaction.findMany({
        where: { organizationId },
        select: {
          id: true,
          amount: true,
          description: true,
          type: true,
          status: true,
          date: true,
          reference: true,
          paymentMethod: true,
          createdAt: true,
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getAllTransactionsUnpaginated");
    }
  }

  /**
   * Récupère une transaction par son ID
   */
  async getTransactionById(transactionId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.transaction.findUnique({
        where: {
          id: transactionId,
          organizationId,
        },
        include: {
          category: true,
          expense: true,
          revenue: {
            include: {
              invoice: true,
            },
          },
          organization: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: true,
          clientProcedure: {
            include: {
              procedure: true,
              client: true
            },
          },
          clientStep: {
            include: {
              step: true,
              clientProcedure: true,
            },
          },
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, "getTransactionById");
    }
  }

  /**
   * Récupère les statistiques financières
   */
  async getFinancialStats() {
    try {
      const organizationId = await this.getOrganizationId();
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Revenus du mois
      const monthlyRevenue = await this.prisma.transaction.aggregate({
        where: {
          organizationId,
          type: "REVENUE",
          status: "APPROVED",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      // Dépenses du mois
      const monthlyExpenses = await this.prisma.transaction.aggregate({
        where: {
          organizationId,
          type: "EXPENSE",
          status: "APPROVED",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      // Revenus d'aujourd'hui
      const todayRevenue = await this.prisma.transaction.aggregate({
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

      return {
        monthlyRevenue: monthlyRevenue._sum?.amount || 0,
        monthlyExpenses: monthlyExpenses._sum?.amount || 0,
        todayRevenue: todayRevenue._sum?.amount || 0,
        netIncome: (monthlyRevenue._sum?.amount || 0) - (monthlyExpenses._sum?.amount || 0),
      };
    } catch (error) {
      this.handleDatabaseError(error, "getFinancialStats");
    }
  }
} 