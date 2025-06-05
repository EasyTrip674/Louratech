"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { authClient } from "@/lib/auth-client";
import Loading from "../try";
// import {  CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useRouter } from "next/navigation";
// import { CopilotKit } from "@copilotkit/react-core";
// import CopilotProvider from "@/context/CopilotProvider";
import FeedBackChat from "@/components/feedback/ChatFeedBack";



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

  //   const copilotInstructions = `
  //   Tu es LouraIA, l'assistant intelligent pour ${session?.userDetails.organization?.name || 'cette organisation'}.
    
  //   Contexte utilisateur:
  //   - Nom: ${session?.userDetails.name}
  //   - Rôle: ${session?.userDetails.role}
  //   - Organisation: ${session?.userDetails.organization?.name}
    
  //   Tu as accès aux données suivantes de l'organisation:
  //   - Clients et leurs informations avec des rapports et recommandations
  //   - Procédures et leur statut d'avancement  
  //   - Transactions financières (dépenses, revenus, transferts)
  //   - Factures et leur statut de paiement
  //   - Statistiques générales de l'organisation
    
  //   Tes capacités:
  //   - Rechercher et filtrer les clients, procédures, transactions
  //   - Créer de nouvelles procédures client
  //   - Générer des résumés financiers
  //   - Fournir des statistiques et analyses
    
  //   Réponds de manière professionnelle et utile. Si tu ne peux pas accéder à certaines données,
  //   suggère à l'utilisateur comment obtenir l'information via l'interface.
    
  //   Utilise un ton français professionnel et convivial.
  // `;


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
{/* 
<CopilotKit publicApiKey={"akk"}>
  <CopilotProvider>
  <CopilotSidebar
     instructions={copilotInstructions}
     labels={{
      title: "LouraIA",
      initial: "Comment puis-je vous aider aujourd'hui ?",
      placeholder: "Posez votre question...",
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
   {/* </CopilotSidebar>
  </CopilotProvider>
 </CopilotKit>
 */}

  

   </>
  );
}
