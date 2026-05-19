import { prisma } from "@/lib/prisma";
import type { BuyerWithPreferences } from "@/lib/types";
import { buyerSchema, preferencesSchema } from "@/lib/validation";

type ClerkBuyerRegistration = {
  clerkUserId: string;
  email: string;
  name: string | null;
};

const globalForBuyerStore = globalThis as unknown as {
  fallbackBuyers?: BuyerWithPreferences[];
};

const fallbackBuyers = globalForBuyerStore.fallbackBuyers ?? [];
globalForBuyerStore.fallbackBuyers = fallbackBuyers;

function shouldUseDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function fallbackName(email: string) {
  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return localPart && localPart.length >= 3 ? localPart : "Usuario lama";
}

function pendingBuyerData({ clerkUserId, email, name }: ClerkBuyerRegistration) {
  return {
    clerk_user_id_comprador: clerkUserId,
    email: normalizeEmail(email),
    nombre_comprador: name?.trim() || fallbackName(email),
    DNI: null,
    telefono: null,
    direccion_envio: null
  };
}

export async function listBuyers({
  search = "",
  page = 1,
  pageSize = 8
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const normalizedPage = Math.max(page, 1);
  const normalizedPageSize = Math.max(Math.min(pageSize, 25), 1);
  const skip = (normalizedPage - 1) * normalizedPageSize;

  if (shouldUseDatabase()) {
    try {
      const where = search
        ? {
            OR: [
              { nombre_comprador: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { DNI: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : {};

      const [items, total] = await Promise.all([
        prisma.comprador.findMany({
          where,
          include: { preferencias: true },
          orderBy: { fecha_creacion: "desc" },
          skip,
          take: normalizedPageSize
        }),
        prisma.comprador.count({ where })
      ]);

      return { items, total, page: normalizedPage, pageSize: normalizedPageSize };
    } catch {
      return listFallbackBuyers(search, normalizedPage, normalizedPageSize);
    }
  }

  return listFallbackBuyers(search, normalizedPage, normalizedPageSize);
}

function listFallbackBuyers(search: string, page: number, pageSize: number) {
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = normalizedSearch
    ? fallbackBuyers.filter((buyer) =>
        [buyer.nombre_comprador, buyer.email, buyer.DNI].some((value) =>
          value !== null && value.toLowerCase().includes(normalizedSearch)
        )
      )
    : fallbackBuyers;

  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize
  };
}

export async function getBuyer(clerkUserId: string) {
  if (shouldUseDatabase()) {
    try {
      return await prisma.comprador.findUnique({
        where: { clerk_user_id_comprador: clerkUserId },
        include: { preferencias: true }
      });
    } catch {
      return fallbackBuyers.find((buyer) => buyer.clerk_user_id_comprador === clerkUserId) ?? null;
    }
  }

  return fallbackBuyers.find((buyer) => buyer.clerk_user_id_comprador === clerkUserId) ?? null;
}

export async function getBuyerByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (shouldUseDatabase()) {
    try {
      return await prisma.comprador.findUnique({
        where: { email: normalizedEmail },
        include: { preferencias: true }
      });
    } catch {
      return fallbackBuyers.find((buyer) => buyer.email.toLowerCase() === normalizedEmail) ?? null;
    }
  }

  return fallbackBuyers.find((buyer) => buyer.email.toLowerCase() === normalizedEmail) ?? null;
}

export async function ensureBuyerRegistration(input: ClerkBuyerRegistration) {
  const data = pendingBuyerData(input);

  if (shouldUseDatabase()) {
    const updateExistingBuyer = (existing: BuyerWithPreferences) =>
      prisma.comprador.update({
        where: { clerk_user_id_comprador: existing.clerk_user_id_comprador },
        data: {
          email: data.email,
          nombre_comprador:
            existing.nombre_comprador === "Usuario lama" ||
            existing.nombre_comprador === fallbackName(existing.email)
              ? data.nombre_comprador
              : existing.nombre_comprador
        },
        include: { preferencias: true }
      });

    const existingById = await prisma.comprador.findUnique({
      where: { clerk_user_id_comprador: data.clerk_user_id_comprador },
      include: { preferencias: true }
    });

    if (existingById) {
      return updateExistingBuyer(existingById);
    }

    const existingByEmail = await prisma.comprador.findUnique({
      where: { email: data.email },
      include: { preferencias: true }
    });

    if (existingByEmail) {
      return prisma.comprador.update({
        where: { email: data.email },
        data: {
          clerk_user_id_comprador: data.clerk_user_id_comprador,
          nombre_comprador:
            existingByEmail.nombre_comprador === "Usuario lama" ||
            existingByEmail.nombre_comprador === fallbackName(existingByEmail.email)
              ? data.nombre_comprador
              : existingByEmail.nombre_comprador
        },
        include: { preferencias: true }
      });
    }

    await prisma.comprador.createMany({
      data: [data],
      skipDuplicates: true
    });

    const createdOrExisting = await prisma.comprador.findUnique({
      where: { clerk_user_id_comprador: data.clerk_user_id_comprador },
      include: { preferencias: true }
    });

    if (createdOrExisting) {
      return updateExistingBuyer(createdOrExisting);
    }

    const existingEmailAfterInsert = await prisma.comprador.findUnique({
      where: { email: data.email },
      include: { preferencias: true }
    });

    if (existingEmailAfterInsert) {
      return prisma.comprador.update({
        where: { email: data.email },
        data: {
          clerk_user_id_comprador: data.clerk_user_id_comprador,
          nombre_comprador:
            existingEmailAfterInsert.nombre_comprador === "Usuario lama" ||
            existingEmailAfterInsert.nombre_comprador === fallbackName(existingEmailAfterInsert.email)
              ? data.nombre_comprador
              : existingEmailAfterInsert.nombre_comprador
        },
        include: { preferencias: true }
      });
    }

    throw new Error("No pudimos sincronizar el comprador desde Clerk.");
  }

  const existing = fallbackBuyers.find(
    (buyer) =>
      buyer.clerk_user_id_comprador === data.clerk_user_id_comprador ||
      buyer.email.toLowerCase() === data.email
  );

  if (existing) {
    Object.assign(existing, {
      clerk_user_id_comprador: data.clerk_user_id_comprador,
      email: data.email,
      nombre_comprador:
        existing.nombre_comprador === "Usuario lama" || existing.nombre_comprador === fallbackName(existing.email)
          ? data.nombre_comprador
          : existing.nombre_comprador,
      fecha_actualizacion: new Date()
    });
    return existing;
  }

  const buyer: BuyerWithPreferences = {
    ...data,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    preferencias: null
  };
  fallbackBuyers.unshift(buyer);
  return buyer;
}

export async function upsertBuyer(input: unknown) {
  const data = buyerSchema.parse(input);

  if (shouldUseDatabase()) {
    return prisma.comprador.upsert({
      where: { clerk_user_id_comprador: data.clerk_user_id_comprador },
      update: {
        email: data.email,
        nombre_comprador: data.nombre_comprador,
        DNI: data.DNI ?? null,
        telefono: data.telefono ?? null,
        direccion_envio: data.direccion_envio ?? null
      },
      create: {
        ...data,
        telefono: data.telefono ?? null
      }
    });
  }

  const existing = fallbackBuyers.find(
    (buyer) => buyer.clerk_user_id_comprador === data.clerk_user_id_comprador
  );

  if (existing) {
    Object.assign(existing, {
      ...data,
      telefono: data.telefono ?? null,
      fecha_actualizacion: new Date()
    });
    return existing;
  }

  const buyer: BuyerWithPreferences = {
    ...data,
    telefono: data.telefono ?? null,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    preferencias: null
  };
  fallbackBuyers.unshift(buyer);
  return buyer;
}

export async function upsertPreferences(input: unknown) {
  const data = preferencesSchema.parse(input);

  if (shouldUseDatabase()) {
    return prisma.preferencias_comprador.upsert({
      where: { clerk_user_id_comprador: data.clerk_user_id_comprador },
      update: {
        talles_preferidos: data.talles_preferidos,
        categorias_preferidas: data.categorias_preferidas,
        vendedores_preferidos: data.vendedores_preferidos
      },
      create: data
    });
  }

  const buyer = fallbackBuyers.find(
    (item) => item.clerk_user_id_comprador === data.clerk_user_id_comprador
  );
  if (!buyer) {
    throw new Error("Comprador no encontrado.");
  }

  buyer.preferencias = {
    preferencia_id: buyer.preferencias?.preferencia_id ?? `pref_${Date.now()}`,
    ...data
  };
  buyer.fecha_actualizacion = new Date();
  return buyer.preferencias;
}

export async function getBuyerReport() {
  const { items } = await listBuyers({ pageSize: 25 });
  const categoryCounts = new Map<string, number>();
  const sizeCounts = new Map<string, number>();

  for (const buyer of items) {
    for (const category of buyer.preferencias?.categorias_preferidas ?? []) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
    for (const size of buyer.preferencias?.talles_preferidos ?? []) {
      sizeCounts.set(size, (sizeCounts.get(size) ?? 0) + 1);
    }
  }

  return {
    totalBuyers: items.length,
    topCategories: [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4),
    topSizes: [...sizeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  };
}
