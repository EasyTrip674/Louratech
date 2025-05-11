"use client"

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Button from "./Button";


interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    toggleFAQ: () => void;
  }

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

export const FAQ: React.FC = () => {
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