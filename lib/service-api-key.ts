import { NextResponse } from "next/server";

type ServiceAppName = "payments" | "analytics" | "control-plane";

const apiKeyEnvByService: Record<ServiceAppName, string> = {
  payments: "PAYMENTS_API_KEY",
  analytics: "ANALYTICS_API_KEY",
  "control-plane": "CONTROL_PLANE_API_KEY"
};

const serviceHeaderNameByService: Record<ServiceAppName, string> = {
  payments: "payments",
  analytics: "analytics",
  "control-plane": "control-plane"
};

export function requireServiceApiKey(request: Request, service: ServiceAppName) {
  return requireAnyServiceApiKey(request, [service]);
}

export function requireAnyServiceApiKey(request: Request, services: ServiceAppName[]) {
  const serviceName = request.headers.get("x-service-name")?.trim().toLowerCase();
  const candidateServices = serviceName
    ? services.filter((service) => serviceHeaderNameByService[service] === serviceName)
    : services;

  if (!candidateServices.length) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const configuredServices = candidateServices
    .map((service) => ({
      service,
      envName: apiKeyEnvByService[service],
      expectedApiKey: process.env[apiKeyEnvByService[service]]?.trim()
    }))
    .filter((config): config is { service: ServiceAppName; envName: string; expectedApiKey: string } =>
      Boolean(config.expectedApiKey)
    );

  if (!configuredServices.length) {
    const missingEnvNames = candidateServices.map((service) => apiKeyEnvByService[service]).join(", ");
    console.error(`[service-api-key] Falta configurar ${missingEnvNames}.`);
    return NextResponse.json({ error: "Servicio no configurado." }, { status: 500 });
  }

  const apiKey = request.headers.get("x-api-key")?.trim();

  if (!configuredServices.some((config) => apiKey === config.expectedApiKey)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  return null;
}
