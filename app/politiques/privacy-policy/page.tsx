import React from 'react';
import { ChevronRight, Shield, Eye, Lock, Users, Globe, FileText, AlertCircle } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = "15 janvier 2025";

  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "collecte-donnees", title: "Collecte des données" },
    { id: "utilisation-donnees", title: "Utilisation des données" },
    { id: "partage-donnees", title: "Partage des données" },
    { id: "protection-donnees", title: "Protection des données" },
    { id: "droits-utilisateurs", title: "Vos droits" },
    { id: "cookies", title: "Cookies et technologies similaires" },
    { id: "transferts-internationaux", title: "Transferts internationaux" },
    { id: "conservation-donnees", title: "Conservation des données" },
    { id: "modifications", title: "Modifications de cette politique" },
    { id: "contact", title: "Nous contacter" }
  ];

  const dataTypes = [
    {
      icon: <Users className="w-5 h-5 text-brand-500" />,
      title: "Informations personnelles",
      description: "Nom, prénom, adresse email, numéro de téléphone, fonction"
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-light-500" />,
      title: "Informations techniques",
      description: "Adresse IP, navigateur, système d'exploitation, données de connexion"
    },
    {
      icon: <FileText className="w-5 h-5 text-orange-500" />,
      title: "Données d'utilisation",
      description: "Pages visitées, fonctionnalités utilisées, temps de session"
    },
    {
      icon: <Shield className="w-5 h-5 text-success-500" />,
      title: "Données d'entreprise",
      description: "Informations sur votre entreprise, clients, projets, transactions"
    }
  ];

  const userRights = [
    "Droit d'accès à vos données personnelles",
    "Droit de rectification des données inexactes",
    "Droit à l'effacement (droit à l'oubli)",
    "Droit à la limitation du traitement",
    "Droit à la portabilité des données",
    "Droit d'opposition au traitement",
    "Droit de retirer votre consentement"
  ];

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table des matières */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Table des matières
              </h3>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors py-1"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800">
              {/* En-tête */}
              <div className="p-8 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-8 h-8 text-brand-500" />
                  <h1 className="text-title-lg text-gray-900 dark:text-white font-bold">
                    Politique de confidentialité
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Chez LouraTech, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
                </p>
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Dernière mise à jour : {lastUpdated}</span>
                </div>
              </div>

              <div className="p-8 space-y-12">
                {/* Introduction */}
                <section id="introduction">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    1. Introduction
                  </h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      LouraTech est une plateforme SaaS de gestion d&apos;entreprises basée en Afrique. 
                      Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons 
                      vos informations personnelles lorsque vous utilisez notre service.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      En utilisant LouraTech, vous acceptez les pratiques décrites dans cette politique. 
                      Si vous n&apos;acceptez pas cette politique, veuillez ne pas utiliser notre service.
                    </p>
                  </div>
                </section>

                {/* Collecte des données */}
                <section id="collecte-donnees">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-6">
                    2. Collecte des données
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {dataTypes.map((type, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {type.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                              {type.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Nous collectons ces informations lorsque vous créez un compte, utilisez nos services, 
                    ou communiquez avec nous. Toutes les données sont collectées de manière légale et transparente.
                  </p>
                </section>

                {/* Utilisation des données */}
                <section id="utilisation-donnees">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    3. Utilisation des données
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Nous utilisons vos données pour :
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Fournir et maintenir nos services de gestion d&apos;entreprise</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Personnaliser votre expérience utilisateur</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Communiquer avec vous concernant votre compte</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Améliorer nos services et développer de nouvelles fonctionnalités</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Assurer la sécurité et prévenir la fraude</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Respecter nos obligations légales</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Partage des données */}
                <section id="partage-donnees">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    4. Partage des données
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
                    </p>
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-warning-800 dark:text-warning-200">
                            Partage limité et sécurisé
                          </p>
                          <ul className="space-y-1 text-warning-700 dark:text-warning-300">
                            <li>• Avec votre consentement explicite</li>
                            <li>• Avec nos prestataires de services de confiance</li>
                            <li>• Pour respecter les obligations légales</li>
                            <li>• En cas de fusion ou acquisition d&apos;entreprise</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Protection des données */}
                <section id="protection-donnees">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    5. Protection des données
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <Lock className="w-8 h-8 text-success-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Chiffrement</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Chiffrement SSL/TLS pour toutes les communications
                      </p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <Shield className="w-8 h-8 text-blue-light-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Sécurité</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mesures de sécurité physiques et logiques
                      </p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <Eye className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Surveillance</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monitoring continu des accès et activités
                      </p>
                    </div>
                  </div>
                </section>

                {/* Droits des utilisateurs */}
                <section id="droits-utilisateurs">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    6. Vos droits
                  </h2>
                  <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-6">
                    <h3 className="font-medium text-brand-900 dark:text-brand-100 mb-4">
                      Vous disposez des droits suivants concernant vos données :
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {userRights.map((right, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                          <span className="text-sm text-brand-800 dark:text-brand-200">{right}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-brand-700 dark:text-brand-300 mt-4">
                      Pour exercer ces droits, contactez-nous à l&apos;adresse : privacy@louratech.com
                    </p>
                  </div>
                </section>

                {/* Cookies */}
                <section id="cookies">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    7. Cookies et technologies similaires
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, 
                    analyser l&apos;utilisation de notre service et personnaliser le contenu.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-3 h-3 bg-success-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">Cookies essentiels</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Nécessaires au fonctionnement du service</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">Cookies d&apos;analyse</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pour comprendre l&apos;utilisation du service</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Transferts internationaux */}
                <section id="transferts-internationaux">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    8. Transferts internationaux
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Vos données peuvent être transférées et traitées dans des pays autres que le vôtre. 
                    Nous nous assurons que ces transferts respectent les réglementations applicables en matière de protection des données 
                    et que des garanties appropriées sont mises en place.
                  </p>
                </section>

                {/* Conservation des données */}
                <section id="conservation-donnees">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    9. Conservation des données
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Nous conservons vos données personnelles aussi longtemps que nécessaire pour :
                  </p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>• Fournir nos services</li>
                    <li>• Respecter nos obligations légales</li>
                    <li>• Résoudre les litiges</li>
                    <li>• Faire respecter nos accords</li>
                  </ul>
                </section>

                {/* Modifications */}
                <section id="modifications">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    10. Modifications de cette politique
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Nous pouvons modifier cette politique de confidentialité de temps à autre. 
                    Nous vous informerons des changements importants par email ou via notre plateforme. 
                    La version mise à jour sera effective dès sa publication.
                  </p>
                </section>

                {/* Contact */}
                <section id="contact">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    11. Nous contacter
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
                      vous pouvez nous contacter :
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Email :</span> contact@louratech.com
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Adresse :</span> LouraTech, Conakry, Guinee
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Téléphone :</span> +224 622 22 22 22
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;