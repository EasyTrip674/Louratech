import { Prisma } from "@prisma/client";
import prisma from "../prisma";


export const clientsTableOrganizationDB = async (organizationId?: string) => {
  const clients = await prisma.client.findMany({
    select: {
        id: true,
        address: true,
        phone: true,
        passport: true,
        birthDate: true,
        fatherLastName: true,
        fatherFirstName: true,
        motherLastName: true,
        motherFirstName: true,
        user:{
            select:{
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                active: true,
            }
        }
  }});
  return clients;
}

export type clientsTableOrganizationDB =  Prisma.PromiseReturnType<typeof clientsTableOrganizationDB>;


export const clientProfileDB = async (clientId: string) => {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
    select: {
        id: true,
        address: true,
        phone: true,
        passport: true,
        birthDate: true,
        fatherLastName: true,
        fatherFirstName: true,
        motherLastName: true,
        motherFirstName: true,
        user:{
            select:{
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                active: true,
            }
        }
  }});
  return client;
}

export type clientProfileDB =  Prisma.PromiseReturnType<typeof clientProfileDB>;