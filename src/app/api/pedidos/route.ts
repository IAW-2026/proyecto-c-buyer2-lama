import { NextRequest, NextResponse } from 'next/server';
import { syncUserToDB } from '@/lib/clerk';
import { crearPedidoSchema } from '@/lib/validation';
import { agregarEstadosContrato } from '@/lib/orderStatus';
import {
  crearPedidoMock,
  listarPedidosPorCompradorMock,
} from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const pedidos = listarPedidosPorCompradorMock(comprador.id);

    return NextResponse.json(pedidos.map(agregarEstadosContrato));
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    return NextResponse.json(
      { error: 'Error fetching pedidos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = crearPedidoSchema.parse(body);
    const pedido = crearPedidoMock({
      compradorId: comprador.id,
      metodoPago: validated.metodoPago,
      direccionEnvio: validated.direccionEnvio,
    });

    if (!pedido) {
      return NextResponse.json(
        { error: 'El carrito esta vacio' },
        { status: 400 }
      );
    }

    return NextResponse.json(agregarEstadosContrato(pedido), { status: 201 });
  } catch (error) {
    console.error('Error creating pedido:', error);
    return NextResponse.json(
      { error: 'Error creating pedido' },
      { status: 500 }
    );
  }
}
