"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
// import { authClient } from "@/lib/auth-client";
// import Loading from "../try";
// import {  CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { authClient } from "@/lib/auth-client";
import Loading from "../try";
import { useRouter } from "next/navigation";
import FeedBackChat from "@/components/feedback/ChatFeedBack";
import { CopilotKit } from "@copilotkit/react-core";


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
    const router = useRouter();

    // redirect user to login page if not authenticated
    const { data: session ,isPending,error } = authClient.useSession();
    if (isPending) return <Loading />;
    if (error) return <div>{error.message}</div>;
    if (!session) {
      window.location.href = "/auth/signin";
      return null;
    }

    if (!session.userDetails.organization?.active) {
      // deconnect user
       authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/signin"); // redirect to login page
          },
        },
      });
      return null;
    }

  return (
   <>

<CopilotKit publicApiKey={"key"}>
    {/* <CopilotSidebar
     instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
     labels={{
       title: "LouraIA",
       initial: "Comment puis vous aider ?",
     }}
    > */}
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
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>

      </div>
        <FeedBackChat />
  </>
   {/* </CopilotSidebar> */}
 </CopilotKit>


  

   </>
  );
}
