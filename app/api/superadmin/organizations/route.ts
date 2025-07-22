import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function GET() {
 
  return NextResponse.json(organizations);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const org = await prisma.organization.create({ data });
  return NextResponse.json(org, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const org = await prisma.organization.update({
    where: { id: data.id },
    data,
  });
  return NextResponse.json(org);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.organization.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 