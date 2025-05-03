import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/db/prisma';
// import { uploadFile } from '@/lib/upload'; // Assumé que vous avez un service d'upload
import { del, put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

// PUT /api/organization/[id]
// Met à jour les informations de l'organisation
export async function PUT(
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
    if (!user.authorize?.canEditOrganization) {
      return NextResponse.json({ error: 'Vous n\'avez pas les permissions pour modifier l\'organisation' }, { status: 403 });
    }

    // Traiter les données de la requête (multipart form-data)
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const logoFile = formData.get('logo') as File | null;

    // Vérifier les données requises
    if (!name) {
      return NextResponse.json({ error: 'Le nom de l\'organisation est requis' }, { status: 400 });
    }

    // Préparer les données à mettre à jour
    const updateData: {
        name: string;
        description: string | null;
        logo?: string | null;
    } = {
      name,
      description: description || null,
    };
    
    // Traiter le logo si présent
    if (logoFile) {
      try {
        // Assurez-vous que le fichier est valide
        if (!(logoFile instanceof File)) {
          return NextResponse.json({ error: 'Fichier logo invalide' }, { status: 400 });
        }
        // garder l'ancien lien pour le suppression
        const OldlogoUrl = user.organization.logo;
        const blob = await put(user.organization.slug+Date.now(), logoFile, {
            access: 'public',
          });
        updateData.logo = blob.url;
         // Assurez-vous que l'URL est correcte
        if (!updateData.logo) {
          return NextResponse.json({ error: 'Erreur lors de l\'upload du logo' }, { status: 400 });
        }
        // Supprimer l'ancien logo si nécessaire
        if (OldlogoUrl) {
          try {
            await del(OldlogoUrl); // Assurez-vous d'avoir une fonction pour supprimer le fichier
          } catch (deleteError) {
            console.error('Erreur lors de la suppression de l\'ancien logo:', deleteError);
          }
        }
      } catch (uploadError) {
        console.error('Erreur lors de l\'upload du logo:', uploadError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'upload du logo' },
          { status: 500 }
        );
      }
    }

    // Mettre à jour l'organisation
    const updatedOrganization = await prisma.organization.update({
      where: { id: params.id },
      data: {
        ...updateData,
      },
    });

    revalidatePath('/');

    return NextResponse.json({
      message: 'Organisation mise à jour avec succès',
      organization: updatedOrganization,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'organisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'organisation' },
      { status: 500 }
    );
  }
}