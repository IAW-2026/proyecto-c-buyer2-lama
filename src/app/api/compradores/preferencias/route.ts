import { NextResponse } from 'next/server';
import { syncUserToDB } from '@/lib/clerk';
import { prisma } from '@/lib/prisma';
import { preferenciaSchema } from '@/lib/validation';

export async function GET() {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const preferencias = await prisma.preferenciaComprador.findUnique({
      where: { compradorId: comprador.id },
    });

    return NextResponse.json(
      preferencias || {
        tallesPreferidos: [],
        categoriasPreferidas: [],
        vendedoresPreferidos: [],
      }
    );
  } catch (error) {
    console.error('Error fetching preferencias:', error);
    return NextResponse.json(
      { error: 'Error fetching preferencias' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = preferenciaSchema.parse(body);

    const preferencias = await prisma.preferenciaComprador.upsert({
      where: { compradorId: comprador.id },
      update: validated,
      create: {
        compradorId: comprador.id,
        ...validated,
      },
    });

    return NextResponse.json(preferencias);
  } catch (error) {
    console.error('Error updating preferencias:', error);
    return NextResponse.json(
      { error: 'Error updating preferencias' },
      { status: 500 }
    );
  }
}
