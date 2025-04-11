"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { authClient } from "@/lib/auth-client";
import Loading from "../laoding";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

    // redirect user to login page if not authenticated
    const { data: session, isPending, error } = authClient.useSession();
    if (isPending) return <Loading />;
    if (error) return <div>{error.message}</div>;
    if (!session) {
      window.location.href = "/auth/signin";
      return null;
    }

  return (
   <>
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
      </div>
      <CopilotPopup
        instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
        labels={{
          title: "Gestion Agence IA",
          initial: "Ici pour vous aider ! Je suis à votre disposition pour répondre à vos questions. Faire des actions sur l'application ou vous aider à trouver des informations. Fournir des indications sur les fonctionnalités de l'application. Faire des bilans sur les actions effectuées. Je suis là pour vous aider !",
        }}
      />
   </>
  );
}
