import { Metadata } from "next";
import React from "react";
import LandingPage from "@/components/landingPage/LandinPage";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

export const metadata: Metadata = {
  title:"ProGestion",
  description:"ProGestion is a powerful and user-friendly project management tool designed to help teams collaborate effectively and efficiently.",
  keywords: "project management, collaboration, productivity, task management, team communication",
  // other metadata
};

export default async function Home() {
    const me = await sendEmail({
      to: "guintechprod@gmail.com",
      subject: "Test Email",
     html: generateEmailMessageHtml({
        nom: "Guintech",
        sujet: "Test Email",
        content: "This is a test email sent from Next.js using Nodemailer.",
      })
    });
    console.log(me);

  return (
    <div>
    <LandingPage />
    </div>
  );
}
