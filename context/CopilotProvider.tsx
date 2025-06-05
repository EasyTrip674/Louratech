"use client";

import { useCopilotActions } from "@/hooks/useCopilotActions";

export default function CopilotProvider({ children }: { children: React.ReactNode }) {
    // Initialiser les actions CopilotKit
    useCopilotActions();
  
    
    return(
    <>
    {children}
    </>
      );
    };