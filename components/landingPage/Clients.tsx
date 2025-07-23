"use client";
import { motion } from "framer-motion";
import { Briefcase, Globe, Users, Shield, PieChart, Calendar, BadgeDollarSign, Layers } from "lucide-react";

const targetClients = [
  {
    id: "client-1",
    icon: <Globe size={40} className="text-brand-500" />,
    title: "entreprises de Voyage",
    description: "Optimisez la gestion de vos réservations, clients et planning avec une solution tout-en-un adaptée à vos besoins spécifiques.",
    features: ["Réservations centralisées", "Gestion des clients", "Planification simplifiée"]
  },
  {
    id: "client-2",
    icon: <Briefcase size={40} className="text-brand-500" />,
    title: "entreprises de Tourisme",
    description: "Gérez efficacement vos circuits, guides et activités touristiques en un seul endroit pour une meilleure productivité.",
    features: ["Organisation des circuits", "Coordination des guides", "Suivi des activités"]
  },
  {
    id: "client-3",
    icon: <Users size={40} className="text-green-500" />,
    title: "entreprises Événementielles",
    description: "Organisez vos événements, gérez vos clients et suivez vos budgets en temps réel avec nos outils performants.",
    features: ["Planification d'événements", "Gestion des prestataires", "Suivi budgétaire"]
  },
  {
    id: "client-4",
    icon: <Shield size={40} className="text-red-500" />,
    title: "Sécurité et Assistance",
    description: "Offrez des services de sécurité et d'assistance premium pour voyageurs avec notre plateforme sécurisée.",
    features: ["Assistance 24/7", "Intervention rapide", "Rapports détaillés"]
  },
];

const services = [
  {
    id: "service-1",
    icon: <PieChart size={32} className="text-indigo-500" />,
    title: "Gestion Financière",
  },
  {
    id: "service-2",
    icon: <Users size={32} className="text-emerald-500" />,
    title: "Gestion des Clients",
  },
  {
    id: "service-3",
    icon: <Calendar size={32} className="text-amber-500" />,
    title: "Planification Avancée",
  },
  {
    id: "service-4",
    icon: <BadgeDollarSign size={32} className="text-rose-500" />,
    title: "Facturation Simplifiée",
  },
  {
    id: "service-5",
    icon: <Layers size={32} className="text-cyan-500" />,
    title: "Solution Intégrée",
  },
];

const TargetClients = () => {
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 10 
      }
    }
  };

  const serviceVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section className="py-20 from-gray-50 to-white  dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-600 dark:from-brand-400 dark:to-brand-400">
            Solutions Adaptées à Votre entreprise
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Notre plateforme tout-en-un révolutionne la gestion de votre entreprise en centralisant clients, finances et opérations.
          </p>
          
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={serviceVariants}
                whileHover="hover"
                className="flex items-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-md"
              >
                <div className="mr-2">{service.icon}</div>
                <span className="font-medium dark:text-white">{service.title}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {targetClients.map((client) => (
            <motion.div
              key={client.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all"
            >
              <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-600"></div>
              <div className="p-8">
                <motion.div 
                  variants={iconVariants}  
                  className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6 mx-auto"
                >
                  {client.icon}
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3 text-center dark:text-white">{client.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  {client.description}
                </p>
                
                <div className="space-y-2">
                  {client.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700 text-white font-medium py-3 px-8 rounded-full shadow-lg"
          >
            Découvrir Nos Solutions
          </motion.button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default TargetClients;