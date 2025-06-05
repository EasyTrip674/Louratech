import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 });
    }

    const whereClause: any = { organizationId };
    if (type) {
      whereClause.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        expense: {
          select: {
            vendor: true,
            invoiceNumber: true,
          },
        },
        revenue: {
          select: {
            source: true,
            referenceNumber: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 