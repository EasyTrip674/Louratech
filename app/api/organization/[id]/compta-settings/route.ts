import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/db/prisma';

// POST /api/organization/[id]/compta-settings
// Crée les paramètres comptables de l'organisation
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'utilisateur a accès à cette organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        organization: true,
        authorize: true
      },
    });

    if (!user?.organization || user.organization.id !== params.id) {
      return NextResponse.json({ error: 'Accès non autorisé à cette organisation' }, { status: 403 });
    }

    // Vérifier les permissions
    if (!user.authorize?.canCreateComptaSettings) {
      return NextResponse.json({ error: 'Vous n\'avez pas les permissions pour créer les paramètres comptables' }, { status: 403 });
    }

    // Récupérer les données de la requête
    const data = await request.json();

    // Valider les données requises
    if (!data.fiscalYear) {
      return NextResponse.json({ error: 'La date de début d\'année fiscale est requise' }, { status: 400 });
    }

    // Créer les paramètres comptables
    const comptaSettings = await prisma.comptaSettings.create({
      data: {
        fiscalYear: new Date(data.fiscalYear),
        taxIdentification: data.taxIdentification ?? 0,
        currency: data.currency ?? 'FNG',
        defaultTaxRate: data.defaultTaxRate || 0,
        invoicePrefix: data.invoicePrefix || "FTX-",
        invoiceNumberFormat: data.invoiceNumberFormat ?? "{YEAR}-{MONTH}-{DAY}-{NUM}",
        organizationId: params.id,
      },
    });

    return NextResponse.json({
      message: 'Paramètres comptables créés avec succès',
      comptaSettings,
    });
  } catch (error) {
    console.error('Erreur lors de la création des paramètres comptables:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création des paramètres comptables' },
      { status: 500 }
    );
  }
}

// PUT /api/organization/[id]/compta-settings
// Met à jour les paramètres comptables de l'organisation
export async function PUT(
  request: NextRequest,
  { params 
}: { params: { id: string } }
) {
    try {
        // Vérifier l'authentification
        const session = await auth.api.getSession({
        headers: request.headers,
        });
        if (!session || !session.user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }
    
        // Vérifier si l'utilisateur a accès à cette organisation
        const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { 
            organization: true,
            authorize: true
        },
        });
    
        if (!user?.organization || user.organization.id !== params.id) {
        return NextResponse.json({ error: 'Accès non autorisé à cette organisation' }, { status: 403 });
        }
    
        // Vérifier les permissions
        if (!user.authorize?.canEditComptaSettings) {
        return NextResponse.json({ error: 'Vous n\'avez pas les permissions pour modifier les paramètres comptables' }, { status: 403 });
        }
    
        // Récupérer les données de la requête
        const data = await request.json();
    
        // Valider les données requises
        if (!data.fiscalYear) {
        return NextResponse.json({ error: 'La date de début d\'année fiscale est requise' }, { status: 400 });
        }
    
        // Mettre à jour les paramètres comptables
        const comptaSettings = await prisma.comptaSettings.update({
        where: { organizationId: params.id },
        data: {
            fiscalYear: new Date(data.fiscalYear),
            taxIdentification: data.taxIdentification || null,
            currency: data.currency || 'FNG',
            defaultTaxRate: data.defaultTaxRate || null,
            invoicePrefix: data.invoicePrefix || null,
            invoiceNumberFormat: data.invoiceNumberFormat || null,
        },
        });
    
        return NextResponse.json({
        message: 'Paramètres comptables mis à jour avec succès',
        comptaSettings,
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres comptables:', error);
        return NextResponse.json(
        { error: 'Erreur lors de la mise à jour des paramètres comptables' },
        { status: 500 }
        );
    }
    }