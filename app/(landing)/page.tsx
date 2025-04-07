import { Metadata } from "next";
import React from "react";
import LandingPage from "@/components/landingPage/LandinPage";

export const metadata: Metadata = {
 title: "Modals", 
 description: "Modals examples",
  // other metadata
};

export default function Home() {
  return (
    <div>
    <LandingPage />
    </div>
  );
}
