import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, procedureId, organizationId, notes, dueDate } = body;

    if (!clientId || !procedureId || !organizationId) {
      return NextResponse.json(
        { error: "Client ID, Procedure ID, and Organization ID are required" },
        { status: 400 }
      );
    }

    // Vérifier que le client et la procédure appartiennent à l'organisation
    const [client, procedure] = await Promise.all([
      prisma.client.findFirst({
        where: { id: clientId, organizationId },
      }),
      prisma.procedure.findFirst({
        where: { id: procedureId, organizationId },
      }),
    ]);

    if (!client || !procedure) {
      return NextResponse.json(
        { error: "Client or Procedure not found in this organization" },
        { status: 404 }
      );
    }

    // Créer la procédure client
    const clientProcedure = await prisma.clientProcedure.create({
      data: {
        clientId,
        procedureId,
        organizationId,
        notes,
        dueDate: dueDate ? new Date(dueDate) : null,
        reference: `REF-${Date.now()}`, // Générer une référence unique
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                name: true,
              },
            },
          },
        },
        procedure: {
          select: {
            name: true,
            description: true,
            steps: {
              select: {
                id: true,
                name: true,
                order: true,
                price: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    // Créer les étapes client associées
    const procedure_steps = await prisma.stepProcedure.findMany({
      where: { procedureId },
      orderBy: { order: "asc" },
    });

    const clientSteps = await Promise.all(
      procedure_steps.map((step) => 
        prisma.clientStep.create({
          data: {
            clientProcedureId: clientProcedure.id,
            stepId: step.id,
            price: step.price,
          },
        })
      )
    );

    return NextResponse.json({
      ...clientProcedure,
      steps: clientSteps,
    });
  } catch (error) {
    console.error("Error creating client procedure:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 