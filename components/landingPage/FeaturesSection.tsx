import { FaRocket, FaShieldAlt, FaUsers, FaCogs } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FaRocket className="text-3xl text-brand-600" />, // couleur principale
    title: 'Rapide & Performant',
    description: 'Profitez d’une expérience ultra-rapide grâce à notre infrastructure optimisée.',
    badge: 'Nouveau'
  },
  {
    icon: <FaShieldAlt className="text-3xl text-brand-600" />, // couleur principale
    title: 'Sécurité avancée',
    description: 'Vos données sont protégées par les meilleures technologies de sécurité.'
  },
  {
    icon: <FaUsers className="text-3xl text-brand-600" />, // couleur principale
    title: 'Collaboration simplifiée',
    description: 'Travaillez en équipe facilement, partagez et gérez vos projets en temps réel.'
  },
  {
    icon: <FaCogs className="text-3xl text-brand-600" />, // couleur principale
    title: 'Personnalisable',
    description: 'Adaptez la plateforme à vos besoins grâce à de nombreuses options.'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.15, duration: 0.6, type: 'spring', stiffness: 80 }
  })
};

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">Fonctionnalités clés</h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Découvrez pourquoi notre solution est le choix idéal pour booster votre activité.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl border border-gray-100 relative"
            >
              <div className="mb-4 relative">
                {feature.icon}
                {feature.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
                    className="absolute -top-3 -right-3 bg-brand-500 text-white text-xs px-2 py-1 rounded-full shadow font-semibold animate-pulse"
                  >
                    {feature.badge}
                  </motion.span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 text-center">{feature.title}</h3>
              <p className="text-gray-500 text-center text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 