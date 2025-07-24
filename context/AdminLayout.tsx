"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { authClient } from "@/lib/auth-client";
import "@copilotkit/react-ui/styles.css";
import { useRouter } from "next/navigation";
import { CopilotKit } from "@copilotkit/react-core";
// import FeedBackChat from "@/components/feedback/ChatFeedBack";
import CopilotProvider from "@/context/CopilotProvider";

// Composant de gestion de l'authentification
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();


   

  // Gérer les redirections avec useEffect pour éviter les problèmes de hooks conditionnels
  React.useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);



  React.useEffect(() => {
    if (session && !session.userDetails.organization?.active) {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/signin");
          },
        },
      });
    }
  }, [session, router]);

  



 

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur d&apos;authentification</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Vérifier si l'organisation est active
  if (!session.userDetails.organization?.active) {
    return null;
  }

  return <>{children}</>;
}

// Composant principal du layout
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  
  // Calcul de la marge du contenu principal basé sur l'état de la sidebar
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar et Backdrop */}
      <AppSidebar />
      <Backdrop />
      
      {/* Zone de contenu principal */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        
        {/* Contenu de la page */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit publicApiKey={"ck_pub_5c0f01f684b9f9a05bf7265c110374d0"}>
      <AuthGuard>
        <AdminLayoutContent>
        <CopilotProvider>
    {children}
    </CopilotProvider>
      </AdminLayoutContent>
        {/* <FeedBackChat /> */}
      </AuthGuard>
    </CopilotKit>
  );
}
