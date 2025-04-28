"use client";
import styles from "@/utils/style";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import Business from "./Business";
import CTA from "./CTA";
import Footer from "./Footer";
import TargetClients from "./Clients";


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
        <TargetClients />
        <CTA />
        <Footer />
      </div>
    </div>
  </div>
  );
}