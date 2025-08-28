export default function GestionServices() {
    return (
        <section id="gestion-services" className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Gestion des services
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Les services constituent les activités qu&apos;exerce votre entreprise selon son domaine d&apos;activité.
          </p>
        </div>

        <div id="creation-service" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            5.1 Création d&apos;un service
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Pour ajouter un nouveau service à votre entreprise :
            </p>
            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 ml-4">
              <li>Accédez à la section Gestion &gt; Services</li>
              <li>Cliquez sur Ajouter un service</li>
              <li>Renseignez le nom du service (champ obligatoire)</li>
              <li>Cliquez sur Enregistrer</li>
            </ol>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Automatisation :</strong> Une fois le service créé, une palette se crée automatiquement 
                avec un tableau de bord intégré, quel que soit le type de service.
              </p>
            </div>
          </div>
        </div>

        <div id="modification-service" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            5.2 Modification d&apos;un service
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Pour modifier un service existant :
            </p>
            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 ml-4">
              <li>Accédez à la liste des services</li>
              <li>Cliquez sur l&apos;icône Modifier du service concerné</li>
              <li>Modifiez le nom du service</li>
              <li>Sauvegardez les modifications</li>
            </ol>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note :</strong> Seul le nom du service peut être modifié car c&apos;est la seule information 
                demandée lors de la création.
              </p>
            </div>
          </div>
        </div>

        <div id="gestion-modules" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            5.3 Gestion des modules
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Créer un module</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Un module constitue une étape d&apos;un service. Pour créer un module :
              </p>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                    <li>Accédez aux détails d&apos;un service</li>
                <li>Cliquez sur Créer un module</li>
                <li>Renseignez les informations requises :</li>
              </ol>
              <div className="ml-8 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Obligatoires</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Nom du module</li>
                    <li>• Prix standard</li>
                  </ul>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Optionnel</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Description du module</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-3">
                ⚠️ Suppression d&apos;un module
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                Pour supprimer un module, vous devez confirmer le nom du module en respectant exactement le format d&apos;écriture.
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Attention :</strong> Avant la suppression, vous devrez gérer les transactions associées au module. 
                Vous pourrez choisir de supprimer les transactions en même temps ou seulement le module.
              </p>
            </div>
          </div>
        </div>

        <div id="inscription-clients" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            5.4 Inscription des clients
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Pour inscrire un client dans un module ou service :
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Prérequis :</strong> Le client doit être créé préalablement dans la rubrique Clients.
              </p>
            </div>
            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                <li>Sélectionnez l&apos;étape ou le module souhaité</li>
              <li>Choisissez le nom du client</li>
              <li>Définissez le prix que le client devra payer pour cette étape</li>
              <li>Confirmez l&apos;inscription</li>
            </ol>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                Suivi automatique
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Une fois le client inscrit, une palette de suivi de son étape et du paiement est créée automatiquement. 
                    Vous pourrez valider son étape et son paiement via le bouton Détails sur le client inscrit.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
}