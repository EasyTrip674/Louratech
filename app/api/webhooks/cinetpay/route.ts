// import { SubscriptionService } from '@/lib/cinetPay/services/subscriptionService';
// import { CinetPayCallbackData } from '@/lib/cinetPay/types';
// import { verifySignature } from '@/lib/cinetPay/utils';
// import { NextRequest, NextResponse } from 'next/server';

// const subscriptionService = new SubscriptionService();

// export async function POST(request: NextRequest) {
//   try {
//     const callbackData: CinetPayCallbackData = await request.json();

//     // Vérifier la signature pour s'assurer que la requête vient bien de CinetPay
//     if (!verifySignature(callbackData)) {
//       console.error('Signature invalide pour le webhook CinetPay');
//       return NextResponse.json(
//         { message: 'Signature invalide' },
//         { status: 400 }
//       );
//     }

//     // Traiter le callback
//     await subscriptionService.handlePaymentCallback(
//       callbackData.cpm_trans_id,
//       callbackData
//     );

//     // Répondre positivement à CinetPay
//     return NextResponse.json({ message: 'Webhook traité avec succès' });
//   } catch (error) {
//     console.error('Erreur lors du traitement du webhook CinetPay:', error);
//     return NextResponse.json(
//       {
//         message: 'Erreur lors du traitement du webhook',
//         error: error instanceof Error ? error.message : 'Erreur inconnue'
//       },
//       { status: 500 }
//     );
//   }
// }