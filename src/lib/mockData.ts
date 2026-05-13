export const metodoPagosMock = [
  {
    metodo_pago_id: 'mp_1',
    metodo_pago: 'Tarjeta de Crédito',
    descripcion: 'Visa, Mastercard, American Express',
    esta_activo: true,
  },
  {
    metodo_pago_id: 'mp_2',
    metodo_pago: 'Mercado Pago',
    descripcion: 'Billetera virtual Mercado Pago',
    esta_activo: true,
  },
  {
    metodo_pago_id: 'mp_3',
    metodo_pago: 'Transferencia Bancaria',
    descripcion: 'Transferencia bancaria directa',
    esta_activo: true,
  },
];

export const empresasLogisticasMock = ['DHL', 'FedEx', 'OCA', 'Correo Argentino', 'Andreani'];

export const estadosEnvioMock = ['preparando', 'en_transito', 'entregado', 'devuelto'];

export function generarCodigoSeguimiento(): string {
  return 'TRK' + Math.random().toString(36).substring(2, 15).toUpperCase();
}

export function simularRespuestaMetodosPago() {
  return metodoPagosMock;
}

export function simularRespuestaEstadoEnvio(ordenId: string) {
  return {
    envio_id: 'env_' + Math.random().toString(36).substring(7),
    orden_id: ordenId,
    codigo_seguimiento: generarCodigoSeguimiento(),
    empresa_logistica: empresasLogisticasMock[Math.floor(Math.random() * empresasLogisticasMock.length)],
    estado: estadosEnvioMock[Math.floor(Math.random() * estadosEnvioMock.length)],
    historial_estados: [
      {
        estado: 'preparando',
        fecha: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        estado: 'en_transito',
        fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };
}

export function simularRespuestaPago(ordenId: string, monto: number) {
  return {
    pago_id: 'pag_' + Math.random().toString(36).substring(7),
    orden_id: ordenId,
    monto_total: monto,
    metodo_pago_id: 'mp_1',
    estado: 'completado',
    fecha_creacion: new Date().toISOString(),
  };
}
