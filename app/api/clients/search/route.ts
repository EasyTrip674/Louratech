import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// Types pour une meilleure typage
// interface DebtInfo {
//   hasDebt: boolean;
//   totalDebt: number;
//   unpaidInvoices: number;
//   overdueInvoices: number;
//   proceduresWithoutPayment: number;
//   details: Array<{
//     procedureName: string;
//     expectedAmount: number;
//     paidAmount: number;
//     remainingDebt: number;
//   }>;
// }

// interface ClientHistory {
//   totalProcedures: number;
//   completedProcedures: number;
//   cancelledProcedures: number;
//   inProgressProcedures: number;
//   averageCompletionTime: number;
//   paymentHistory: {
//     totalPaid: number;
//     averagePaymentDelay: number;
//     onTimePayments: number;
//     latePayments: number;
//   };
//   loyaltyScore: number;
// }

// interface PaymentCapacity {
//   creditScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
//   paymentBehavior: 'POOR' | 'NEUTRAL' | 'GOOD' | 'EXCELLENT';
//   recommendedCreditLimit: number;
//   riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
//   canAffordNewProcedure: boolean;
//   reasons: string[];
// }

// interface ProcedureConflicts {
//   hasSimilarActive: boolean;
//   duplicateProcedure: boolean;
//   resourceConflict: boolean;
//   timeConflict: boolean;
//   details: string[];
// }

