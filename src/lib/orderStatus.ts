import type { EstadoEnvio, Pedido } from '@prisma/client';

export type EstadoGeneral =
  | 'Pago Pendiente'
  | 'Pagada'
  | 'En Preparación'
  | 'Despachada'
  | 'Finalizada'
  | 'Cancelada';

export type EstadoPago = 'Pendiente' | 'Aprobado' | 'Rechazado';

export type EstadoEnvioContrato =
  | 'Pendiente'
  | 'En Preparación'
  | 'Despachado'
  | 'Entregado'
  | 'Cancelado';

type PedidoConEstadoEnvio = Pedido & {
  estadoEnvio?: EstadoEnvio | null;
};

const estadoGeneralMap: Record<string, EstadoGeneral> = {
  pendiente: 'Pago Pendiente',
  pendiente_pago: 'Pago Pendiente',
  pagado: 'Pagada',
  pagada: 'Pagada',
  en_preparacion: 'En Preparación',
  enviado: 'Despachada',
  despachada: 'Despachada',
  entregado: 'Finalizada',
  finalizada: 'Finalizada',
  cancelado: 'Cancelada',
  cancelada: 'Cancelada',
};

const estadoEnvioMap: Record<string, EstadoEnvioContrato> = {
  pending: 'Pendiente',
  pendiente: 'Pendiente',
  preparando: 'En Preparación',
  en_preparacion: 'En Preparación',
  en_transito: 'Despachado',
  enviado: 'Despachado',
  despachada: 'Despachado',
  despachado: 'Despachado',
  entregado: 'Entregado',
  finalizada: 'Entregado',
  devuelto: 'Cancelado',
  cancelada: 'Cancelado',
  cancelado: 'Cancelado',
};

export function normalizarEstadoGeneral(estado: string): EstadoGeneral {
  return estadoGeneralMap[estado] || 'Pago Pendiente';
}

export function normalizarEstadoEnvio(estado?: string | null): EstadoEnvioContrato {
  if (!estado) return 'Pendiente';

  return estadoEnvioMap[estado] || 'Pendiente';
}

export function obtenerEstadoPago(estadoGeneral: EstadoGeneral): EstadoPago {
  if (estadoGeneral === 'Pago Pendiente') return 'Pendiente';
  if (estadoGeneral === 'Cancelada') return 'Rechazado';

  return 'Aprobado';
}

export function agregarEstadosContrato<T extends PedidoConEstadoEnvio>(
  pedido: T
) {
  const estadoGeneral = normalizarEstadoGeneral(pedido.estado);
  const estadoEnvio = normalizarEstadoEnvio(pedido.estadoEnvio?.estado);

  return {
    ...pedido,
    estado: estadoGeneral,
    estado_general: estadoGeneral,
    estado_pago: obtenerEstadoPago(estadoGeneral),
    estado_envio: estadoEnvio,
    estadoEnvio: pedido.estadoEnvio
      ? {
          ...pedido.estadoEnvio,
          estado: estadoEnvio,
        }
      : pedido.estadoEnvio,
  };
}

export function crearRespuestaEstadoOrden(pedido: PedidoConEstadoEnvio) {
  const estadoGeneral = normalizarEstadoGeneral(pedido.estado);

  return {
    orden_id: pedido.numeroOrden,
    estado_general: estadoGeneral,
    estado_pago: obtenerEstadoPago(estadoGeneral),
    estado_envio: normalizarEstadoEnvio(pedido.estadoEnvio?.estado),
    fecha_actualizacion: pedido.updatedAt,
  };
}
