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
          <CopilotKit publicApiKey="sk-proj-w89eTtdFAC7GydyEuV0-NxjGWV6dFzIWPI6gAEXFTXLRDJOqUD0IvQVEfj8K5_hxV56KVz_c32T3BlbkFJOLh2tEstAMFqAVxDSculH_lO4Dnf40yVuop4ml0zHVpcefpWEkLFbgkFyD2WlCjzP6IQZcHLQA"> 
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
