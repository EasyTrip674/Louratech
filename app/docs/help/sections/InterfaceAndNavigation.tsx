import Image from "next/image";

export default function InterfaceAndNavigation() {
  return (
    <section id="interface" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Interface et Navigation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Apprenez à vous connecter et à gérer votre authentification sur
          LouraTech.
        </p>
      </div>

      <div
        id="tableau-bord"
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Accès à la dashboard
            </h3>

            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                URL d&apos;accès :
              </span>
              <a
                href="https://louratech.org/services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
              >
                <span>Dashboard</span>
                {/* <ExternalLink className="w-3 h-3" /> */}
              </a>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Après vous être connecté avec succès, vous serez redirigé vers la
              dashboard principale de votre agence. Cette interface centralisée
              vous donne un aperçu complet de l&apos;activité de votre agence en un
              seul coup d&apos;œil.
            </p>
          </div>

          <div className="space-y-4">
            
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Aperçu de la dashboard
            </h4>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <Image
                    src={`/assets/docs/dashboard.png`}
                    width={1000}
                    height={1000}
                    alt="image for docs of dashboard"
                    className="w-full"
                    />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Interface principale de la dashboard avec tous les éléments clés
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Éléments clés de la dashboard :
              </h5>
              <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1 ml-4 text-sm">
                <li>
                  <strong>En-tête :</strong> Contient le logo, le nom de
                  l&apos;agence et le menu utilisateur
                </li>
                <li>
                  <strong>Sidebar :</strong> Navigation rapide vers toutes les
                  sections de l&apos;application
                </li>
                <li>
                  <strong>Cartes statistiques :</strong> Vue d&apos;ensemble des
                  clients et services
                </li>
                <li>
                  <strong>Graphiques :</strong> Visualisation des performances
                  financières
                </li>
                <li>
                  <li>
                    <strong>Liste clients :</strong> Dernières inscriptions avec
                    statuts
                  </li>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Statistiques rapides
            </h4>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <Image
              src={`/assets/docs/stats_rapides.png`}
              width={1000}
              height={1000}
              alt="image for docs of dashboard stats_rapides"
              className="w-full"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Cartes d&apos;aperçu rapide des indicateurs clés
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  Carte Clients
                </h5>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Affiche le nombre total de clients dans votre agence. Le
                  bouton &quot;Voir&quot; vous permet d&apos;accéder à la gestion complète des
                  clients.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                  Carte Services
                </h5>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  Montre le nombre total de services proposés par votre agence.
                  Cliquez sur &quot;Voir&quot; pour gérer vos différents types de
                  services.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              Performances financières
            </h4>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
             
              <Image
              src={`/assets/docs/finances_dashboard.png`}
              width={1000}
              height={1000}
              alt="image for docs of dashboard stats_rapides"
              className="w-full"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Graphique des revenus et dépenses mensuels avec suivi des
                objectifs
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200">
                    Revenus mensuels
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Barres vertes représentant les revenus générés chaque mois.
                    Permet d&apos;identifier les périodes de forte activité.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200">
                    Dépenses mensuelles
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Barres rouges montrant les dépenses mensuelles. Aide à
                    surveiller les coûts et optimiser la rentabilité.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200">
                    Suivi des objectifs
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Indicateur circulaire montrant la progression vers votre
                    objectif mensuel. Objectif actuel : 2851 FNG.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
             Derniers clients
            </h4>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <Image
              src={`/assets/docs/derniers_clients.png`}
              width={1000}
              height={1000}
              alt="image for docs of dashboard stats_rapides"
              className="w-full"
                />
                
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Liste des derniers clients inscrits avec leurs informations
                principales
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Informations disponibles :
              </h5>
              <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 space-y-1 ml-4 text-sm">
                <li>
                  <strong>Nom complet :</strong> Prénom et nom du client
                </li>
                <li>
                  <strong>Email :</strong> Adresse e-mail de contact
                </li>
                <li>
                  <strong>Date d&apos;inscription :</strong> Quand le client a été
                  ajouté
                </li>
                <li>
                  <strong>Statut :</strong> Actif ou Inactif (indique si le
                  client est en cours de traitement)
                </li>
                <li>
                  <strong>Action rapide :</strong> Bouton &quot;Voir plus&quot; pour
                  accéder aux détails complets
                </li>
              </ul>
            </div>
          </div>

         
        </div>
      </div>

      <div
        id="menu-principal"
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          4.2 Menu Principale
        </h2>
            <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Menu latéral de navigation</h3>
                
                <p className="text-gray-600 dark:text-gray-400">
                Le menu latéral est l&apos;élément central de navigation dans l&apos;application, permettant un accès rapide 
                et intuitif à toutes les fonctionnalités principales de votre agence.
                </p>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Aperçu du menu latéral</h4>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <Image
                        src={`/assets/docs/nav_dash.png`}
                        width={1000}
                        height={1000}
                        alt="image for docs of dashboard stats_rapides"
                        className="w-full"
                />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Menu latéral avec toutes les sections et sous-menus déployés
                </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Structure du menu :</h5>
                <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1 ml-4 text-sm">
                    <li><strong>Section principale &quot;Dashboard&quot;</strong> - Accès direct à la vue d&apos;ensemble</li>
                    <li><strong>Section &quot;Gestion&quot;</strong> - Contient 4 sous-menus organisés par fonctionnalité</li>
                    <li><strong>Indicateurs visuels</strong> - Icônes et couleurs pour une navigation intuitive</li>
                    <li><strong>État actif</strong> - Mise en évidence jaune pour la section sélectionnée</li>
                </ul>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Section Dashboard</h4>
                
                {/* <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">[Image du bouton Dashboard actif]</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                        Bouton Dashboard avec mise en évidence jaune (section active)
                    </p>
                </div> */}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">État actif</h5>
                    <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1 ml-4 text-sm">
                    <li>Fond jaune clair indiquant la section sélectionnée</li>
                    <li>Icône de grille représentant la vue d&apos;ensemble</li>
                    <li>Texte en gras pour meilleure visibilité</li>
                    </ul>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Fonctionnalités</h5>
                    <ul className="list-disc list-inside text-green-700 dark:text-green-300 space-y-1 ml-4 text-sm">
                    <li>Statistiques rapides (clients, services)</li>
                    <li>Graphiques financiers en temps réel</li>
                    <li>Liste des derniers clients inscrits</li>
                    <li>Suivi des objectifs mensuels</li>
                    </ul>
                </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Section Gestion (avec sous-menus)</h4>
                
                {/* <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">[Image de la section Gestion déployée]</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Section Gestion avec tous les sous-menus visibles et indicateur de déploiement
                </p>
                </div>
                 */}
                <div className="space-y-3">
                <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">En-tête Gestion</h5>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Bouton principal avec icône d&apos;interface utilisateur et indicateur de déploiement (flèche vers le haut). 
                        Cliquer dessus permet de réduire/développer les sous-menus.
                    </p>
                    </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-3">Sous-menus détaillés :</h5>
                    
                    <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h6 className="font-medium text-blue-700 dark:text-blue-300">Services</h6>
                        <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                        Gestion complète des services de l&apos;agence : création, modification, suivi de performance, 
                        et statistiques par type de service.
                        </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                        <h6 className="font-medium text-green-700 dark:text-green-300">Admin/Employés</h6>
                        <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                        Administration des utilisateurs : ajout/suppression d&apos;employés, attribution de rôles et permissions, 
                        suivi de l&apos;activité et des performances.
                        </p>
                    </div>
                    
                    <div className="border-l-4 border-amber-500 pl-4">
                        <h6 className="font-medium text-amber-700 dark:text-amber-300">Clients</h6>
                        <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
                        Gestion de la base clients : enregistrement des informations, suivi des demandes, 
                        historique des transactions, et export des données.
                        </p>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4">
                        <h6 className="font-medium text-red-700 dark:text-red-300">Finances</h6>
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        Suivi financier complet : enregistrement des revenus/dépenses, génération de rapports, 
                        prévisions budgétaires, et analyse de rentabilité.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Navigation et interaction</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                    <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">Navigation intuitive</h5>
                    <ul className="list-disc list-inside text-indigo-700 dark:text-indigo-300 space-y-1 ml-4 text-sm">
                    <li>Clic simple sur chaque bouton pour accéder à la section</li>
                    <li>Déploiement/repli automatique des sous-menus</li>
                    <li>Mise en évidence visuelle de la section active</li>
                    <li>Icônes représentatives pour chaque fonctionnalité</li>
                    </ul>
                </div>
                
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                    <h5 className="font-medium text-teal-800 dark:text-teal-200 mb-2">Expérience utilisateur</h5>
                    <ul className="list-disc list-inside text-teal-700 dark:text-teal-300 space-y-1 ml-4 text-sm">
                    <li>Transitions fluides entre les sections</li>
                    <li>Accessibilité sur tous les appareils</li>
                    <li>Boutons de taille adaptée pour éviter les erreurs de clic</li>
                    <li>Structure hiérarchique claire et logique</li>
                    </ul>
                </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <span className="font-medium">Conseil d&apos;utilisation :</span> Utilisez le menu latéral comme point 
                    de référence principal pour toutes vos tâches de gestion. La structure hiérarchique vous permet 
                    de trouver rapidement la fonctionnalité dont vous avez besoin, que ce soit pour consulter les 
                    statistiques, gérer les clients, ou superviser les aspects financiers de votre agence.
                </p>
                </div>
            </div>
            </div>
      </div>
    </section>
  );
}
