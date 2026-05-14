import { NextRequest, NextResponse } from 'next/server';
import { syncUserToDB } from '@/lib/clerk';
import { agregarEstadosContrato } from '@/lib/orderStatus';
import { obtenerPedidoPorCompradorMock } from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const pedido = obtenerPedidoPorCompradorMock(params.id, comprador.id);

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(agregarEstadosContrato(pedido));
  } catch (error) {
    console.error('Error fetching pedido:', error);
    return NextResponse.json(
      { error: 'Error fetching pedido' },
      { status: 500 }
    );
  }
}
