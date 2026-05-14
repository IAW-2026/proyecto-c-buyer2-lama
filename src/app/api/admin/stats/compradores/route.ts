import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { obtenerStatsOrdenesMock } from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalCompradores = await prisma.comprador.count();
    const { totalPedidos, ingresosTotales } = obtenerStatsOrdenesMock();

    return NextResponse.json({
      total: totalCompradores,
      totalPedidos,
      ingresosTotales,
    });
  } catch (error) {
    console.error('Error fetching compradores stats:', error);
    return NextResponse.json(
      { error: 'Error fetching stats' },
      { status: 500 }
    );
  }
}
