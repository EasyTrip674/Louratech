import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";

export const getOrganizationsSupAdmin =  () => prisma.organization.findMany({
    include: { admins: true, users: true,
      _count:{
        select:{
          admins:true,
          users:true
        }
      }
     },
  });


export type  getOrganizationsSupAdmin  = Prisma.PromiseReturnType<typeof getOrganizationsSupAdmin>