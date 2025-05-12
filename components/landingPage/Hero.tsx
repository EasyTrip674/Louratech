"use client";
import { useCallback, useEffect, useState } from 'react';
// import Image from 'next/image';
import { motion } from 'framer-motion';
import GetStarted from './GetStarted';
import GradientBackground from './GradientBackground';
import { DollarSign, ArrowRight, TrendingUp, ShieldCheck, Smartphone } from 'lucide-react';
import YouTubeEmbed from '../ui/video/YouTubeEmbed';

// Animation variants (keeping the existing ones)
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15,
      delay: 0.6
    }
  }
};

const shimmer = {
  hidden: { backgroundPosition: "0% 50%" },
  visible: { 
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { 
      repeat: Infinity, 
      duration: 3, 
      ease: "linear" 
    }
  }
};

const PromoBanner = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-3 py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-full mb-6 w-fit shadow-lg cursor-pointer"
  >
    <motion.div 
      animate={{ rotate: [0, 15, -15, 0] }} 
      transition={{ repeat: Infinity, duration: 2, repeatDelay: 5 }}
    >
      <DollarSign className="text-white h-4 w-4 md:h-5 md:w-5" />
    </motion.div>
    <p className="text-xs sm:text-sm text-white font-medium">
      <span className="font-bold">30 jours</span> d&apos;essai gratuit pour{' '}
      <span className="font-bold">nouveaux clients</span> !
    </p>
  </motion.div>
);

const FeatureIcon = ({ icon, text, delay }:{
  icon: React.ElementType;
  text: string;
  delay: number;
}) => {
  const Icon = icon;
  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 cursor-pointer"
    >
      <Icon className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
      <span>{text}</span>
    </motion.div>
  );
};

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "agence";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 150);
      
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, fullText]);



  const renderHeroContent = useCallback(() => (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col justify-center items-center text-center xl:px-0 sm:px-16 px-6 relative z-10"
    >
      <PromoBanner />
      
      <motion.h1 
        variants={fadeInUp}
        className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white leading-tight tracking-tight"
      >
        Gérez votre{' '}
        <span className={`relative bg-gradient-to-r from-blue-500 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent px-2 ${isTypingComplete ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-full after:transform after:origin-left after:animate-expand' : ''}`}>
          {typedText}
          {!isTypingComplete && (
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="ml-0.5 inline-block w-0.5 h-8 sm:h-10 md:h-12 lg:h-14 bg-blue-600 dark:bg-blue-400 align-middle"
            />
          )}
        </span>{' '}
        en toute simplicité
      </motion.h1>
      
      <motion.h2 
        variants={fadeInUp}
        className="font-medium text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mt-4 sm:mt-6 max-w-2xl"
      >
        La solution tout-en-un qui simplifie la vie des professionnels
      </motion.h2>
      
      <motion.p 
        variants={fadeInUp}
        className="text-gray-600 dark:text-gray-400 max-w-xl mt-6 text-sm sm:text-base leading-relaxed"
      >
        Optimisez la gestion de votre agence avec notre plateforme intuitive.
        Suivez vos clients, planifiez vos projets, gérez votre comptabilité, et communiquez efficacement.
      </motion.p>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3 justify-center mt-6"
      >
        <FeatureIcon icon={TrendingUp} text="Gain de temps 50%" delay={0.3} />
        <FeatureIcon icon={ShieldCheck} text="Sécurité renforcée" delay={0.5} />
        <FeatureIcon icon={Smartphone} text="Compatible mobile" delay={0.7} />
      </motion.div>
      
      <motion.a 
        href='/auth/signin'
        variants={fadeInUp}
        className="mt-8 sm:mt-10 flex flex-col md:flex-row items-center gap-4 max-md:w-full p-4"
      >
        <GetStarted />
        <div
          className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          se connecter
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.a>
      <GradientBackground />
    </motion.div>
  ), [typedText, isTypingComplete]);

  return (
    <section id="home" className="flex flex-col relative py-16 md:py-24 min-h-screen overflow-hidden">
      {renderHeroContent()}
      
      <motion.div 
        variants={fadeInScale}
        initial="hidden"
        animate="visible"
        className="w-full mt-12 sm:mt-16 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900 z-0 h-16 -top-16"></div>
        <div className="relative w-full max-w-5xl mx-auto perspective-1000">
          <div className="relative group">
            <motion.div 
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-70 transition duration-700"
            />
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
             <YouTubeEmbed videoId='wZVtzOp92lc' />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent z-0"></div>
      
      {/* Floating elements for visual appeal */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-24 right-20 w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 opacity-20 blur-md hidden lg:block"
      />
      
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -8, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute bottom-40 left-20 w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 blur-md hidden lg:block"
      />
      
      <motion.div 
        animate={{ 
          x: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-40 left-40 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-sm hidden lg:block"
      />
    </section>
  );
};

export default Hero;