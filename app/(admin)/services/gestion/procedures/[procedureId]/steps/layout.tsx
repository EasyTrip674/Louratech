"use client";
import React from "react";
import NotAuthorized from "@/app/not-authorized";
import useAuth from "@/lib/BackendConfig/useAuth";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = useAuth()


    // mais une page d'erreur 403

    if (!session?.user?.authorization?.can_read_step) {
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
