type ExternalAppName = "seller" | "shipping" | "payments" | "control-plane";

const baseUrlEnvByApp: Record<ExternalAppName, string> = {
  seller: "SELLER_APP_BASE_URL",
  shipping: "SHIPPING_APP_BASE_URL",
  payments: "PAYMENTS_APP_BASE_URL",
  "control-plane": "CONTROL_PLANE_BASE_URL"
};

const apiKeyEnvByApp: Record<ExternalAppName, string> = {
  seller: "BUYER_API_KEY",
  shipping: "SHIPPING_API_KEY",
  payments: "PAYMENTS_API_KEY",
  "control-plane": "BUYER_API_KEY"
};

const serviceNameByApp: Partial<Record<ExternalAppName, string>> = {
  seller: "buyer",
  "control-plane": "buyer"
};

export class ExternalApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string
  ) {
    super(message);
  }
}

function getExternalAppBaseUrl(app: ExternalAppName) {
  const envName = baseUrlEnvByApp[app];
  const baseUrl = process.env[envName]?.trim().replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error(`Falta configurar ${envName}.`);
  }

  return baseUrl;
}

function getExternalAppApiKey(app: ExternalAppName) {
  const envName = apiKeyEnvByApp[app];
  const apiKey = process.env[envName]?.trim();

  if (!apiKey) {
    throw new Error(`Falta configurar ${envName}.`);
  }

  return apiKey;
}

function buildExternalUrl(app: ExternalAppName, path: string) {
  return new URL(path.replace(/^\//, ""), `${getExternalAppBaseUrl(app)}/`).toString();
}

function buildExternalHeaders(app: ExternalAppName, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const serviceName = serviceNameByApp[app];
  if (serviceName) {
    headers.set("x-service-name", serviceName);
  }

  headers.set("x-api-key", getExternalAppApiKey(app));

  return headers;
}

async function readResponseBody(response: Response) {
  return response.text().catch(() => "");
}

export async function fetchExternalJson<T>(
  app: ExternalAppName,
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(buildExternalUrl(app, path), {
    ...init,
    cache: "no-store",
    headers: buildExternalHeaders(app, init)
  });

  if (!response.ok) {
    const body = await readResponseBody(response);
    throw new ExternalApiError(`Error al consumir ${app}:${path}`, response.status, body);
  }

  const body = await readResponseBody(response);
  return (body ? JSON.parse(body) : null) as T;
}

export async function fetchExternalNoContent(
  app: ExternalAppName,
  path: string,
  init?: RequestInit
) {
  const response = await fetch(buildExternalUrl(app, path), {
    ...init,
    cache: "no-store",
    headers: buildExternalHeaders(app, init)
  });

  if (!response.ok) {
    const body = await readResponseBody(response);
    throw new ExternalApiError(`Error al consumir ${app}:${path}`, response.status, body);
  }
}
