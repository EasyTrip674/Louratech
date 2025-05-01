import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/db/prisma';

// GET /api/organization/current
// Récupère les informations de l'organisation active pour l'utilisateur connecté
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur avec son organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    });

    if (!user || !user.organizationId) {
      return NextResponse.json({ error: 'Aucune organisation trouvée' }, { status: 404 });
    }

    // Récupérer les paramètres comptables de l'organisation
    const comptaSettings = await prisma.comptaSettings.findUnique({
      where: { organizationId: user.organizationId },
    });

    return NextResponse.json({
      organization: user.organization,
      comptaSettings: comptaSettings,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'organisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}