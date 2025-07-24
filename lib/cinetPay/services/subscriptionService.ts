// lib/services/subscriptionService.ts
import { BillingInterval, PaymentStatus, PaymentType, PrismaClient, SubscriptionStatus, } from '@prisma/client';
import { CinetPayClient } from '../client';
import { formatAmount, generateTransactionId } from '../utils';

const prisma = new PrismaClient();
const cinetPayClient = new CinetPayClient();

export interface CreateSubscriptionPaymentParams {
  organizationId: string;
  planId: string;
  returnUrl: string;
  customerInfo?: {
    email?: string;
    name?: string;
    phone?: string;
    address?: string;
  };
}

export interface SubscriptionPaymentResult {
  paymentUrl: string;
  transactionId: string;
  paymentId: string;
}

export class SubscriptionService {
  async createSubscriptionPayment(params: CreateSubscriptionPaymentParams): Promise<SubscriptionPaymentResult> {
    const { organizationId, planId, returnUrl, customerInfo } = params;

    // Récupérer les informations du plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      throw new Error('Plan d\'abonnement introuvable ou inactif');
    }

    // Vérifier l'organisation
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error('Organisation introuvable');
    }

    // Générer un ID de transaction unique
    const transactionId = generateTransactionId();
    
    // Calculer les dates d'abonnement
    const currentPeriodStart = new Date();
    const currentPeriodEnd = this.calculatePeriodEnd(currentPeriodStart, plan.interval, plan.intervalCount);
    const trialEnd = plan.trialDays ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000) : undefined;

    // Créer l'abonnement en base
    const subscription = await prisma.subscription.create({
      data: {
        organizationId,
        planId,
        status: plan.trialDays ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
        currentPeriodStart,
        currentPeriodEnd,
        trialEnd,
      },
    });

    // Créer l'enregistrement de paiement
    const payment = await prisma.payment.create({
      data: {
        organizationId,
        subscriptionId: subscription.id,
        transactionId,
        amount: plan.amount,
        currency: plan.currency,
        description: `Abonnement ${plan.name} - ${organization.name}`,
        status: PaymentStatus.PENDING,
        paymentType: PaymentType.SUBSCRIPTION,
        metadata: {
          planId,
          subscriptionId: subscription.id,
          billingInterval: plan.interval,
          intervalCount: plan.intervalCount,
        },
      },
    });

    // Préparer les données pour CinetPay
    const cinetPayData = {
      amount: formatAmount(plan.amount),
      currency: plan.currency,
      transaction_id: transactionId,
      description: `Abonnement ${plan.name}`,
      return_url: returnUrl,
      notify_url: `${process.env.NEXTAUTH_URL}/api/webhooks/cinetpay`,
      customer_email: customerInfo?.email,
      customer_name: customerInfo?.name,
      customer_phone_number: customerInfo?.phone,
      customer_address: customerInfo?.address,
      lang: 'fr',
      metadata: JSON.stringify({
        paymentId: payment.id,
        organizationId,
        subscriptionId: subscription.id,
      }),
    };

    // Créer le paiement avec CinetPay
    const cinetPayResponse = await cinetPayClient.createPayment(cinetPayData);

    if (cinetPayResponse.code !== '201') {
      // Supprimer les enregistrements créés en cas d'erreur
      await prisma.payment.delete({ where: { id: payment.id } });
      await prisma.subscription.delete({ where: { id: subscription.id } });
      throw new Error(`Erreur CinetPay: ${cinetPayResponse.message}`);
    }

    // Mettre à jour le paiement avec les informations CinetPay
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerPayId: cinetPayResponse.data.payment_token,
        metadata: {
          ...payment.metadata as object,
          paymentToken: cinetPayResponse.data.payment_token,
          paymentUrl: cinetPayResponse.data.payment_url,
        },
      },
    });

    return {
      paymentUrl: cinetPayResponse.data.payment_url,
      transactionId,
      paymentId: payment.id,
    };
  }

  async handlePaymentCallback(transactionId: string, callbackData: any): Promise<void> {
    // Récupérer le paiement
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!payment) {
      throw new Error('Paiement introuvable');
    }

    // Vérifier le statut du paiement avec CinetPay
    const paymentStatus = await cinetPayClient.checkPaymentStatus(transactionId);

    if (paymentStatus.code === '00' && paymentStatus.data.status === 'ACCEPTED') {
      // Paiement réussi
      await this.handleSuccessfulPayment(payment);
    } else {
      // Paiement échoué
      await this.handleFailedPayment(payment, paymentStatus.message);
    }
  }

  private async handleSuccessfulPayment(payment: any): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Mettre à jour le paiement
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
        },
      });

      // Mettre à jour l'abonnement
      await tx.subscription.update({
        where: { id: payment.subscriptionId },
        data: {
          status: SubscriptionStatus.ACTIVE,
        },
      });

      // Activer l'organisation si elle ne l'était pas
      await tx.organization.update({
        where: { id: payment.organizationId },
        data: {
          active: true,
        },
      });
    });
  }

  private async handleFailedPayment(payment: any, errorMessage: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Mettre à jour le paiement
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          metadata: {
            ...payment.metadata as object,
            errorMessage,
          },
        },
      });

      // Mettre à jour l'abonnement
      await tx.subscription.update({
        where: { id: payment.subscriptionId },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });
    });
  }

  async renewSubscription(subscriptionId: string): Promise<SubscriptionPaymentResult> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        Organization: true,
        plan: true,
      },
    });

    if (!subscription) {
      throw new Error('Abonnement introuvable');
    }

    // Calculer la nouvelle période
    const newPeriodStart = subscription.currentPeriodEnd;
    const newPeriodEnd = this.calculatePeriodEnd(newPeriodStart, subscription.plan.interval, subscription.plan.intervalCount);

    return this.createSubscriptionPayment({
      organizationId: subscription.organizationId,
      planId: subscription.planId,
      returnUrl: `${process.env.NEXTAUTH_URL}/dashboard/billing/success`,
    });
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<void> {
    const updateData: any = {
      canceledAt: new Date(),
    };

    if (cancelAtPeriodEnd) {
      updateData.cancelAtPeriodEnd = true;
    } else {
      updateData.status = SubscriptionStatus.CANCELED;
    }

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
    });
  }

  async checkExpiredSubscriptions(): Promise<void> {
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        currentPeriodEnd: {
          lt: new Date(),
        },
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL],
        },
      },
    });

    for (const subscription of expiredSubscriptions) {
      if (subscription.cancelAtPeriodEnd) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.CANCELED,
          },
        });
      } else {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.PAST_DUE,
          },
        });
      }
    }
  }

  private calculatePeriodEnd(start: Date, interval: BillingInterval, count: number): Date {
    const end = new Date(start);
    
    switch (interval) {
      case BillingInterval.MONTH:
        end.setMonth(end.getMonth() + count);
        break;
      case BillingInterval.YEAR:
        end.setFullYear(end.getFullYear() + count);
        break;
      case BillingInterval.WEEK:
        end.setDate(end.getDate() + (count * 7));
        break;
      default:
        throw new Error('Intervalle de facturation non supporté');
    }
    
    return end;
  }

  async getOrganizationSubscription(organizationId: string) {
    return prisma.subscription.findFirst({
      where: {
        organizationId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL, SubscriptionStatus.PAST_DUE],
        },
      },
      include: {
        plan: true,
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  async getSubscriptionPlans() {
    return prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        amount: 'asc',
      },
    });
  }
}