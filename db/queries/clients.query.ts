import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { getOrgnaizationId } from "./utils.query";


export const clientsTableOrganizationDB = async () => {
  const organizationId = await getOrgnaizationId();
  const clients = await prisma.client.findMany({
    where: {
      organizationId: organizationId,
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
  return clients;
}

export type clientsTableOrganizationDB =  Prisma.PromiseReturnType<typeof clientsTableOrganizationDB>;


export const clientProfileDB = async (clientId: string) => {
  const organizationId = await getOrgnaizationId();
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
      organizationId: organizationId,
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



// for AddCLientTOProcedureModal
export const getCLientsIdWithNameDB = async () => prisma.client.findMany({
  where: {
    organizationId: await getOrgnaizationId(),
  },
  select: {
    id: true,
    user: {
      select: {
        firstName: true,
        lastName: true,
      },
    },  
  },
})

export type ClientIdWithNameDB = Prisma.PromiseReturnType<typeof getCLientsIdWithNameDB>;