import { NextRequest, NextResponse } from 'next/server';
import { syncUserToDB } from '@/lib/clerk';
import { itemCarritoSchema, actualizarItemCarritoSchema } from '@/lib/validation';
import {
  actualizarItemCarritoMock,
  agregarItemCarritoMock,
  removerItemCarritoMock,
} from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

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
    const validated = itemCarritoSchema.parse(body);

    const item = agregarItemCarritoMock(
      comprador.id,
      validated.productoId,
      validated.cantidad
    );

    if (!item) {
      return NextResponse.json(
        { error: 'Producto no disponible' },
        { status: 400 }
      );
    }

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error adding to carrito:', error);
    return NextResponse.json(
      { error: 'Error adding to carrito' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, cantidad } = body;

    const validated = actualizarItemCarritoSchema.parse({ cantidad });

    const item = actualizarItemCarritoMock(comprador.id, itemId, validated.cantidad);

    if (!item) {
      return NextResponse.json(
        { error: 'Item no encontrado o cantidad no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating carrito item:', error);
    return NextResponse.json(
      { error: 'Error updating carrito item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId } = body;

    removerItemCarritoMock(comprador.id, itemId);

    return NextResponse.json({ message: 'Item removido del carrito' });
  } catch (error) {
    console.error('Error removing from carrito:', error);
    return NextResponse.json(
      { error: 'Error removing from carrito' },
      { status: 500 }
    );
  }
}
