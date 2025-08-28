import { Book, Shield, Home, FileText, Briefcase, Users, UserPlus, DollarSign, Settings, HelpCircle } from "lucide-react";

export   const tableOfContents = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <Book className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'connexion',
      title: 'Connexion et authentification',
      icon: <Shield className="w-4 h-4" />,
      subsections: [
        { id: 'premiere-connexion', title: 'Première connexion' },
        { id: 'authentification', title: 'Authentification' },
        { id: 'mot-de-passe-oublie', title: 'Mot de passe oublié' }
      ]
    },
    {
      id: 'creation-entreprise',
      title: 'Création de l\'entreprise',
      icon: <Home className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'interface',
      title: 'Interface et navigation',
      icon: <FileText className="w-4 h-4" />,
      subsections: [
        { id: 'tableau-bord', title: 'Tableau de bord' },
        { id: 'menu-principal', title: 'Menu principal' }
      ]
    },
    {
      id: 'gestion-services',
      title: 'Gestion des services',
      icon: <Briefcase className="w-4 h-4" />,
      subsections: [
        { id: 'creation-service', title: 'Création d\'un service' },
        { id: 'modification-service', title: 'Modification d\'un service' },
        { id: 'gestion-modules', title: 'Gestion des modules' },
        { id: 'inscription-clients', title: 'Inscription des clients' }
      ]
    },
    {
      id: 'gestion-utilisateurs',
      title: 'Gestion des employees ou administrateurs',
      icon: <Users className="w-4 h-4" />,
      subsections: [
        { id: 'administration', title: 'Administration' },
        { id: 'employes', title: 'Employés' },
        { id: 'gestion-droits', title: 'Gestion des droits' }
      ]
    },
    {
      id: 'gestion-clients',
      title: 'Gestion des clients',
      icon: <UserPlus className="w-4 h-4" />,
      subsections: [
        { id: 'creation-client', title: 'Création d\'un client' },
        { id: 'modification-suppression', title: 'Modification et suppression' },
        { id: 'suivi-clients', title: 'Suivi des clients' }
      ]
    },
    {
      id: 'gestion-financiere',
      title: 'Gestion financière',
      icon: <DollarSign className="w-4 h-4" />,
      subsections: [
        { id: 'revenus', title: 'Revenus' },
        { id: 'depenses', title: 'Dépenses' },
        { id: 'rapports-financiers', title: 'Rapports financiers' }
      ]
    },
    {
      id: 'parametres',
      title: 'Paramètres et configuration',
      icon: <Settings className="w-4 h-4" />,
      subsections: [
        { id: 'profil-utilisateur', title: 'Profil utilisateur' },
        { id: 'parametres-organisation', title: 'Paramètres de l\'organisation' },
        { id: 'comptabilite', title: 'Comptabilité' }
      ]
    },
    {
      id: 'support',
      title: 'Support et assistance',
      icon: <HelpCircle className="w-4 h-4" />,
      subsections: []
    }
  ];
