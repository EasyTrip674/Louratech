import Button from "./Button";
import styles, { layout } from '@/utils/style';
import { Calendar, Users, BarChart3, Check, Medal, Star, MessageSquare, Globe, Shield, Zap, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// Types
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  index: number;
}

interface TestimonialProps {
  content: string;
  name: string;
  position: string;
  company: string;
  image: string;
}

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleFAQ: () => void;
}

// Data
const features = [
  {
    id: "feature-1",
    icon: <Calendar className="w-8 h-8 text-white" />,
    title: "Gestion de Services",
    content: "Planifiez et gérez vos services facilement avec des outils avancés",
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

const testimonials = [
  {
    id: "testimonial-1",
    content: "Ce SaaS a révolutionné la gestion de notre agence marketing. En quelques mois, notre productivité a augmenté de 35% et nos clients sont plus satisfaits que jamais.",
    name: "Mamadou Bah",
    position: "Directrice",
    company: "AgenceWeb Plus",
    image: "/api/placeholder/100/100"
  },
  {
    id: "testimonial-2",
    content: "L'interface intuitive et les fonctionnalités complètes nous ont permis de centraliser toutes nos opérations. Un gain de temps considérable !",
    name: "Fanta Conte",
    position: "CEO",
    company: "DigitalCreative",
    image: "/api/placeholder/100/100"
  },
  {
    id: "testimonial-3",
    content: "Le support client est exceptionnel et les mises à jour régulières apportent constamment de nouvelles fonctionnalités qui répondent parfaitement à nos besoins.",
    name: "Moussa Diallo",
    position: "Responsable projet",
    company: "InnovAgency",
    image: "/api/placeholder/100/100"
  }
];

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

const faqItems = [
  {
    id: "faq-1",
    question: "Combien de temps dure la période d'essai ?",
    answer: "Notre période d'essai gratuite dure 14 jours pour tous nos forfaits, sans engagement et sans carte bancaire requise."
  },
  {
    id: "faq-2",
    question: "Est-il possible de changer de forfait à tout moment ?",
    answer: "Oui, vous pouvez passer à un forfait supérieur à tout moment. La mise à niveau est immédiate et vous ne payez que la différence proratisée."
  },
  {
    id: "faq-3",
    question: "Pouvez-vous m'aider à migrer mes données existantes ?",
    answer: "Absolument ! Notre équipe d'onboarding vous accompagne dans la migration de vos données depuis vos outils actuels, quelle que soit leur format."
  },
  {
    id: "faq-4",
    question: "Proposez-vous des formations pour mon équipe ?",
    answer: "Nous offrons des sessions de formation personnalisées pour votre équipe, ainsi qu'une bibliothèque complète de tutoriels vidéo et documentation."
  },
  {
    id: "faq-5",
    question: "Quelles sont les options d'intégration disponibles ?",
    answer: "Notre solution s'intègre avec plus de 50 outils populaires comme Google Calendar, Slack, Trello, et bien d'autres. Nous disposons également d'une API REST complète."
  }
];

// Components
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, content, index }) => (
  <div
    className={`flex flex-row p-6 rounded-2xl ${index !== features.length - 1 ? "mb-6" : "mb-0"} bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105`}
  >
    <div className={`w-16 h-16 rounded-full ${styles.flexCenter} bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600`}>
      {icon}
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl leading-snug mb-2">
        {title}
      </h4>
      <p className="font-poppins font-normal text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
        {content}
      </p>
    </div>
  </div>
);

