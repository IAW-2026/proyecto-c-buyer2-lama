import { NextRequest, NextResponse } from 'next/server';
import { listarProductosMock } from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

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

    const { productos: resultados, total } = listarProductosMock({
      search: q,
      categoria,
      talle,
      precioMin,
      precioMax,
      page,
      limit,
    });

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
