import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserToDB } from '@/lib/clerk';

export async function GET() {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const items = await prisma.itemCarrito.findMany({
      where: { compradorId: comprador.id },
      include: { producto: true },
    });

    const total = items.reduce(
      (sum, item) => sum + item.precioUnitario * item.cantidad,
      0
    );

    return NextResponse.json({
      items,
      total,
      cantidad: items.reduce((sum, item) => sum + item.cantidad, 0),
    });
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

    await prisma.itemCarrito.deleteMany({
      where: { compradorId: comprador.id },
    });

    return NextResponse.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error vaciar carrito:', error);
    return NextResponse.json(
      { error: 'Error vaciar carrito' },
      { status: 500 }
    );
  }
}
