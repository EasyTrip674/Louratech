import { useCallback } from 'react';
import Image from 'next/image';
import GetStarted from './GetStarted';
import GradientBackground from './GradientBackground';
import { DollarSign, ArrowRight, CheckCircle } from 'lucide-react';

const PromoBanner = () => (
  <div className="flex items-center gap-3 py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-full mb-6 w-fit animate-pulse hover:animate-none transition-all duration-300 shadow-lg">
    <DollarSign className="text-white h-4 w-4 md:h-5 md:w-5" />
    <p className="text-xs sm:text-sm text-white font-medium">
      <span className="font-bold">30 jours</span> d&apos;essai gratuit pour{' '}
      <span className="font-bold">nouveaux clients</span> !
    </p>
  </div>
);

const FeatureBadge = ({ text }:{
  text:string
}) => (
  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
    <span>{text}</span>
  </div>
);

const Hero = () => {
  const renderHeroContent = useCallback(() => (
    <div className="flex-1 flex flex-col justify-center items-center text-center xl:px-0 sm:px-16 px-6 relative z-10">
      <PromoBanner />
      
      <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white leading-tight tracking-tight">
        Gérez votre
        <span className="bg-gradient-to-r from-blue-500 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent px-2">
          agence
        </span>
        en toute simplicité
      </h1>
      
      <h2 className="font-medium text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mt-4 sm:mt-6 max-w-2xl">
        La solution tout-en-un qui simplifie la vie des professionnels
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-xl mt-6 text-sm sm:text-base leading-relaxed">
        Optimisez la gestion de votre agence avec notre plateforme intuitive.
        Suivez vos clients, planifiez vos projets, gérez votre comptabilité, et communiquez efficacement.
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <FeatureBadge text="Gain de temps 50%" />
        <FeatureBadge text="Sécurité renforcée" />
        <FeatureBadge text="Compatible mobile" />
      </div>
      
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4">
        <GetStarted />
        <button className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          Voir la démo
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <GradientBackground />
    </div>
  ), []);

  return (
    <section id="home" className="flex flex-col relative py-16 md:py-24 min-h-screen overflow-hidden">
      {renderHeroContent()}
      
      <div className="w-full mt-12 sm:mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900 z-0 h-16 -top-16"></div>
        
        <div className="relative w-full max-w-5xl mx-auto transform perspective-1000">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-70 transition duration-700"></div>
            
            <div className="relative">
              <Image
                src="/hero.png"
                alt="Dashboard de gestion d'agence"
                width={1200}
                height={600}
                className="w-full rounded-xl shadow-2xl transform transition-all duration-500 group-hover:translate-y-1 group-hover:shadow-blue-500/20"
                priority
              />
              
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Interface intuitive et moderne
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent z-0"></div>
    </section>
  );
};

export default Hero;