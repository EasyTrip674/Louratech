import { NextRequest, NextResponse } from 'next/server'
// import { auth } from './lib/auth'

// // Routes protégées - ajoute tes routes ici
const protectedRoutes = [
  '/services',
  '/profile',
  '/admin',
  '/settings',
  // Ajoute d'autres routes protégées
]

// // Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/',
  '/auth/signin',
  '/register',
  '/forgot-password',
  '/auth/organization',
  '/docs',
  '/politiques'
]

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl
  
  // // Vérifier si c'est une route d'API d'authentification Better Auth
  // if (pathname.startsWith('/api/auth')) {
  //   return NextResponse.next()
  // }

  // // Vérifier si c'est une route publique
  // const isPublicRoute = publicRoutes.some(route => 
  //   pathname === route || pathname.startsWith(route)
  // )

  // // Vérifier si c'est une route protégée
  // const isProtectedRoute = protectedRoutes.some(route => 
  //   pathname === route || pathname.startsWith(route)
  // )

  // if (isPublicRoute && !isProtectedRoute) {
  //   return NextResponse.next()
  // }

  // const sessionToken = request.cookies.get('better-auth.session_token')?.value

  // if (!sessionToken && isProtectedRoute) {
  //   // Rediriger vers la page de login si pas de session
  //   const loginUrl = new URL('/auth/signin', request.url)
  //   // loginUrl.searchParams.set('callbackUrl', pathname)
  //   return NextResponse.redirect(loginUrl)
  // }
  // // try {
  // //   // Récupérer la session avec Better Auth
  // //   const session = await auth.api.getSession({
  // //     headers: request.headers
  // //   })

  // //   // Si pas de session et route protégée, rediriger vers login
  // //   if (!session && isProtectedRoute) {
  // //     const loginUrl = new URL('/auth/signin', request.url)
  // //     // loginUrl.searchParams.set('callbackUrl', pathname)
  // //     return NextResponse.redirect(loginUrl)
  // //   }

  // //   // Si session valide, ajouter les infos utilisateur aux headers
  // //   if (session?.user) {
  // //     const response = NextResponse.next()
  // //     response.headers.set('x-user-id', session.user.id)
  // //     if (session.user.email) {
  // //       response.headers.set('x-user-email', session.user.email)
  // //     }
  // //     return response
  // //   }

  // // } catch (error) {
  // //   console.error('Erreur lors de la vérification de session:', error)
    
  // //   // En cas d'erreur, rediriger vers login pour les routes protégées
  // //   if (isProtectedRoute) {
  // //     const loginUrl = new URL('/auth/signin', request.url)
  // //     // loginUrl.searchParams.set('callbackUrl', pathname)
  // //     return NextResponse.redirect(loginUrl)
  // //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf :
     * - api routes (sauf /api/auth)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     * - fichiers avec extension
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}