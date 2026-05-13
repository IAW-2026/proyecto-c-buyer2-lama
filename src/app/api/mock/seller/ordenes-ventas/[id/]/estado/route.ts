import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: params.id },
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

    return NextResponse.json({
      orden_id: pedido.id,
      estado_general: pedido.estado,
      estado_pago: 'aprobado',
      estado_envio: pedido.estadoEnvio?.estado || 'pendiente',
      fecha_actualizacion: pedido.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching seller orden:', error);
    return NextResponse.json(
      { error: 'Error fetching orden' },
      { status: 500 }
    );
  }
}
