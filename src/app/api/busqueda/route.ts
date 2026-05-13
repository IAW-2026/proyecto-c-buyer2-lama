import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const categoria = searchParams.get('categoria') || '';
    const talle = searchParams.get('talle') || '';
    const precioMin = parseFloat(searchParams.get('precioMin') || '0');
    const precioMax = parseFloat(searchParams.get('precioMax') || '10000');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [],
    };

    if (q) {
      where.AND.push({
        OR: [
          { titulo: { contains: q, mode: 'insensitive' } },
          { descripcion: { contains: q, mode: 'insensitive' } },
          { marca: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    if (categoria) {
      where.AND.push({ categoria });
    }

    if (talle) {
      where.AND.push({ talle });
    }

    where.AND.push({
      precio: {
        gte: precioMin,
        lte: precioMax,
      },
    });

    const [resultados, total] = await Promise.all([
      prisma.producto.findMany({
        where: where.AND.length > 0 ? where : undefined,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.producto.count({
        where: where.AND.length > 0 ? where : undefined,
      }),
    ]);

    return NextResponse.json({
      resultados,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      query: q,
    });
  } catch (error) {
    console.error('Error searching productos:', error);
    return NextResponse.json(
      { error: 'Error searching productos' },
      { status: 500 }
    );
  }
}
