// import { auth } from '@/lib/auth';
// import { SubscriptionService } from '@/lib/cinetPay/services/subscriptionService';
// import { headers } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';

// const subscriptionService = new SubscriptionService();

// interface RouteParams {
//   params: {
//     organizationId: string;
//   };
// }

// export async function GET(request: NextRequest, { params }: RouteParams) {
//   try {
//     const session = await auth.api.getSession({
//         headers:await headers()
//     })
//     if (!session?.user) {
//       return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
//     }

//     const { organizationId } = params;

//     if (!organizationId) {
//       return NextResponse.json(
//         { message: 'organizationId requis' },
//         { status: 400 }
//       );
//     }

//     const subscription = await subscriptionService.getOrganizationSubscription(organizationId);

//     if (!subscription) {
//       return NextResponse.json(
//         { message: 'Aucun abonnement trouvé' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(subscription);
//   } catch (error) {
//     console.error('Erreur lors de la récupération de l\'abonnement:', error);
//     return NextResponse.json(
//       {
//         message: 'Erreur lors de la récupération de l\'abonnement',
//         error: error instanceof Error ? error.message : 'Erreur inconnue'
//       },
//       { status: 500 }
//     );
//   }
// }
