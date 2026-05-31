type CreatePaymentUrlInput = {
  ordenId: string;
};

function getPaymentsAppBaseUrl() {
  const baseUrl = process.env.PAYMENTS_APP_BASE_URL?.trim().replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("Falta configurar PAYMENTS_APP_BASE_URL.");
  }

  return baseUrl;
}

export function createPaymentUrl(input: CreatePaymentUrlInput) {
  return new URL(`/pago/${encodeURIComponent(input.ordenId)}`, `${getPaymentsAppBaseUrl()}/`).toString();
}
