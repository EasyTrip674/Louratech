import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Temp from "./Temp";

export const metadata: Metadata = {
 title: "Modals", 
 description: "Modals examples",
  // other metadata
};

export default function Home() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Modals" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
      <Link href="/services">Dashboard</Link>
      <Temp />
      </div>
    </div>
  );
}
