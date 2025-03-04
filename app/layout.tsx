import { Outfit } from "next/font/google";
import "./globals.css";
import { CopilotPopup } from "@copilotkit/react-ui";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import TansQueryProvider from "@/context/TansQueryProvider";
import { CopilotKit } from "@copilotkit/react-core";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
          <CopilotKit publicApiKey="<your-copilot-cloud-public-api-key>"> 
        
              <ThemeProvider>
              <TansQueryProvider>
                <SidebarProvider>
                    {children}
              
                </SidebarProvider>
            </TansQueryProvider>
              </ThemeProvider>
        </CopilotKit>

      </body>
    </html>
  );
}
