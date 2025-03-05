import { Prisma } from "@prisma/client";
import prisma from "../prisma";


export const employeesTableOrganizationDB = async (organizationId?: string) => {
  const employees = await prisma.admin.findMany({
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
  const employee = await prisma.admin.findUnique({
    where: {
      id: employeeId,
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
  return employee;
}

export type employeeProfileDB =  Prisma.PromiseReturnType<typeof employeeProfileDB>;