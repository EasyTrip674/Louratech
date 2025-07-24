// import { auth } from '@/lib/auth';
// import { SubscriptionService } from '@/lib/cinetPay/services/subscriptionService';
// import { headers } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';

// const subscriptionService = new SubscriptionService();

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//         headers: await headers()
//     })
//     if (!session?.user) {
//       return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
//     }

//     const { planId, organizationId, customerInfo } = await request.json();

//     if (!planId || !organizationId) {
//       return NextResponse.json(
//         { message: 'planId et organizationId sont requis' },
//         { status: 400 }
//       );
//     }

//     const returnUrl = `${process.env.NEXTAUTH_URL}/dashboard/billing/success`;

//     const result = await subscriptionService.createSubscriptionPayment({
//       organizationId,
//       planId,
//       returnUrl,
//       customerInfo,
//     });

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error('Erreur lors de la création du paiement:', error);
//     return NextResponse.json(
//       {
//         message: 'Erreur lors de la création du paiement',
//         error: error instanceof Error ? error.message : 'Erreur inconnue'
//       },
//       { status: 500 }
//     );
//   }
// }