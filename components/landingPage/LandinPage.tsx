"use client";
import styles from "@/utils/style";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import Business from "./Business";
import Billing from "./Billing";
import CardDeal from "./CardDeal";
import Testimonials from "./Testimonials";
import { Clients, CTA, Footer } from ".";


export default function LandingPage() {
  return (
    <div className="bg-primary w-full overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>
    
    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth} container`}>
        <Stats />
        <Business />
        {/* <Billing />
        <CardDeal />
        <Testimonials /> */}
        <Clients />
        <CTA />
        <Footer />
      </div>
    </div>
  </div>
  );
}