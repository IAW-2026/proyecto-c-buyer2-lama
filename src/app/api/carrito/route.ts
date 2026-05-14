import { NextResponse } from 'next/server';
import { syncUserToDB } from '@/lib/clerk';
import {
  obtenerCarritoMock,
  vaciarCarritoMock,
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

    return NextResponse.json(obtenerCarritoMock(comprador.id));
  } catch (error) {
    console.error('Error fetching carrito:', error);
    return NextResponse.json(
      { error: 'Error fetching carrito' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    vaciarCarritoMock(comprador.id);

    return NextResponse.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error vaciar carrito:', error);
    return NextResponse.json(
      { error: 'Error vaciar carrito' },
      { status: 500 }
    );
  }
}
