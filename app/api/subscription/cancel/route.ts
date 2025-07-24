// import { auth } from '@/lib/auth';
// // import { SubscriptionService } from '@/lib/cinetPay/services/subscriptionService';
// import { headers } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';

// // const subscriptionService = new SubscriptionService();

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//         headers:await headers()
//     })
//     if (!session?.user) {
//       return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
//     }

//     // const { subscriptionId, cancelAtPeriodEnd = true } = await request.json();

//     // if (!subscriptionId) {
//     //   return NextResponse.json(
//     //     { message: 'subscriptionId requis' },
//     //     { status: 400 }
//     //   );
//     // }

//     // await subscriptionService.cancelSubscription(subscriptionId, cancelAtPeriodEnd);

//     return NextResponse.json({ message: 'Abonnement annulé avec succès' });
//   } catch (error) {
//     console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
//     return NextResponse.json(
//       {
//         message: 'Erreur lors de l\'annulation de l\'abonnement',
//         error: error instanceof Error ? error.message : 'Erreur inconnue'
//       },
//       { status: 500 }
//     );
//   }
// }