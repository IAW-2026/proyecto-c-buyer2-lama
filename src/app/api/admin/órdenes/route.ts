import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { agregarEstadosContrato } from '@/lib/orderStatus';

const estadosLegacyPorContrato: Record<string, string[]> = {
  pendiente_pago: ['pendiente_pago', 'pendiente'],
  pagada: ['pagada', 'pagado'],
  en_preparacion: ['en_preparacion'],
  despachada: ['despachada', 'enviado'],
  finalizada: ['finalizada', 'entregado'],
  cancelada: ['cancelada', 'cancelado'],
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const estado = searchParams.get('estado') || '';

    const skip = (page - 1) * limit;

    const where: any = {};
    if (estado) {
      where.estado = {
        in: estadosLegacyPorContrato[estado] || [estado],
      };
    }

    const [ordenes, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        include: {
          comprador: {
            select: {
              nombreComprador: true,
              email: true,
            },
          },
          estadoEnvio: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pedido.count({ where }),
    ]);

    return NextResponse.json({
      ordenes: ordenes.map(agregarEstadosContrato),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching órdenes:', error);
    return NextResponse.json(
      { error: 'Error fetching órdenes' },
      { status: 500 }
    );
  }
}
