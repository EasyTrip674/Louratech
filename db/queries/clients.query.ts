import prisma from "../prisma";


export const clientsTableOrganizationDB = async (organizationId?: string) => {
  const clients = await prisma.client.findMany({
    select: {
        id: true,
        address: true,
        user:{
            select:{
                firstName: true,
                lastName: true,
                email: true,
                active: true,
            }
        }
  }});
  return clients;
}

export type clientsTableOrganization = ReturnType<typeof clientsTableOrganizationDB>;