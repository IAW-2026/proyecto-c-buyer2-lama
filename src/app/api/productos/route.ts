import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    const talle = searchParams.get('talle') || '';
    const precioMin = parseFloat(searchParams.get('precioMin') || '0');
    const precioMax = parseFloat(searchParams.get('precioMax') || '10000');

    const skip = (page - 1) * limit;

    const conditions: Prisma.ProductoWhereInput[] = [];

    if (search) {
      conditions.push({
        OR: [
          { titulo: { contains: search, mode: 'insensitive' } },
          { descripcion: { contains: search, mode: 'insensitive' } },
          { marca: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (categoria) {
      conditions.push({ categoria });
    }

    if (talle) {
      conditions.push({ talle });
    }

    conditions.push({
      precio: {
        gte: precioMin,
        lte: precioMax,
      },
    });

    const where: Prisma.ProductoWhereInput | undefined =
      conditions.length > 0 ? { AND: conditions } : undefined;

    const [productos, total, categorias, talles] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.producto.count({
        where,
      }),
      prisma.producto.findMany({
        select: { categoria: true },
        distinct: ['categoria'],
        orderBy: { categoria: 'asc' },
      }),
      prisma.producto.findMany({
        select: { talle: true },
        distinct: ['talle'],
        orderBy: { talle: 'asc' },
      }),
    ]);

    return NextResponse.json({
      productos,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      categorias: categorias.map((producto) => producto.categoria),
      talles: talles.map((producto) => producto.talle),
    });
  } catch (error) {
    console.error('Error fetching productos:', error);
    return NextResponse.json(
      { error: 'Error fetching productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, descripcion, precio, imagenUrl, categoria, talle, marca, estado, stock, vendedorId } = body;

    if (!titulo || !precio || !categoria || !talle || !marca) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const producto = await prisma.producto.create({
      data: {
        titulo,
        descripcion: descripcion || '',
        precio: parseFloat(precio),
        imagenUrl: imagenUrl || '',
        categoria,
        talle,
        marca,
        estado: estado || 'buen estado',
        stock: stock || 1,
        vendedorId: vendedorId || 'admin',
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error('Error creating producto:', error);
    return NextResponse.json(
      { error: 'Error creating producto' },
      { status: 500 }
    );
  }
}
