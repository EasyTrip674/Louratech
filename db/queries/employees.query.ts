import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { getOrgnaizationId } from "./utils.query";


export const employeesTableOrganizationDB = async () => {
  const organizationId = await getOrgnaizationId();
  const employees = await prisma.admin.findMany({
    where: {
      organizationId: organizationId,
    },
    select: {
        id: true,
        address: true,
        phone: true,
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
  return employees;
}

export type employeesTableOrganizationDB =  Prisma.PromiseReturnType<typeof employeesTableOrganizationDB>;


export const employeeProfileDB = async (employeeId: string) => {
  const organizationId = await getOrgnaizationId();
  const employee = await prisma.admin.findUnique({
    where: {
      id: employeeId,
      organizationId: organizationId,
    },
    select: {
        id: true,
        address: true,
        phone: true,
        user:{
            select:{
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                active: true,
                authorize:true,
            }
        }
  }});
  return employee;
}

export type employeeProfileDB =  Prisma.PromiseReturnType<typeof employeeProfileDB>;