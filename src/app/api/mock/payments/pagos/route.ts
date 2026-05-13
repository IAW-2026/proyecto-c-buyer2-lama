import { NextRequest, NextResponse } from 'next/server';
import { simularRespuestaPago } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orden_id, monto_total } = body;

    if (!orden_id || !monto_total) {
      return NextResponse.json(
        { error: 'orden_id y monto_total son requeridos' },
        { status: 400 }
      );
    }

    const pago = simularRespuestaPago(orden_id, monto_total);

    return NextResponse.json(pago, { status: 201 });
  } catch (error) {
    console.error('Error creating pago:', error);
    return NextResponse.json(
      { error: 'Error creating pago' },
      { status: 500 }
    );
  }
}
