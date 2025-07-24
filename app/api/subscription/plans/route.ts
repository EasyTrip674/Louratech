import { SubscriptionService } from '@/lib/cinetPay/services/subscriptionService';
import { NextResponse } from 'next/server';

const subscriptionService = new SubscriptionService();

export async function GET() {
  try {
    const plans = await subscriptionService.getSubscriptionPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error);
    return NextResponse.json(
      {
        message: 'Erreur lors de la récupération des plans',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
