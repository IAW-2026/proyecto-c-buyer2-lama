import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserToDB } from '@/lib/clerk';
import { itemCarritoSchema, actualizarItemCarritoSchema } from '@/lib/validation';

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

    const producto = await prisma.producto.findUnique({
      where: { id: validated.productoId },
    });

    if (!producto || producto.stock < validated.cantidad) {
      return NextResponse.json(
        { error: 'Producto no disponible' },
        { status: 400 }
      );
    }

    const existing = await prisma.itemCarrito.findUnique({
      where: {
        compradorId_productoId: {
          compradorId: comprador.id,
          productoId: validated.productoId,
        },
      },
    });

    let item;
    if (existing) {
      item = await prisma.itemCarrito.update({
        where: { id: existing.id },
        data: { cantidad: existing.cantidad + validated.cantidad },
        include: { producto: true },
      });
    } else {
      item = await prisma.itemCarrito.create({
        data: {
          compradorId: comprador.id,
          productoId: validated.productoId,
          cantidad: validated.cantidad,
          precioUnitario: producto.precio,
        },
        include: { producto: true },
      });
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

    const item = await prisma.itemCarrito.update({
      where: { id: itemId },
      data: { cantidad: validated.cantidad },
      include: { producto: true },
    });

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

    await prisma.itemCarrito.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item removido del carrito' });
  } catch (error) {
    console.error('Error removing from carrito:', error);
    return NextResponse.json(
      { error: 'Error removing from carrito' },
      { status: 500 }
    );
  }
}
