import { Check } from "lucide-react";
import Button from "./Button";


interface PricingCardProps {
    title: string;
    price: string;
    period: string;
    features: string[];
    cta: string;
    popular?: boolean;
  }
  

const pricingPlans = [
    {
      id: "starter",
      title: "Starter",
      price: "50k fng",
      period: "par mois",
      features: [
        "Jusqu'à 50 clients",
        "Gestion de planning basique",
        "Fiches clients illimitées",
        "Support par email"
      ],
      cta: "Commencer",
      popular: false
    },
    {
      id: "premium",
      title: "Premium",
      price: "100 fng",
      period: "par mois",
      features: [
        "Jusqu'à 120 utilisateurs",
        "Gestion de planning avancée",
        "Suivi client personnalisable",
        "Analytics complets",
        "Support prioritaire",
      ],
      cta: "Essai gratuit de 14 jours",
      popular: true
    },
    {
      id: "enterprise",
      title: "Enterprise",
      price: "500k fng",
      period: "par mois",
      features: [
        "Utilisateurs illimités",
        "Toutes les fonctionnalités Premium",
        "Personnalisation complète",
        "Gestionnaire de compte dédié",
        "SLA garantie 99,9%",
        "Formation sur mesure"
      ],
      cta: "Contacter un commercial",
      popular: false
    }
  ];


export const Pricing: React.FC = () => (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tarifs transparents et flexibles
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Choisissez le forfait qui correspond le mieux aux besoins de votre agence
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
        
        <div className="mt-16 bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Vous avez des besoins spécifiques ?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Contactez notre équipe pour une solution sur mesure adaptée à votre agence
          </p>
          <Button 
            styles="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300"
            text="Demander un devis personnalisé"
          />
        </div>
      </div>
    </section>
  );


const PricingCard: React.FC<PricingCardProps> = ({ title, price, period, features, cta, popular }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border ${popular ? 'border-brand-500 dark:border-brand-400 ring-4 ring-brand-500/20' : 'border-gray-100 dark:border-gray-700'} flex flex-col h-full transform transition-all duration-300 hover:scale-105 mx-2 mb-6 sm:mb-0 relative`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Le plus populaire
        </div>
      )}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
        <span className="text-gray-500 dark:text-gray-400 ml-1">{period}</span>
      </div>
      <ul className="mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center mb-3">
            <Check className="h-5 w-5 text-brand-500 dark:text-brand-400 mr-2 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        styles={`w-full ${popular ? 'bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'} font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300`}
        text={cta}
      />
    </div>
  );