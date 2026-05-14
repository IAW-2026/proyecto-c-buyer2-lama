import { NextResponse } from 'next/server';
import { syncUserToDB } from '@/lib/clerk';
import { prisma } from '@/lib/prisma';
import {
  listarProductosMock,
  type ProductoMock,
} from '@/lib/mockExternalServices';

export const dynamic = 'force-dynamic';

const MAX_RECOMENDADOS = 6;

function calcularScore(
  producto: ProductoMock,
  preferencias: {
    tallesPreferidos: string[];
    categoriasPreferidas: string[];
    vendedoresPreferidos: string[];
  }
) {
  let score = 0;

  if (preferencias.tallesPreferidos.includes(producto.talle)) score += 1;
  if (preferencias.categoriasPreferidas.includes(producto.categoria)) score += 1;
  if (preferencias.vendedoresPreferidos.includes(producto.vendedorId)) score += 1;

  return score;
}

export async function GET() {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const preferencias = await prisma.preferenciaComprador.findUnique({
      where: { compradorId: comprador.id },
    });

    if (!preferencias) {
      return NextResponse.json({ productos: [], hasPreferences: false });
    }

    const tallesPreferidos = preferencias.tallesPreferidos || [];
    const categoriasPreferidas = preferencias.categoriasPreferidas || [];
    const vendedoresPreferidos = preferencias.vendedoresPreferidos || [];
    const hasPreferences =
      tallesPreferidos.length > 0 ||
      categoriasPreferidas.length > 0 ||
      vendedoresPreferidos.length > 0;

    if (!hasPreferences) {
      return NextResponse.json({ productos: [], hasPreferences: false });
    }

    const { productos } = listarProductosMock({ limit: 100 });
    const productosFiltrados = productos.filter(
      (producto) =>
        producto.stock > 0 &&
        (tallesPreferidos.includes(producto.talle) ||
          categoriasPreferidas.includes(producto.categoria) ||
          vendedoresPreferidos.includes(producto.vendedorId))
    );

    const productosOrdenados = productosFiltrados
      .map((producto) => ({
        producto,
        score: calcularScore(producto, {
          tallesPreferidos,
          categoriasPreferidas,
          vendedoresPreferidos,
        }),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.producto.createdAt.getTime() - a.producto.createdAt.getTime();
      })
      .slice(0, MAX_RECOMENDADOS)
      .map(({ producto }) => producto);

    return NextResponse.json({
      productos: productosOrdenados,
      hasPreferences: true,
    });
  } catch (error) {
    console.error('Error fetching recomendados:', error);
    return NextResponse.json(
      { error: 'Error fetching recomendados' },
      { status: 500 }
    );
  }
}
