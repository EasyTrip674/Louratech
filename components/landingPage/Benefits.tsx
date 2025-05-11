import { layout } from "@/utils/style";
import { Globe, Medal, MessageSquare, Shield, Users, Zap } from "lucide-react";


export const Benefits: React.FC = () => (
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