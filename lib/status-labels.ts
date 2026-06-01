const statusLabels: Record<string, string> = {
  pendiente_pago: "Pago pendiente",
  "pendiente de pago": "Pago pendiente",
  pagada: "Pagada",
  en_preparacion: "En preparacion",
  "en preparacion": "En preparacion",
  despachada: "Despachada",
  enviada: "Enviada",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  despachado: "Despachado",
  entregado: "Entregado",
  cancelado: "Cancelado",
  pending: "Pendiente",
  in_transit: "En transito",
  delivered: "Entregado",
  returned: "Devuelto"
};

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatStatusLabel(status: string | null | undefined) {
  if (!status) {
    return "-";
  }

  return statusLabels[status] ?? titleCase(status);
}
