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
      categoria_id: producto.categoriaId,
      estado_publicacion: producto.estadoPublicacion,
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
