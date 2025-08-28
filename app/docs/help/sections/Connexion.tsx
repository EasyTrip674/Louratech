import { ExternalLink } from "lucide-react";

export default function Connexion() {
    return (
        <section id="connexion" className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Connexion et authentification
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Apprenez à vous connecter et à gérer votre authentification sur LouraTech.
              </p>
            </div>

            <div id="premiere-connexion" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2.1 Première connexion
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">URL d&apos;accès :</span>
                  <a 
                    href="https://louratech.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
                  >
                    <span>https://louratech.org</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Lors de votre première visite, vous arriverez sur la page d&apos;accueil de LouraTech où vous pourrez :
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>Vous connecter à votre compte existant</li>
                  <li>Créer une nouvelle entreprise</li>
                </ul>
              </div>
            </div>

            <div id="authentification" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2.2 Authentification
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  La page de connexion vous demande :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Adresse email</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      L&apos;email utilisé lors de l&apos;inscription
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Mot de passe</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le mot de passe défini lors de la création du compte
                    </p>
                  </div>
                </div>
                <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-4">
                  <p className="text-sm text-brand-800 dark:text-brand-200">
                    <strong>Important :</strong> Les informations de connexion sont définies lors de la création de votre entreprise.
                  </p>
                </div>
              </div>
            </div>

            <div id="mot-de-passe-oublie" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2.3 Mot de passe oublié
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  En cas d&apos;oubli de mot de passe :
                </p>
                <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                  <li>Cliquez sur <strong>&quot;Mot de passe oublié&quot;</strong> sur la page de connexion</li>
                  <li>Saisissez votre adresse email</li>
                  <li>Suivez les instructions reçues par email pour réinitialiser votre mot de passe</li>
                </ol>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Alternative :</strong> Contactez le service clientèle pour une assistance personnalisée.
                  </p>
                </div>
              </div>
            </div>
          </section>
    )
}