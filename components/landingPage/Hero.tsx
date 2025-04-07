import { useCallback } from 'react';
import Image from 'next/image';
import GetStarted from './GetStarted';
import GradientBackground from './GradientBackground';
import { DollarSign } from 'lucide-react';

const PromoBanner = () => (
  <div className="flex items-center gap-4 py-2 px-4 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-800 dark:to-blue-700 rounded-xl mb-6 w-fit">
   <DollarSign className="text-gray-900 text-white" />
    <p className="text-xs sm:text-sm md:text-base text-white font-medium">
      <span className="font-medium text-white">30 jours</span> d&apos;essai gratuit pour{' '}
      <span className="text-white font-medium">nouveaux clients</span> !
    </p>
  </div>
);

const Hero = () => {
  const renderHeroContent = useCallback(() => (
    <div className="flex-1 flex flex-col justify-center items-center text-center xl:px-0 sm:px-16 px-6 relative">
      <PromoBanner />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
        <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 dark:text-gray-900 dark:text-white leading-tight md:leading-tight">
          Gérez votre 
          <span className="bg-gradient-to-r from-blue-400 to-black dark:from-blue-300 dark:to-gray-100 bg-clip-text text-transparent">
            {" "} agence
          </span> en toute simplicité
        </h1>
      </div>
      <h2 className="font-semibold text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 dark:text-white leading-tight mt-4 sm:mt-6">
        La solution tout-en-un pour professionnels.
      </h2>
      <p className="text-gray-900 dark:text-gray-400 max-w-lg mt-6 sm:mt-8 text-xs sm:text-sm md:text-base leading-relaxed">
        Optimisez la gestion de votre agence avec notre plateforme intuitive.
        Suivi des clients, planning, comptabilité, communication... Tous vos besoins
        professionnels réunis dans une seule application sécurisée et performante.
      </p>
      <div className="mt-8 sm:mt-10">
        <GetStarted />
      </div>
      <GradientBackground />
    </div>
  ), []);

  return (
    <section id="home" className="flex flex-col relative py-12 sm:py-16 md:py-20 lg:py-24 min-h-screen">
      {renderHeroContent()}
      
      <div className="w-full mt-8 sm:mt-12">
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
            <Image 
              src="/hero.png" 
              alt="Dashboard de gestion d'agence" 
              width={1200}
              height={600}
              className="w-full rounded-xl transform transition-all duration-500 hover:translate-y-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;