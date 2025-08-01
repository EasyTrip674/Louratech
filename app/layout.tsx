import {  Space_Grotesk } from "next/font/google";
import "./globals.css";
// import { CopilotPopup } from "@copilotkit/react-ui";
import { Analytics } from "@vercel/analytics/next"

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import TansQueryProvider from "@/context/TansQueryProvider";
// import { CopilotKit } from "@copilotkit/react-core";
import { ToastContainer } from 'react-toastify';
import { PostHogProvider } from "@/context/PostHogProvider";

const outfit = Space_Grotesk({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fr">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
              <Analytics />
              <ThemeProvider>
              <PostHogProvider>

              <TansQueryProvider>
                <SidebarProvider>
                   {children}
                    <ToastContainer />
                </SidebarProvider>
            </TansQueryProvider>
            </PostHogProvider>
              </ThemeProvider>
      </body>
    </html>
  );
}
