import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { getOrgnaizationId } from "./utils.query";


export const getTransactionsDB = async () => {
  const organizationId = await getOrgnaizationId();
  const transactions = await prisma.transaction.findMany({
    where: {
      organizationId: organizationId,
    },
    include: {
        createdBy:true,
        organization: true,
        approvedBy:true,
        category:true,
        expense:true,
        revenue:true,
        clientProcedure:
        {
          include:{
            client:
            {
              include:{
                user:true,
              }
            },
            procedure:true,
          }
        },
    }
  });
  return transactions;
}



export type getTransactionsDB =  Prisma.PromiseReturnType<typeof getTransactionsDB>;


// Fonction pour récupérer une transaction par son ID
export async function getTransactionById(id: string) {
    const organizationId = await getOrgnaizationId();
    return await prisma.transaction.findUnique({
      where: {
        organizationId: organizationId,
        id,
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
        approvedBy:true,
        clientProcedure: {
          include: {
            procedure: true,
            client: {
              include: {
                user: true,
              },
            },
          },
        },
        clientStep: {
          include: {
            step: true,
            clientProcedure: true,
          },
        },
        user: true,
        procedure: true,
        step: true,
      },
    });
  }

export type getTransactionById = Prisma.PromiseReturnType<typeof getTransactionById>;