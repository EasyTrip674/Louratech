import Button from "./Button";
import styles, { layout } from '@/utils/style';
import { Calendar, Users, BarChart3 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  index: number;
}

const features = [
  {
    id: "feature-1",
    icon: <Calendar className="w-8 h-8 text-white" />,
    title: "Gestion de Planning",
    content:
      "Planifiez et gérez vos rendez-vous, activités et disponibilités en toute simplicité.",
  },
  {
    id: "feature-2",
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Suivi Client",
    content:
      "Centralisez les informations clients, historiques et préférences pour un service personnalisé.",
  },
  {
    id: "feature-3",
    icon: <BarChart3 className="w-8 h-8 text-white" />,
    title: "Analytics & Reporting",
    content:
      "Analysez vos performances et prenez des décisions éclairées avec des rapports détaillés.",
  },
];

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, content, index }) => (
  <div 
    className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"} bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105`}
  >
    <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600`}>
      {icon}
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl leading-[1.3] mb-2">
        {title}
      </h4>
      <p className="font-poppins font-normal text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
        {content}
      </p>
    </div>
  </div>
);

const Business: React.FC = () => (
  <section id="features" className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 
      
        className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 bg-clip-text"
      >
        Gérez votre agence <br className="sm:block hidden" /> en toute simplicité.
      </h2>
      <p 
        className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-[470px] mt-5 leading-relaxed"
      >
        Notre solution tout-en-un vous permet de centraliser la gestion de votre agence,
        du suivi des clients à la comptabilité, en passant par la planification des activités.
        Optimisez votre temps et augmentez votre productivité.
      </p>

      <div
      >
        <Button 
          styles="mt-10 bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" 
          text="Démarrer l'essai gratuit" 
        />
      </div>
    </div>

    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
);

export default Business;
