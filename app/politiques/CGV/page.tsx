import React from 'react';
import { ChevronRight, FileText, CreditCard, RefreshCw, Users, Globe, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const CGVPage: React.FC = () => {
  const lastUpdated = "15 janvier 2025";

  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Définitions" },
    { id: "objet-contrat", title: "Objet du contrat" },
    { id: "inscription-compte", title: "Inscription et compte" },
    { id: "services-fournis", title: "Services fournis" },
    { id: "tarifs-paiement", title: "Tarifs et paiement" },
    { id: "duree-resiliation", title: "Durée et résiliation" },
    { id: "obligations-client", title: "Obligations du client" },
    { id: "obligations-louratech", title: "Obligations de LouraTech" },
    { id: "propriete-intellectuelle", title: "Propriété intellectuelle" },
    { id: "donnees-confidentialite", title: "Données et confidentialité" },
    { id: "responsabilite", title: "Responsabilité" },
    { id: "force-majeure", title: "Force majeure" },
    { id: "droit-applicable", title: "Droit applicable" },
    { id: "contact", title: "Contact" }
  ];

  const serviceFeatures = [
    {
      icon: <Users className="w-5 h-5 text-brand-500" />,
      title: "Gestion des clients",
      description: "CRM complet pour gérer vos contacts et prospects"
    },
    {
      icon: <FileText className="w-5 h-5 text-blue-light-500" />,
      title: "Gestion des projets",
      description: "Suivi des projets, tâches et échéances"
    },
    {
      icon: <CreditCard className="w-5 h-5 text-success-500" />,
      title: "Facturation",
      description: "Création et gestion des devis et factures"
    },
    {
      icon: <Globe className="w-5 h-5 text-orange-500" />,
      title: "Reporting",
      description: "Tableaux de bord et analyses de performance"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "2 999 MAD",
      features: ["Jusqu'à 5 utilisateurs", "CRM de base", "Facturation simple", "Support email"]
    },
    {
      name: "Professional",
      price: "5 999 MAD",
      features: ["Jusqu'à 15 utilisateurs", "CRM avancé", "Gestion de projets", "Reporting", "Support prioritaire"]
    },
    {
      name: "Enterprise",
      price: "Sur devis",
      features: ["Utilisateurs illimités", "Fonctionnalités complètes", "Intégrations personnalisées", "Support dédié"]
    }
  ];

  const clientObligations = [
    "Fournir des informations exactes et à jour lors de l'inscription",
    "Respecter les conditions d'utilisation de la plateforme",
    "Maintenir la confidentialité de ses identifiants de connexion",
    "Utiliser le service conformément à sa destination",
    "Respecter les droits de propriété intellectuelle",
    "S'acquitter des paiements dans les délais convenus",
    "Signaler tout dysfonctionnement ou problème de sécurité"
  ];

  return (
    <div>
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
                  <FileText className="w-8 h-8 text-brand-500" />
                  <h1 className="text-title-lg text-gray-900 dark:text-white font-bold">
                    Conditions Générales de Vente
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Les présentes Conditions Générales de Vente régissent l&apos;utilisation de la plateforme LouraTech et définissent les droits et obligations de chaque partie.
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
                      LouraTech est une société de droit guinéen spécialisée dans le développement de solutions SaaS 
                      pour la gestion d&apos;entreprises. Notre plateforme offre des outils complets pour optimiser la gestion 
                      des clients, projets, et opérations commerciales.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      L&apos;utilisation de nos services implique l&apos;acceptation pleine et entière des présentes conditions. 
                      Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                    </p>
                  </div>
                </section>

                {/* Définitions */}
                <section id="definitions">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    2. Définitions
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">« LouraTech » :</span>
                        <span className="text-gray-700 dark:text-gray-300 ml-2">
                          La société LouraTech, éditeur de la plateforme SaaS de gestion d&apos;entreprise.
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">« Client » :</span>
                        <span className="text-gray-700 dark:text-gray-300 ml-2">
                          Toute personne physique ou morale ayant souscrit à nos services.
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">« Plateforme » :</span>
                        <span className="text-gray-700 dark:text-gray-300 ml-2">
                          L&apos;application web LouraTech accessible via notre site internet.
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">« Services » :</span>
                        <span className="text-gray-700 dark:text-gray-300 ml-2">
                          L&apos;ensemble des fonctionnalités proposées par la plateforme LouraTech.
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Objet du contrat */}
                <section id="objet-contrat">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    3. Objet du contrat
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Les présentes CGV ont pour objet de définir les conditions dans lesquelles LouraTech 
                    fournit au Client l&apos;accès à sa plateforme SaaS de gestion d&apos;entreprise, ainsi que les 
                    services associés.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                        Le contrat est formé dès l&apos;acceptation des présentes conditions par le Client 
                    et le paiement de la première facture.
                  </p>
                </section>
                
                {/* Inscription et compte */}
                <section id="inscription-compte">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    4. Inscription et compte
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Pour accéder à nos services, le Client doit créer un compte en fournissant 
                      des informations exactes et complètes.
                    </p>
                    <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-brand-800 dark:text-brand-200">
                            Conditions d&apos;inscription
                          </p>
                          <ul className="space-y-1 text-brand-700 dark:text-brand-300">
                            <li>• Être majeur ou représenter une personne morale</li>
                            <li>• Fournir des informations véridiques et à jour</li>
                            <li>• Accepter les présentes CGV</li>
                            <li>• Choisir un forfait adapté à ses besoins</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Services fournis */}
                <section id="services-fournis">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-6">
                    5. Services fournis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {serviceFeatures.map((service, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {service.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                              {service.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    LouraTech s&apos;engage à fournir une plateforme accessible 24h/24 et 7j/7, 
                    avec un taux de disponibilité de 99,5% hors maintenance programmée.
                  </p>
                </section>

                {/* Tarifs et paiement */}
                <section id="tarifs-paiement">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-6">
                    6. Tarifs et paiement
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {pricingPlans.map((plan, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                          {plan.name}
                        </h3>
                        <div className="text-2xl font-bold text-brand-500 mb-4">
                          {plan.price}
                          {plan.name !== "Enterprise" && <span className="text-sm text-gray-500 dark:text-gray-400">/mois</span>}
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Conditions de paiement :
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Facturation mensuelle à terme échu</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Paiement par carte bancaire ou virement</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>TVA applicable selon la législation en vigueur</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                        <span>Pénalités de retard : 1,5% par mois de retard</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Durée et résiliation */}
                <section id="duree-resiliation">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    7. Durée et résiliation
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Le contrat est conclu pour une durée indéterminée à compter de l&apos;activation du compte.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <RefreshCw className="w-4 h-4 mr-2 text-blue-light-500" />
                          Résiliation par le Client
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Possible à tout moment avec un préavis de 30 jours. 
                          Aucun remboursement des sommes déjà versées.
                        </p>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-warning-500" />
                          Résiliation par LouraTech
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          En cas de manquement grave aux obligations contractuelles, 
                          après mise en demeure restée sans effet.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Obligations du client */}
                <section id="obligations-client">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    8. Obligations du client
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                      Le Client s&apos;engage à :
                    </h3>
                    <div className="space-y-3">
                      {clientObligations.map((obligation, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-success-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{obligation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Obligations de LouraTech */}
                <section id="obligations-louratech">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    9. Obligations de LouraTech
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <Shield className="w-8 h-8 text-success-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Sécurité</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Garantir la sécurité et la confidentialité des données
                      </p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <Globe className="w-8 h-8 text-blue-light-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Disponibilité</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Maintenir la plateforme accessible 24h/24
                      </p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Support</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fournir une assistance technique de qualité
                      </p>
                    </div>
                  </div>
                </section>

                {/* Propriété intellectuelle */}
                <section id="propriete-intellectuelle">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    10. Propriété intellectuelle
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      LouraTech demeure propriétaire de tous les droits de propriété intellectuelle 
                      relatifs à la plateforme et aux services fournis.
                    </p>
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-warning-800 dark:text-warning-200">
                            Restrictions d&apos;utilisation
                          </p>
                          <p className="text-warning-700 dark:text-warning-300">
                            Il est interdit de reproduire, modifier, distribuer ou exploiter commercialement 
                            tout ou partie de la plateforme sans autorisation écrite préalable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Données et confidentialité */}
                <section id="donnees-confidentialite">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    11. Données et confidentialité
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Le traitement des données personnelles est régi par notre Politique de Confidentialité, 
                    qui fait partie intégrante des présentes CGV.
                  </p>
                  <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-4">
                    <p className="text-sm text-brand-700 dark:text-brand-300">
                      <strong>Important :</strong> Le Client reste propriétaire de ses données et peut 
                        les exporter à tout moment. LouraTech s&apos;engage à ne pas utiliser ces données 
                      à des fins autres que la fourniture du service.
                    </p>
                  </div>
                </section>

                {/* Responsabilité */}
                <section id="responsabilite">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    12. Responsabilité
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      La responsabilité de LouraTech est limitée aux dommages directs causés par 
                      un manquement à ses obligations contractuelles.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Exclusions de responsabilité :
                      </h3>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Dommages indirects ou perte de profit</li>
                        <li>• Interruptions de service dues à la force majeure</li>
                        <li>• Utilisation non conforme de la plateforme</li>
                        <li>• Actes de tiers ou cyberattaques</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Force majeure */}
                <section id="force-majeure">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    13. Force majeure
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    LouraTech ne pourra être tenue responsable de tout retard ou inexécution 
                    de ses obligations résultant d&apos;un cas de force majeure au sens de l&apos;article 269 
                    du Code des Obligations et Contrats guinéen.
                  </p>
                </section>

                {/* Droit applicable */}
                <section id="droit-applicable">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    14. Droit applicable et juridiction
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Les présentes CGV sont régies par le droit guinéen. En cas de litige, 
                      les parties s&apos;efforceront de trouver une solution amiable.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      À défaut d&apos;accord amiable, tout litige sera porté devant les tribunaux 
                        compétents de Conakry, Guinée.
                    </p>
                  </div>
                </section>

                {/* Contact */}
                <section id="contact">
                  <h2 className="text-title-sm text-gray-900 dark:text-white font-semibold mb-4">
                    15. Contact
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Pour toute question relative aux présentes CGV ou à nos services, 
                      vous pouvez nous contacter :
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Email :</span> contact@louratech.com
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Support :</span> support@louratech.com
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
}

export default CGVPage;