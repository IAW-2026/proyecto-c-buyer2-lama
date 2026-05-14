import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserToDB } from '@/lib/clerk';
import { agregarEstadosContrato } from '@/lib/orderStatus';

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

    const pedido = await prisma.pedido.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { producto: true } },
        estadoEnvio: true,
      },
    });

    if (!pedido || pedido.compradorId !== comprador.id) {
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
