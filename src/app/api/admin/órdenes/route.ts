import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { agregarEstadosContrato } from '@/lib/orderStatus';
import { listarOrdenesMock } from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

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
    const estados = estado ? estadosLegacyPorContrato[estado] || [estado] : [];

    const allOrdenes = estados.length
      ? estados.flatMap((estadoOrden) =>
          listarOrdenesMock({ estado: estadoOrden, page: 1, limit: 1000 }).ordenes
        )
      : listarOrdenesMock({ page: 1, limit: 1000 }).ordenes;
    const skip = (page - 1) * limit;
    const compradores = await prisma.comprador.findMany({
      where: {
        id: {
          in: allOrdenes.map((orden) => orden.compradorId),
        },
      },
      select: {
        id: true,
        nombreComprador: true,
        email: true,
      },
    });
    const compradoresById = new Map(compradores.map((comprador) => [comprador.id, comprador]));
    const ordenes = allOrdenes.slice(skip, skip + limit).map((orden) => ({
      ...orden,
      comprador: compradoresById.get(orden.compradorId) || {
        nombreComprador: 'Comprador mock',
        email: 'mock@example.com',
      },
    }));

    return NextResponse.json({
      ordenes: ordenes.map(agregarEstadosContrato),
      total: allOrdenes.length,
      page,
      limit,
      pages: Math.ceil(allOrdenes.length / limit),
    });
  } catch (error) {
    console.error('Error fetching ordenes:', error);
    return NextResponse.json(
      { error: 'Error fetching ordenes' },
      { status: 500 }
    );
  }
}
