import { NextRequest, NextResponse } from 'next/server'

// Routes protégées
// const protectedRoutes = [
//   '/services',
//   '/profile',
//   '/admin',
//   '/settings',
// ]

// // Routes publiques
// const publicRoutes = [
//   '/',
//   '/auth/signin',
//   '/register',
//   '/forgot-password',
//   '/auth/organization',
//   '/docs',
//   '/politiques'
// ]

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl
  
  // // Ignorer les routes d'API Better Auth
  // if (pathname.startsWith('/api/auth')) {
  //   return NextResponse.next()
  // }

  // // Vérifier si c'est une route publique
  // const isPublicRoute = publicRoutes.some(route => 
  //   pathname === route || (route !== '/' && pathname.startsWith(route))
  // )

  // // Vérifier si c'est une route protégée
  // const isProtectedRoute = protectedRoutes.some(route => 
  //   pathname === route || pathname.startsWith(route)
  // )

  // // Laisser passer les routes publiques
  // if (isPublicRoute && !isProtectedRoute) {
  //   return NextResponse.next()
  // }

  // // Récupérer le token de session
  // const sessionToken = request.cookies.get('better-auth.session_token')?.value

  // // Si pas de token et route protégée, rediriger
  // if (!sessionToken && isProtectedRoute) {
  //   const loginUrl = new URL('/auth/signin', request.url)
  //   loginUrl.searchParams.set('callbackUrl', pathname)
  //   return NextResponse.redirect(loginUrl)
  // }

  // // Redirection pour utilisateurs connectés sur la page d'accueil
  // if (sessionToken && pathname === '/') {
  //   return NextResponse.redirect(new URL('/services', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)',
  ],
}