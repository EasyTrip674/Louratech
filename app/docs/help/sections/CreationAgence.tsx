export default function CreationAgence() {
    return (
        <section id="creation-agence" className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Création de l&apos;agence
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Guide étape par étape pour créer votre agence sur LouraTech.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            3.1 Informations de base
          </h2>
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">
              Pour créer votre agence, cliquez sur <strong>&quot;Créer une agence&quot;</strong> et renseignez les informations suivantes :
            </p>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-3">
                Champs obligatoires (marqués d&apos;un astérisque *)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700 dark:text-red-300">Nom de l&apos;agence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700 dark:text-red-300">Adresse e-mail</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700 dark:text-red-300">Mot de passe</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700 dark:text-red-300">Secteur d&apos;activité</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-700 dark:text-red-300">Pays/Région</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700 dark:text-red-300">Numéro de téléphone</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Informations optionnelles
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Adresse physique</li>
                <li>• Site web</li>
                <li>• Description de l&apos;agence</li>
                <li>• Logo de l&apos;entreprise</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Important :</strong> Il est essentiel de renseigner les vraies informations demandées 
                car elles seront utilisées pour la configuration de votre espace de travail.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
}