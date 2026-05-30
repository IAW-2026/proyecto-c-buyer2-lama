import { fetchExternalNoContent } from "@/lib/external-app-client";

type CreatePaymentInput = {
  ordenId: string;
  comprador: {
    clerk_user_id_comprador: string;
    nombre: string;
    email: string;
  };
  vendedorId: string;
  montoProducto: number;
  montoEnvio: number;
  montoTotal: number;
};

export async function createPayment(input: CreatePaymentInput) {
  await fetchExternalNoContent("payments", "/api/pagos", {
    method: "POST",
    body: JSON.stringify({
      orden_id: input.ordenId,
      comprador: input.comprador,
      vendedor_id: input.vendedorId,
      monto_producto: input.montoProducto,
      monto_envio: input.montoEnvio,
      monto_total: input.montoTotal
    })
  });
}
