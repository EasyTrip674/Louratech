import { Metadata } from "next";
import React from "react";
import LandingPage from "@/components/landingPage/LandinPage";

export const metadata: Metadata = {
  title:"ProGestion",
  description:"ProGestion is a powerful and user-friendly project management tool designed to help teams collaborate effectively and efficiently.",
  keywords: "project management, collaboration, productivity, task management, team communication",
  // other metadata
};

export default async function Home() {

  return (
    <div>
    <LandingPage />
    </div>
  );
}
