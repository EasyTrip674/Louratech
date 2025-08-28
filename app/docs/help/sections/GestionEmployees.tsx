import Image from "next/image";

export default function GestionEmployees() {
    return (
        <section id="gestion-utilisateurs" className="space-y-8">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gestion des Employés</h3>

                    <p className="text-gray-600 dark:text-gray-400">
                        La section &quot;Gestion des Employés&quot; vous permet d&apos;administrer tous les utilisateurs de votre entreprise, 
                              y compris les administrateurs et les employés. Vous pouvez créer, modifier, supprimer des comptes 
                              et gérer leurs permissions d&apos;accès.
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Aperçu de la page Employés</h4>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 hidden">[Image de la page Gestion des Employés]</span>
                            <Image
                                src={`/assets/docs/admins/home.png`}
                                width={1000}
                                height={1000}
                                alt="image for docs of dashboard stats_rapides"
                                className="w-full"
                                    />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                            Interface complète de gestion des employés avec tableau et barre d&apos;actions
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Éléments principaux de la page :</h5>
                        <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1 ml-4 text-sm">
                            <li>
                                <strong>Barre d&apos;actions supérieure :</strong>
                                Bouton &quot;Ajouter un employé&quot; et filtres de recherche</li>
                            <li>
                                <strong>Tableau des employés :</strong>
                                Liste complète avec toutes les informations clés</li>
                            <li>
                                <strong>Pagination :</strong>
                                Navigation entre les pages d&apos;employés</li>
                            <li>
                                <strong>Actions par employé :</strong>
                                Boutons Modifier, Supprimer et Détails</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Barre d&apos;actions supérieure</h4>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 hidden">[Image de la barre d&apos;actions]</span>
                            <Image
                                src={`/assets/docs/admins/action_bar.png`}
                                width={500}
                                height={500}
                                alt="image for docs of dashboard stats_rapides"
                                className="w-full"
                                    />

                                <Image
                                src={`/assets/docs/admins/actions.png`}
                                width={500}
                                height={500}
                                alt="image for docs of dashboard stats_rapides"
                                className="w-full"
                                    />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                            Barre d&apos;actions avec bouton d&apos;ajout et filtres de recherche
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Bouton &quot;Ajouter un employé&quot;</h5>
                            <ul className="list-disc list-inside text-green-700 dark:text-green-300 space-y-1 ml-4 text-sm">
                                <li>Bouton vert avec icône &quot;+&quot; pour une identification rapide</li>
                                <li>Ouvre un formulaire modal pour créer un nouveau profil</li>
                                <li>Champs requis : Nom, Prénom, Email, Mot de passe, Rôle</li>
                                <li>Validation automatique des données saisies</li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Filtres de recherche</h5>
                            <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 space-y-1 ml-4 text-sm">
                                <li>Barre de recherche par nom, prénom ou email</li>
                                <li>Filtre par rôle (Admin, Employé, etc.)</li>
                                <li>Filtre par statut (Actif, Inactif)</li>
                                <li>Réinitialisation des filtres avec bouton &quot;Tout&quot;</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Tableau des employés</h4>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 hidden">[Image du tableau des employés]</span>
                            <Image
                                src={`/assets/docs/admins/tabs.png`}
                                width={500}
                                height={500}
                                alt="image for docs of dashboard stats_rapides"
                                className="w-full"
                                    />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                            Tableau détaillé des employés avec toutes les colonnes d&apos;information
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">Colonnes du tableau</h5>
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block w-3 h-3 bg-blue-500 rounded"></span>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                            <strong>Nom & Prénom :</strong>
                                            Identité complète de l&apos;employé</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block w-3 h-3 bg-green-500 rounded"></span>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                            <strong>Email :</strong>
                                            Adresse de contact professionnelle</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block w-3 h-3 bg-amber-500 rounded"></span>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                            <strong>Rôle :</strong>
                                            Type d&apos;utilisateur (Admin/Employé)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block w-3 h-3 bg-red-500 rounded"></span>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                            <strong>Statut :</strong>
                                            Actif/Inactif avec indicateur visuel</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block w-3 h-3 bg-purple-500 rounded"></span>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                            <strong>Actions :</strong>
                                            Boutons Modifier, Supprimer, Détails</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Actions par employé</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Modifier</h5>
                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                                Bouton bleu avec icône de crayon. Permet de modifier les informations de l&apos;employé : 
                                          coordonnées, rôle, permissions. Ouvre un formulaire pré-rempli.
                            </p>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Supprimer</h5>
                            <p className="text-red-700 dark:text-red-300 text-sm">
                                Bouton rouge avec icône de corbeille. Permet de supprimer définitivement un employé. 
                                          Confirmation requise avant suppression pour éviter les erreurs.
                            </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Détails</h5>
                            <p className="text-purple-700 dark:text-purple-300 text-sm">
                                Bouton violet avec icône d&apos;œil. Affiche toutes les informations détaillées de l&apos;employé 
                                          dans une fenêtre modale sans possibilité de modification.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            <span className="font-medium">Astuce :</span>
                            Utilisez les filtres de recherche pour trouver 
                                    rapidement un employé spécifique, surtout dans les grandes entreprises. Le tableau est mis à jour 
                                    en temps réel lors de la saisie dans la barre de recherche.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Gestion des rôles et permissions</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                            <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">Types de rôles</h5>
                            <ul className="list-disc list-inside text-indigo-700 dark:text-indigo-300 space-y-1 ml-4 text-sm">
                                <li>
                                    <strong>Administrateur :</strong>
                                    Accès complet à toutes les fonctionnalités</li>
                                <li>
                                    <strong>Employé :</strong>
                                    Accès limité selon les permissions attribuées</li>
                                <li>
                                    <strong>Consultant :</strong>
                                    Accès en lecture seule (si configuré)</li>
                            </ul>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                            <h5 className="font-medium text-teal-800 dark:text-teal-200 mb-2">Permissions par défaut</h5>
                            <ul className="list-disc list-inside text-teal-700 dark:text-teal-300 space-y-1 ml-4 text-sm">
                                <li>Admin : Toutes les sections accessibles</li>
                                <li>Employé : Accès aux sections assignées uniquement</li>
                                <li>Gestion des permissions personnalisée possible</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
