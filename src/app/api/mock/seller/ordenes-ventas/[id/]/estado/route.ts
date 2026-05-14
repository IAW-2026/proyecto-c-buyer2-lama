import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crearRespuestaEstadoOrden } from '@/lib/orderStatus';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedido = await prisma.pedido.findFirst({
      where: {
        OR: [{ id: params.id }, { numeroOrden: params.id }],
      },
      include: {
        estadoEnvio: true,
      },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(crearRespuestaEstadoOrden(pedido));
  } catch (error) {
    console.error('Error fetching seller orden:', error);
    return NextResponse.json(
      { error: 'Error fetching orden' },
      { status: 500 }
    );
  }
}
