import { NextRequest, NextResponse } from 'next/server';
import { obtenerProductoMock } from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = obtenerProductoMock(params.id);

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error fetching producto:', error);
    return NextResponse.json(
      { error: 'Error fetching producto' },
      { status: 500 }
    );
  }
}
