
import { auth } from "@/lib/auth";
import React from "react";
import { headers } from "next/headers";
import NotAuthorized from "@/app/not-authorized";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const user = await  auth.api.getSession({
    headers: await headers()
    })


    // une page d'erreur 403

    if (!user?.userDetails?.authorize?.canReadTransaction) {
        return (
          <NotAuthorized />     
        );
    }
    return (
    <>
            {children}
    </>
  );
}
