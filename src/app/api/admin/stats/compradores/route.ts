import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalCompradores, pedidos] = await Promise.all([
      prisma.comprador.count(),
      prisma.pedido.findMany({
        select: {
          montoTotal: true,
        },
      }),
    ]);

    const ingresosTotales = pedidos.reduce(
      (sum, p) => sum + p.montoTotal,
      0
    );

    return NextResponse.json({
      total: totalCompradores,
      totalPedidos: pedidos.length,
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
