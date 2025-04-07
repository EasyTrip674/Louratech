import { stats } from "@/utils/constants";
import styles from "@/utils/style";
import GradientBackground from "./GradientBackground";

const Stats = () => (
  <section className={`${styles.flexCenter} flex-col sm:mb-20 mb-6 text-center relative overflow-hidden`}>
    <div className="max-w-3xl mx-auto mb-6 sm:mb-10">
      <h2 
        className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 bg-clip-text "
      >
        Une solution complète pour votre agence
      </h2>
    </div>

    <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="flex-1 min-w-[250px] flex flex-col items-center p-6 rounded-2xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
        >
          <h4 className="font-bold text-3xl sm:text-4xl md:text-5xl text-brand-600 dark:text-brand-400 mb-2">
            {stat.value}
          </h4>
          <p className="font-medium text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            {stat.title}
          </p>
        </div>
      ))}
    </div>

    <div
      className="max-w-3xl mx-auto mt-12 sm:mt-16 relative"
    >
      <h3 className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">
        Notre vision 2026
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl md:text-2xl font-medium">
        Leader de la digitalisation des agences en Afrique
      </p>
      <GradientBackground />
    </div>
  </section>
);

export default Stats;
