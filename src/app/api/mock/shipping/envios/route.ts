import { NextRequest, NextResponse } from 'next/server';
import { generarCodigoSeguimiento, empresasLogisticasMock } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, direccion_destino, empresa_logistica } = body;

    if (!order_id || !direccion_destino) {
      return NextResponse.json(
        { error: 'order_id y direccion_destino son requeridos' },
        { status: 400 }
      );
    }

    const envio = {
      envio_id: 'env_' + Math.random().toString(36).substring(7),
      codigo_seguimiento: generarCodigoSeguimiento(),
      estado: 'pending',
      orden_id: order_id,
      direccion_destino,
      empresa_logistica: empresa_logistica || empresasLogisticasMock[0],
      fecha_creacion: new Date().toISOString(),
    };

    return NextResponse.json(envio, { status: 201 });
  } catch (error) {
    console.error('Error creating envio:', error);
    return NextResponse.json(
      { error: 'Error creating envio' },
      { status: 500 }
    );
  }
}
