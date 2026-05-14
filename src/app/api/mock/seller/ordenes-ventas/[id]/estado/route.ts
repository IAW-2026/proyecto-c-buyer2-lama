import { NextRequest, NextResponse } from 'next/server';
import { crearRespuestaEstadoOrden } from '@/lib/orderStatus';
import { obtenerPedidoMock } from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedido = obtenerPedidoMock(params.id);

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
