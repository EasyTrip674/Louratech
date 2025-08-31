import { Staatliches } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import TansQueryProvider from "@/context/TansQueryProvider";
import { ToastContainer } from 'react-toastify';
import { PostHogProvider } from "@/context/PostHogProvider";

const staatliches = Staatliches({
  variable: "--font-staatliches",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={staatliches.variable}>
      <body className="dark:bg-gray-900">
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
