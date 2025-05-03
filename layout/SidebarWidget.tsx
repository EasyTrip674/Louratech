import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SidebarWidget() {
  const session = authClient.useSession();
  return (
    <>
    {
      session.data?.userDetails?.organization?.logo ?
      <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <Image
        src={session.data?.userDetails?.organization?.logo ?? "/fallback/logo.png"}
        alt="Illustration"
        width={300}
        height={300}
        className="mx-auto mb-4 h-full w-full max-w-[200px] rounded-2xl object-cover object-center dark:opacity-80 lg:max-w-[300px]"
       />
    </div>
    :
    <div className="flex flex-col items-center space-y-4 py-3 w-full">
          <div className="w-32 h-20 bg-gray-800/80 rounded-md flex items-center justify-center border border-gray-700 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <Link
            href="/organization/settings"
            className="text-yellow-500 hover:text-yellow-300 text-sm font-medium text-center group transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center space-x-1">
              <span>Ajouter un logo</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
      </div>
      }
    </>
   
  );
}

