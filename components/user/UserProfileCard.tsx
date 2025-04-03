"use User profile";
import React from "react";

import Image from "next/image";
import { Role } from "@prisma/client";


export default function UserProfileCard({ email, firstName,lastName,phone,address,imageSrc , role = Role.CLIENT }: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  imageSrc?: string;
  role:Role
}) {
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
             {imageSrc ? <Image src={imageSrc} alt="user" width={80} height={80} /> : <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-2xl font-semibold">
              {/* first letter */}
              {firstName?.charAt(0)}
              </div>}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
               {firstName} {lastName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {role}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {address}
                </p>
              </div>
            </div>
         
          </div>
         
        </div>
      </div>
     
    </>
  );
}
