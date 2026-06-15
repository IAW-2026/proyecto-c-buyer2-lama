import { NextResponse } from "next/server";

type ServiceAppName = "payments" | "analytics";

const apiKeyEnvByService: Record<ServiceAppName, string> = {
  payments: "PAYMENTS_API_KEY",
  analytics: "ANALYTICS_API_KEY"
};

export function requireServiceApiKey(request: Request, service: ServiceAppName) {
  const envName = apiKeyEnvByService[service];
  const expectedApiKey = process.env[envName]?.trim();

  if (!expectedApiKey) {
    console.error(`[service-api-key] Falta configurar ${envName}.`);
    return NextResponse.json({ error: "Servicio no configurado." }, { status: 500 });
  }

  const apiKey = request.headers.get("x-api-key")?.trim();

  if (apiKey !== expectedApiKey) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  return null;
}
