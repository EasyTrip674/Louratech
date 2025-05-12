
import FeedBackChat from "@/components/feedback/ChatBubble";


import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">

      {children}
          <FeedBackChat />
    </div>
    </>
    
  );
}
