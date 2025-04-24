import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import UserCredentialsManage from "@/components/user/ChangePasswordFormModal";
import UserProfileCard from "../../../../../../components/user/UserProfileCard";
import { employeeProfileDB } from "@/db/queries/employees.query";
import { Role } from "@prisma/client";
import EmployeetInfoCard from "./EmployeeInfoCard";
import Authorization from "@/components/user/Authorization";
import prisma from "@/db/prisma";

export const metadata: Metadata = {
    title: "employee",
    description: "employee page",
    // other metadata
};

export default async function Profile(
    {params:{employeeId}}: {params: {employeeId: string}}

) {

   const employee = await employeeProfileDB(employeeId);

    if (!employee) {
        return notFound();
    }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          employee
        </h3>
        <div className="space-y-6">
          <UserProfileCard 
            role={Role.EMPLOYEE}
            email={employee.user.email}
            firstName={employee.user.firstName || ""}
            lastName={employee.user.lastName || ""}
            phone={employee.phone || ""}
            address={employee.address || ""}
            imageSrc={""}
           />
          <EmployeetInfoCard employee={employee} />
          <UserCredentialsManage userId={employee.user.id} email={employee.user.email} active={employee.user.active} role={Role.EMPLOYEE} />
        </div>
      </div>

      <div>
          <Authorization initialAuthorizations={employee.user.authorize} />
        </div>
    </div>
  );
}