const TestimonialCard: React.FC<TestimonialProps> = ({ content, name, position, company }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mx-2 mb-4 flex flex-col h-full">
    <div className="mb-4">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-base italic mb-6 flex-grow">{content}</p>
    <div className="flex items-center mt-4">
      <div className="ml-3">
        <h4 className="text-gray-900 dark:text-white font-semibold">{name}</h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{position}, {company}</p>
      </div>
    </div>
  </div>
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

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleFAQ }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 py-4">
    <button
      className="flex justify-between items-center w-full text-left"
      onClick={toggleFAQ}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{question}</h3>
      <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
        <ArrowRight className="h-5 w-5 transform rotate-90" />
      </span>
    </button>
    <div
      className={`mt-2 text-gray-600 dark:text-gray-300 overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <p className="pb-2">{answer}</p>
    </div>
  </div>
);


const Benefits: React.FC = () => (
  <section className={`${layout.section} py-20 sm:py-32 `}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Pourquoi choisir notre solution ?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Conçue spécifiquement pour les besoins des agences modernes, notre plateforme offre des avantages uniques
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Gain de productivité</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Automatisez les tâches répétitives et gagnez jusqu&apos;à 15 heures par semaine pour vous concentrer sur l&apos;essentiel.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Accessibilité totale</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Accédez à vos données depuis n&apos;importe où, sur tous vos appareils, pour une flexibilité maximale.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Sécurité renforcée</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Protection des données de niveau bancaire avec chiffrement de bout en bout et authentification 2FA.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Collaboration simplifiée</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Travaillez efficacement en équipe avec des outils collaboratifs en temps réel et un système de permissions avancé.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Support réactif</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Une équipe dédiée disponible 7j/7 pour vous accompagner et répondre à toutes vos questions.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Medal className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Qualité premium</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Développée avec les technologies les plus modernes pour une expérience utilisateur exceptionnelle.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Business: React.FC = () => (
  <section id="features" className={`${layout.section} py-20 sm:py-32`}>
    <div className={layout.sectionInfo}>
      <h2
        className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent"
      >
        Gérez votre agence <br className="sm:block hidden" /> en toute simplicité.
      </h2>
      <p
        className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-xl mt-5 leading-relaxed"
      >
        Notre solution tout-en-un vous permet de centraliser la gestion de votre agence,
        du suivi des clients à la comptabilité, en passant par la planification des activités.
        Optimisez votre temps et augmentez votre productivité.
      </p>
      <div>
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

const Testimonials: React.FC = () => (
  <section className="py-20 sm:py-32 " id="clients">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ce que disent nos clients
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Des centaines d&apos;agences font confiance à notre solution pour optimiser leur gestion quotidienne
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <Button 
          styles="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          text="Voir plus de témoignages"
        />
      </div>
    </div>
  </section>
);

const Pricing: React.FC = () => (
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

const FAQ: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<string | null>("faq-1");
  
  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };
  
  return (
    <section id="faq" className="py-20 sm:py-32 ">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Questions fréquentes
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Tout ce que vous devez savoir pour démarrer
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {faqItems.map((item) => (
            <FAQItem 
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openFAQ === item.id}
              toggleFAQ={() => toggleFAQ(item.id)}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Vous avez d&apos;autres questions ?
          </p>
          <Button 
            styles="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300"
            text="Contacter notre support"
          />
        </div>
      </div>
    </section>
  );
};

const CTA: React.FC = () => (
  <section className="py-20 sm:py-32">
    <div className="container mx-auto px-4">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 rounded-2xl p-8 sm:p-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Prêt à transformer la gestion de votre agence ?
        </h2>
        <p className="text-white/90 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Rejoignez plus de 2000 agences qui ont déjà optimisé leur productivité et boosté leur croissance avec notre solution
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            styles="bg-white text-brand-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            text="Démarrer l'essai gratuit"
          />
          <Button
            styles="bg-transparent text-white border-2 border-white font-semibold py-4 px-8 rounded-lg hover:bg-white/10 transition-all duration-300 text-lg"
            text="Voir une démo"
          />
        </div>
      </div>
    </div>
  </section>
);

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'inscription à la newsletter
    alert(`Merci de vous être inscrit avec ${email}!`);
    setEmail("");
  };
  
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Inscrivez-vous à notre newsletter
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Recevez les dernières nouvelles, mises à jour et offres spéciales directement dans votre boîte de réception
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="w-full sm:w-auto h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:border-brand-500 focus:ring focus:ring-brand-500/10"
            required
          />
          <Button
            styles="bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            text="S'inscrire"
          />
        </form>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
          Nous respectons votre vie privée. Vous pouvez vous désinscrire à tout moment.
        </p>
      </div>
    </section>
  );
}

const BusinessPage: React.FC = () => (
  <div className="">
    <Benefits />
    <Business />
    <Testimonials />
    <Pricing />
    <FAQ />
    <CTA />
    <Newsletter />
  </div>
);
export default BusinessPage;