// interface ClientAnalysis {
//   debtInfo: DebtInfo;
//   history: ClientHistory;
//   paymentCapacity: PaymentCapacity;
//   conflicts: ProcedureConflicts;
//   riskScore: number;
//   recommendations: string[];
// }

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const organizationId = searchParams.get("organizationId");

    // Validation des paramètres requis
    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 });
    }

    // Récupération des données du body pour les paramètres manquants
    const body = await request.json().catch(() => ({}));
    const { clientId, procedureId, dueDate } = body;
    // const { clientId, procedureId, notes, dueDate } = body;
    
    // Vérifier que le client et la procédure appartiennent à l'organisation
    const [client, procedure] = await Promise.all([
      prisma.client.findFirst({
        where: {
          organizationId,
          OR: query ? [
            { user: { firstName: { contains: query, mode: "insensitive" } } },
            { user: { lastName: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
            { phone: { contains: query, mode: "insensitive" } },
          ] : undefined,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              name: true,
              active: true,
            },
          },
          clientProcedures: {
            include: {
              procedure: {
                select: { name: true, price: true }
              },
              transactions: {
                where: { status: "APPROVED" },
                select: { amount: true, type: true }
              }
            }
          },
          invoices: {
            select: {
              totalAmount: true,
              status: true,
              dueDate: true,
              paidDate: true
            }
          }
        },
      }),
      prisma.procedure.findFirst({
        where: { 
          id: procedureId,
          organizationId 
        },
        include: {
          steps: {
            select: {
              id: true,
              name: true,
              order: true,
              price: true,
              required: true
            },
            orderBy: {
              order: "asc",
            }
          }
        }
      }),
    ]);

    // Vérification de l'existence du client et de la procédure
    if (!client) {
      return NextResponse.json(
        { error: "Client not found in this organization" },
        { status: 404 }
      );
    }

    if (!procedure) {
      return NextResponse.json(
        { error: "Procedure not found in this organization" },
        { status: 404 }
      );
    }

    // Vérifier si la procédure existe déjà pour ce client
    const existingClientProcedure = await prisma.clientProcedure.findFirst({
      where: {
        clientId,
        procedureId,
        organizationId,
        status: { not: 'CANCELLED' }
      }
    });

    if (existingClientProcedure) {
      return NextResponse.json(
        { error: "This procedure is already assigned to this client" },
        { status: 409 }
      );
    }

    // Analyse complète du client
    // const clientAnalysis = await performClientAnalysis(client, procedure);

    // Créer la procédure client avec toutes les informations d'analyse
    const clientProcedure = await prisma.clientProcedure.create({
      data: {
        clientId,
        procedureId,
        organizationId,
        // notes: `${notes || ''}\n\n--- ANALYSE AUTOMATIQUE ---\n${generateAnalysisReport(clientAnalysis)}`,
        dueDate: dueDate ? new Date(dueDate) : null,
        reference: `REF-${Date.now()}`,
        status: "IN_PROGRESS",
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                name: true,
                active: true,
              },
            },
          },
        },
        procedure: {
          select: {
            name: true,
            description: true,
            price: true,
            steps: {
              select: {
                id: true,
                name: true,
                order: true,
                price: true,
                required: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    // Créer les étapes client associées seulement si la procédure a des étapes
    let clientSteps = null;
    if (procedure.steps && procedure.steps.length > 0) {
      clientSteps = await Promise.all(
        procedure.steps.map((step) =>
          prisma.clientStep.create({
            data: {
              clientProcedureId: clientProcedure.id,
              stepId: step.id,
              price: step.price || 0,
              status: "IN_PROGRESS",
            },
          })
        )
      );
    }

    return NextResponse.json({
      ...clientProcedure,
      steps: clientSteps,
      // clientAnalysis,
    });
  } catch  {
    console.error("Error creating client procedure:");
    
    // Gestion spécifique des erreurs Prisma

    return NextResponse.json(
      { 
        error: "Internal server error",
        message: process.env.NODE_ENV === 'development' ? "erreur" : undefined
      }, 
      { status: 500 }
    );
  }
}

// Nouvelle fonction d'analyse complète du client
// async function performClientAnalysis(client: any, procedure: any): Promise<ClientAnalysis> {
//   const [debtInfo, history, paymentCapacity, conflicts] = await Promise.all([
//     analyzeClientDebt(client),
//     analyzeClientHistory(client),
//     analyzePaymentCapacity(client),
//     checkProcedureConflicts(client, procedure)
//   ]);

//   const riskScore = calculateClientRiskScore(debtInfo, history, paymentCapacity);
//   const recommendations = generateRecommendations(debtInfo, history, paymentCapacity, riskScore);

//   return {
//     debtInfo,
//     history,
//     paymentCapacity,
//     conflicts,
//     riskScore,
//     recommendations
//   };
// }

// SCENARIO 1: Analyser les dettes du client
// async function analyzeClientDebt(client: any): Promise<DebtInfo> {
//   const debtInfo: DebtInfo = {
//     hasDebt: false,
//     totalDebt: 0,
//     unpaidInvoices: 0,
//     overdueInvoices: 0,
//     proceduresWithoutPayment: 0,
//     details: []
//   };

//   try {
//     // Calculer les dettes basées sur les procédures sans paiement complet
//     if (client.clientProcedures && Array.isArray(client.clientProcedures)) {
//       for (const clientProcedure of client.clientProcedures) {
//         const procedurePrice = clientProcedure.procedure?.price || 0;
//         const totalPaid = clientProcedure.transactions
//           ?.filter((t: any) => t.type === 'REVENUE')
//           ?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;
        
//         const debt = procedurePrice - totalPaid;
//         if (debt > 0) {
//           debtInfo.hasDebt = true;
//           debtInfo.totalDebt += debt;
//           debtInfo.proceduresWithoutPayment++;
//           debtInfo.details.push({
//             procedureName: clientProcedure.procedure?.name || 'Unknown',
//             expectedAmount: procedurePrice,
//             paidAmount: totalPaid,
//             remainingDebt: debt
//           });
//         }
//       }
//     }

//     // Analyser les factures impayées
//     if (client.invoices && Array.isArray(client.invoices)) {
//       const now = new Date();
//       for (const invoice of client.invoices) {
//         if (invoice.status !== 'PAID') {
//           debtInfo.unpaidInvoices++;
//           if (invoice.dueDate && new Date(invoice.dueDate) < now) {
//             debtInfo.overdueInvoices++;
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error analyzing client debt:", error);
//   }
//   return debtInfo;
// }

// SCENARIO 2: Analyser l'historique du client
// async function analyzeClientHistory(client: any): Promise<ClientHistory> {
//   const history: ClientHistory = {
//     totalProcedures: 0,
//     completedProcedures: 0,
//     cancelledProcedures: 0,
//     inProgressProcedures: 0,
//     averageCompletionTime: 0,
//     paymentHistory: {
//       totalPaid: 0,
//       averagePaymentDelay: 0,
//       onTimePayments: 0,
//       latePayments: 0
//     },
//     loyaltyScore: 0
//   };

//   try {
//     if (client.clientProcedures && Array.isArray(client.clientProcedures)) {
//       history.totalProcedures = client.clientProcedures.length;

//       // Analyser les statuts des procédures
//       client.clientProcedures.forEach((proc: any) => {
//         switch (proc.status) {
//           case 'COMPLETED':
//             history.completedProcedures++;
//             break;
//           case 'CANCELLED':
//             history.cancelledProcedures++;
//             break;
//           case 'IN_PROGRESS':
//           case 'PENDING':
//             history.inProgressProcedures++;
//             break;
//         }
//       });

//       // Calculer le score de fidélité
//       if (history.totalProcedures > 0) {
//         const completionRate = history.completedProcedures / history.totalProcedures;
//         const cancellationRate = history.cancelledProcedures / history.totalProcedures;
//         history.loyaltyScore = Math.round((completionRate * 100) - (cancellationRate * 50));
//       }
//     }

//     // Analyser l'historique de paiement
//     if (client.invoices && Array.isArray(client.invoices)) {
//       client.invoices.forEach((invoice: any) => {
//         if (invoice.status === 'PAID' && invoice.paidDate && invoice.totalAmount) {
//           history.paymentHistory.totalPaid += invoice.totalAmount;
          
//           if (invoice.dueDate) {
//             const paymentDate = new Date(invoice.paidDate);
//             const dueDate = new Date(invoice.dueDate);
            
//             if (paymentDate <= dueDate) {
//               history.paymentHistory.onTimePayments++;
//             } else {
//               history.paymentHistory.latePayments++;
//             }
//           }
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error analyzing client history:", error);
//   }

//   return history;
// }

// // SCENARIO 3: Analyser la capacité de paiement
// async function analyzePaymentCapacity(client: any): Promise<PaymentCapacity> {
//   const capacity: PaymentCapacity = {
//     creditScore: 'UNKNOWN',
//     paymentBehavior: 'NEUTRAL',
//     recommendedCreditLimit: 0,
//     riskLevel: 'MEDIUM',
//     canAffordNewProcedure: true,
//     reasons: []
//   };

//   try {
//     if (client.invoices && Array.isArray(client.invoices)) {
//       const totalInvoices = client.invoices.length;
//       const paidInvoices = client.invoices.filter((inv: any) => inv.status === 'PAID').length;
//       const overdueInvoices = client.invoices.filter((inv: any) => 
//         inv.status !== 'PAID' && inv.dueDate && new Date(inv.dueDate) < new Date()
//       ).length;

//       // Évaluer le comportement de paiement
//       if (totalInvoices > 0) {
//         const paymentRate = paidInvoices / totalInvoices;
//         const overdueRate = overdueInvoices / totalInvoices;

//         if (paymentRate >= 0.9 && overdueRate <= 0.1) {
//           capacity.paymentBehavior = 'EXCELLENT';
//           capacity.creditScore = 'HIGH';
//           capacity.riskLevel = 'LOW';
//           capacity.recommendedCreditLimit = 10000;
//         } else if (paymentRate >= 0.7 && overdueRate <= 0.3) {
//           capacity.paymentBehavior = 'GOOD';
//           capacity.creditScore = 'MEDIUM';
//           capacity.riskLevel = 'MEDIUM';
//           capacity.recommendedCreditLimit = 5000;
//         } else {
//           capacity.paymentBehavior = 'POOR';
//           capacity.creditScore = 'LOW';
//           capacity.riskLevel = 'HIGH';
//           capacity.recommendedCreditLimit = 1000;
//           capacity.canAffordNewProcedure = false;
//           capacity.reasons.push('Historique de paiement insuffisant');
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error analyzing payment capacity:", error);
//   }

//   return capacity;
// }

// // SCENARIO 4: Vérifier les conflits de procédures
// async function checkProcedureConflicts(client: any, procedure: any): Promise<ProcedureConflicts> {
//   const conflicts: ProcedureConflicts = {
//     hasSimilarActive: false,
//     duplicateProcedure: false,
//     resourceConflict: false,
//     timeConflict: false,
//     details: []
//   };

//   try {
//     if (client.clientProcedures && Array.isArray(client.clientProcedures)) {
//       // Vérifier les procédures similaires actives
//       const activeProcedures = client.clientProcedures.filter((cp: any) => 
//         cp.status === 'IN_PROGRESS' || cp.status === 'PENDING'
//       );

//       activeProcedures.forEach((activeProc: any) => {
//         if (activeProc.procedureId === procedure.id) {
//           conflicts.duplicateProcedure = true;
//           conflicts.details.push(`Procedure "${procedure.name || 'Unknown'}" already in progress`);
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error checking procedure conflicts:", error);
//   }

//   return conflicts;
// }

// // SCENARIO 5: Calculer le score de risque
// function calculateClientRiskScore(debtInfo: DebtInfo, history: ClientHistory, paymentCapacity: PaymentCapacity): number {
//   let riskScore = 50; // Score de base sur 100 (50 = neutre)

//   try {
//     // Facteurs de dette
//     if (debtInfo.hasDebt && typeof debtInfo.totalDebt === 'number') {
//       riskScore += Math.min(debtInfo.totalDebt / 100, 30); // Max +30 points de risque
//     }
//     if (typeof debtInfo.overdueInvoices === 'number' && debtInfo.overdueInvoices > 0) {
//       riskScore += debtInfo.overdueInvoices * 5; // +5 points par facture en retard
//     }

//     // Facteurs d'historique
//     if (typeof history.loyaltyScore === 'number' && history.loyaltyScore > 0) {
//       riskScore -= Math.min(history.loyaltyScore / 2, 20); // Max -20 points de risque
//     }
//     if (typeof history.cancelledProcedures === 'number' && history.cancelledProcedures > 0) {
//       riskScore += history.cancelledProcedures * 3; // +3 points par procédure annulée
//     }

//     // Facteurs de capacité de paiement
//     switch (paymentCapacity.riskLevel) {
//       case 'LOW':
//         riskScore -= 15;
//         break;
//       case 'HIGH':
//         riskScore += 15;
//         break;
//     }
//   } catch (error) {
//     console.error("Error calculating risk score:", error);
//   }

//   return Math.max(0, Math.min(100, Math.round(riskScore)));
// }

// // Générer un rapport d'analyse
// function generateAnalysisReport(analysis: ClientAnalysis): string {
//   try {
//     let report = `SCORE DE RISQUE: ${analysis.riskScore}/100\n\n`;
    
//     report += `DETTES:\n`;
//     if (analysis.debtInfo.hasDebt) {
//       report += `- Dette totale: ${analysis.debtInfo.totalDebt}€\n`;
//       report += `- Procédures non payées: ${analysis.debtInfo.proceduresWithoutPayment}\n`;
//       report += `- Factures en retard: ${analysis.debtInfo.overdueInvoices}\n`;
//     } else {
//       report += `- Aucune dette détectée\n`;
//     }
    
//     report += `\nHISTORIQUE:\n`;
//     report += `- Total procédures: ${analysis.history.totalProcedures}\n`;
//     report += `- Taux de completion: ${analysis.history.totalProcedures > 0 ? Math.round((analysis.history.completedProcedures / analysis.history.totalProcedures) * 100) : 0}%\n`;
//     report += `- Score de fidélité: ${analysis.history.loyaltyScore}\n`;
    
//     report += `\nCAPACITÉ DE PAIEMENT:\n`;
//     report += `- Comportement: ${analysis.paymentCapacity.paymentBehavior}\n`;
//     report += `- Niveau de risque: ${analysis.paymentCapacity.riskLevel}\n`;
//     report += `- Limite de crédit recommandée: ${analysis.paymentCapacity.recommendedCreditLimit}€\n`;
    
//     if (analysis.conflicts.details.length > 0) {
//       report += `\nCONFLITS DÉTECTÉS:\n`;
//       analysis.conflicts.details.forEach((detail: string) => {
//         report += `- ${detail}\n`;
//       });
//     }
    
//     report += `\nRECOMMANDATIONS:\n`;
//     analysis.recommendations.forEach((rec: string) => {
//       report += `- ${rec}\n`;
//     });
    
//     return report;
//   } catch (error) {
//     console.error("Error generating analysis report:", error);
//     return "Erreur lors de la génération du rapport d'analyse";
//   }
// }

// // Générer des recommandations
// function generateRecommendations(debtInfo: DebtInfo, history: ClientHistory, paymentCapacity: PaymentCapacity, riskScore: number): string[] {
//   const recommendations: string[] = [];
  
//   try {
//     if (riskScore > 70) {
//       recommendations.push("🔴 RISQUE ÉLEVÉ - Demander un acompte avant de commencer");
//       recommendations.push("📞 Contacter le client pour discuter des conditions de paiement");
//     } else if (riskScore > 50) {
//       recommendations.push("🟡 RISQUE MODÉRÉ - Surveiller les paiements de près");
//     } else {
//       recommendations.push("🟢 RISQUE FAIBLE - Client fiable");
//     }
    
//     if (debtInfo.hasDebt) {
//       recommendations.push("💰 Régler les dettes existantes avant d'engager de nouveaux services");
//     }
    
//     if (history.loyaltyScore > 80) {
//       recommendations.push("⭐ Client fidèle - Considérer des remises ou avantages");
//     }
    
//     if (paymentCapacity.paymentBehavior === 'POOR') {
//       recommendations.push("⚠️ Exiger un paiement intégral à l'avance");
//     }
//   } catch (error) {
//     console.error("Error generating recommendations:", error);
//     recommendations.push("⚠️ Erreur lors de la génération des recommandations");
//   }
  
//   return recommendations;
// }

// // Nouvelle fonction pour générer un rapport client complet
// export async function generateClientReport(clientName: string, organizationId: string) {
//   try {
//     const client = await prisma.client.findFirst({
//       where: {
//         organizationId,
//         OR: [
//           { user: { firstName: { contains: clientName, mode: "insensitive" } } },
//           { user: { lastName: { contains: clientName, mode: "insensitive" } } },
//           { user: { name: { contains: clientName, mode: "insensitive" } } },
//         ]
//       },
//       include: {
//         user: true,
//         clientProcedures: {
//           include: {
//             procedure: true,
//             transactions: true
//           }
//         },
//         invoices: true
//       }
//     });

//     if (!client) {
//       return {
//         success: false,
//         error: `Client "${clientName}" non trouvé dans cette organisation`
//       };
//     }

//     const analysis = await performClientAnalysis(client, null);
    
//     return {
//       success: true,
//       client: {
//         name: client.name || `${client.firstName} ${client.lastName}`,
//         email: client.email,
//         phone: client.phone
//       },
//       analysis,
//       report: generateAnalysisReport(analysis)
//     };
//   } catch (error) {
//     console.error("Error generating client report:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la génération du rapport client"
//     };
//   }
// }