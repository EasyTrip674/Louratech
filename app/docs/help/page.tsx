"use client"
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  Book, 
  X,
  Menu,
  Search
} from 'lucide-react';
import { tableOfContents } from './constants';
import Introduction from './sections/Introduction';
import Connexion from './sections/Connexion';
import CreationAgence from './sections/CreationAgence';
import GestionServices from './sections/GestionServices';
import GestionFinances from './sections/GestionFinances';
// import GestionClients from './sections/GestionClients';
import GestionEmployees from './sections/GestionEmployees';
import GestionParametres from './sections/GestionParametres';
import Assistance from './sections/Assistance';
import Logo from '@/components/logo';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import InterfaceAndNavigation from './sections/InterfaceAndNavigation';
import BackButton from '@/layout/BackButton';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    // 'connexion': true,
    // 'gestion-services': true,
    // 'gestion-utilisateurs': true,
    // 'gestion-clients': true,
    // 'gestion-financiere': true,
    // 'parametres': true,
    // 'assistance': true,
  });


  const toggleSection = (sectionId:string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId as keyof typeof prev]
    }));
  };

  const scrollToSection = (sectionId:string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
         <Introduction />
        );

      case 'connexion':
        return (
         <Connexion />
        );

      case "interface":
        return (
          <InterfaceAndNavigation />
        )

      case 'creation-agence':
        return (
          <CreationAgence />
        );

      case 'gestion-services':
        return (
         <GestionServices />
        );

      case 'gestion-utilisateurs':
        return (
          <GestionEmployees />
        );

      // case 'gestion-clients':
      //   return (
      //     <GestionClients />
      //   );

      case 'gestion-finances':
        return (
          <GestionFinances />
        );

      case 'gestion-parametres':
        return (
          <GestionParametres />
        );

      case 'assistance':
        return (
          <Assistance />
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Section en cours de rédaction
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cette section sera bientôt disponible avec tous les détails nécessaires.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
             <Logo className="w-10 h-10" />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans la documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <ThemeToggleButton />
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-80 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 h-fit sticky top-24`}>
            <BackButton />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white my-6">Guide d&apos;Usage</h2>
            <nav className="space-y-2">
              {tableOfContents.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {section.icon}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    {section.subsections.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(section.id);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        {expandedSections[section.id as keyof typeof expandedSections] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </button>
                  
                  {section.subsections.length > 0 && expandedSections[section.id as keyof typeof expandedSections] && (
                    <div className="ml-6 mt-2 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => scrollToSection(subsection.id)}
                          className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
              