
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";


import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">

      {children}
          <div className="fixed bottom-6 right-6 z-50  sm:block">
            <ThemeTogglerTwo />
          </div>
    </div>
  );
}
