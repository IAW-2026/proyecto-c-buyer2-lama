import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserToDB } from '@/lib/clerk';
import { crearPedidoSchema } from '@/lib/validation';
import { simularRespuestaEstadoEnvio } from '@/lib/mockData';

export async function GET() {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const pedidos = await prisma.pedido.findMany({
      where: { compradorId: comprador.id },
      include: {
        items: { include: { producto: true } },
        estadoEnvio: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    return NextResponse.json(
      { error: 'Error fetching pedidos' },
      { status: 500 }
    );
  }
}

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
    const validated = crearPedidoSchema.parse(body);

    // Obtener items del carrito
    const itemsCarrito = await prisma.itemCarrito.findMany({
      where: { compradorId: comprador.id },
      include: { producto: true },
    });

    if (itemsCarrito.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Calcular totales
    const montoProducto = itemsCarrito.reduce(
      (sum, item) => sum + item.precioUnitario * item.cantidad,
      0
    );
    const montoEnvio = 15.0; // Envío fijo
    const montoTotal = montoProducto + montoEnvio;

    // Crear pedido
    const numeroOrden = `ORD-${Date.now()}`;
    const pedido = await prisma.pedido.create({
      data: {
        compradorId: comprador.id,
        numeroOrden,
        estado: 'pendiente',
        montoProducto,
        montoEnvio,
        montoTotal,
        metodoPago: validated.metodoPago,
        direccionEnvio: validated.direccionEnvio,
        items: {
          create: itemsCarrito.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),
        },
      },
      include: { items: { include: { producto: true } } },
    });

    // Crear estado de envío simulado
    const estadoEnvioMock = simularRespuestaEstadoEnvio(pedido.id);
    const estadoEnvio = await prisma.estadoEnvio.create({
      data: {
        pedidoId: pedido.id,
        codigoSeguimiento: estadoEnvioMock.codigo_seguimiento,
        empresaLogistica: estadoEnvioMock.empresa_logistica,
        estado: 'preparando',
        historialEstados: JSON.stringify(estadoEnvioMock.historial_estados),
      },
    });

    // Limpiar carrito
    await prisma.itemCarrito.deleteMany({
      where: { compradorId: comprador.id },
    });

    return NextResponse.json(
      { ...pedido, estadoEnvio },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating pedido:', error);
    return NextResponse.json(
      { error: 'Error creating pedido' },
      { status: 500 }
    );
  }
}
