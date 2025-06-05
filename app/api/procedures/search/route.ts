import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const status = searchParams.get("status");
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 });
    }

    const procedures = await prisma.clientProcedure.findMany({
      where:  {
        organizationId,        
        OR: [
          { procedure: { name: { contains: query, mode: "insensitive" } } },
          { reference: { contains: query, mode: "insensitive" } },
          { client: { 
            user: { 
              OR: [
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
              ]
            }
          }},
        ],
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
            price: true,
          },
        },
        assignedTo: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
          },
        },
        steps: {
          select: {
            id: true,
            status: true,
            step: {
              select: {
                name: true,
                order: true,
              },
            },
          },
          orderBy: {
            step: {
              order: "asc",
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json(procedures);
  } catch (error) {
    console.error("Error searching procedures:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 