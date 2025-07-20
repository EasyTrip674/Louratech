"use client";

import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function CopilotProvider({ children }: { children: React.ReactNode }) {
    // Initialiser les actions CopilotKit
    // useCopilotActions();
  
    return(
      <CopilotSidebar
      labels={{
        title: 'Your Assistant',
        initial: 'Hi! 👋 How can I assist you today?',
      }}
    >
    {children}
    </CopilotSidebar>
      );
    };