import Logo from "@/components/logo";

export default function Introduction() {
    return (
        <section id="introduction" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-fuchsia-400/10"></div>
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
              </div>
              
              <div className="relative px-8 py-12">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                    <span className="text-white/90 text-sm font-medium">Nouvelle génération • SaaS • Afrique</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text flex justify-center">
                      <Logo  />
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                    La plateforme de gestion d&apos;entreprises qui révolutionne la façon dont les entreprises africaines 
                    <span className="text-cyan-400 font-semibold"> pilotent leurs activités</span> et 
                    <span className="text-purple-400 font-semibold"> développent leur croissance</span>.
                  </p>
                  
                  {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                      Commencer l&apos;exploration
                    </button>
                    <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl border border-white/20 transition-all duration-300">
                      Voir la démo
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gestion Client</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Centralisez toutes les informations clients et suivez leur parcours en temps réel.</p>
              </div>


              <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Finance Simplifiée</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Gérez votre comptabilité et vos finances avec des tableaux de bord intuitifs.</p>
              </div>

              <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Services Unifiée</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Centralisez tous vos services en un seul endroit.</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Faites confiance à la plateforme
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Rejoignez des milliers d&apos;entreprises qui transforment leur activité avec LouraTech
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    10+
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">entreprises actives</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    50k+
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">Projets réalisés</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                    99.9%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">Disponibilité</div>
                </div>
                
              </div>
            </div>

            {/* Documentation Info */}
            <div className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-950 dark:via-gray-900 dark:to-cyan-950 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 rounded-tr-full"></div>
              
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Guide complet d&apos;utilisation
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Cette documentation vous accompagne dans la découverte et la maîtrise de toutes les fonctionnalités de LouraTech. 
                      Des premiers pas aux fonctionnalités avancées, tout est expliqué de manière claire et détaillée.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Version 3.0
                      </span>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Mis à jour
                      </span>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Guide interactif
                      </span>
                    </div>
                    
                    {/* <div className="flex flex-col sm:flex-row gap-3">
                      <button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                       Commencer
                      </button>
                      <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-300">
                        Télécharger PDF
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
    )
}