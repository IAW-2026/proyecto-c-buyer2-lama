import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: params.id },
    });

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      producto_id: producto.id,
      vendedor_id: producto.vendedorId,
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagenes: [producto.imagenUrl],
      estado_prenda: producto.estado,
      talle: producto.talle,
      marca: producto.marca,
      stock: producto.stock,
      categoria_id: producto.categoria,
      estado_publicacion: 'activa',
      fecha_creacion: producto.createdAt,
    });
  } catch (error) {
    console.error('Error fetching seller producto:', error);
    return NextResponse.json(
      { error: 'Error fetching producto' },
      { status: 500 }
    );
  }
}
