import { prisma } from "@/lib/prisma";
import type { BuyerWithPreferences } from "@/lib/types";
import { adminBuyerUpdateSchema, buyerSchema, preferencesSchema } from "@/lib/validation";

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

export type BuyerStatusFilter = "todos" | "activos" | "inactivos";

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
    direccion_envio: null,
    esta_activo: true,
    fecha_desactivacion: null
  };
}

export async function listBuyers({
  search = "",
  estado = "todos",
  page = 1,
  pageSize = 8
}: {
  search?: string;
  estado?: BuyerStatusFilter | string;
  page?: number;
  pageSize?: number;
}) {
  const normalizedPage = Math.max(page, 1);
  const normalizedPageSize = Math.max(Math.min(pageSize, 25), 1);
  const skip = (normalizedPage - 1) * normalizedPageSize;
  const statusFilter = normalizeBuyerStatusFilter(estado);

  if (shouldUseDatabase()) {
    try {
      const where = {
        ...(statusFilter === "activos" ? { esta_activo: true } : {}),
        ...(statusFilter === "inactivos" ? { esta_activo: false } : {}),
        ...(search
          ? {
              OR: [
                { nombre_comprador: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
                { DNI: { contains: search, mode: "insensitive" as const } }
              ]
            }
          : {})
      };

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
      return listFallbackBuyers(search, statusFilter, normalizedPage, normalizedPageSize);
    }
  }

  return listFallbackBuyers(search, statusFilter, normalizedPage, normalizedPageSize);
}

function normalizeBuyerStatusFilter(value?: string): BuyerStatusFilter {
  if (value === "activos" || value === "inactivos") {
    return value;
  }

  return "todos";
}

function listFallbackBuyers(search: string, estado: BuyerStatusFilter, page: number, pageSize: number) {
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = fallbackBuyers.filter((buyer) => {
    const matchesStatus =
      estado === "activos" ? buyer.esta_activo : estado === "inactivos" ? !buyer.esta_activo : true;
    const matchesSearch = normalizedSearch
      ? [buyer.nombre_comprador, buyer.email, buyer.DNI].some((value) =>
          value !== null && value.toLowerCase().includes(normalizedSearch)
        )
      : true;

    return matchesStatus && matchesSearch;
  });

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
    esta_activo: true,
    fecha_desactivacion: null,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    preferencias: null
  };
  fallbackBuyers.unshift(buyer);
  return buyer;
}

export async function updateBuyerProfile(input: unknown) {
  const data = adminBuyerUpdateSchema.parse(input);

  if (shouldUseDatabase()) {
    const existing = await prisma.comprador.findUnique({
      where: { clerk_user_id_comprador: data.clerk_user_id_comprador }
    });

    if (!existing) {
      throw new Error("Comprador no encontrado.");
    }

    return prisma.comprador.update({
      where: { clerk_user_id_comprador: data.clerk_user_id_comprador },
      data: {
        nombre_comprador: data.nombre_comprador,
        DNI: data.DNI,
        telefono: data.telefono,
        direccion_envio: data.direccion_envio
      },
      include: { preferencias: true }
    });
  }

  const existing = fallbackBuyers.find(
    (buyer) => buyer.clerk_user_id_comprador === data.clerk_user_id_comprador
  );

  if (!existing) {
    throw new Error("Comprador no encontrado.");
  }

  Object.assign(existing, {
    nombre_comprador: data.nombre_comprador,
    DNI: data.DNI,
    telefono: data.telefono,
    direccion_envio: data.direccion_envio,
    fecha_actualizacion: new Date()
  });
  return existing;
}

export async function setBuyerActive(clerkUserId: string, isActive: boolean) {
  if (shouldUseDatabase()) {
    const existing = await prisma.comprador.findUnique({
      where: { clerk_user_id_comprador: clerkUserId }
    });

    if (!existing) {
      throw new Error("Comprador no encontrado.");
    }

    return prisma.comprador.update({
      where: { clerk_user_id_comprador: clerkUserId },
      data: {
        esta_activo: isActive,
        fecha_desactivacion: isActive ? null : new Date()
      },
      include: { preferencias: true }
    });
  }

  const existing = fallbackBuyers.find((buyer) => buyer.clerk_user_id_comprador === clerkUserId);

  if (!existing) {
    throw new Error("Comprador no encontrado.");
  }

  Object.assign(existing, {
    esta_activo: isActive,
    fecha_desactivacion: isActive ? null : new Date(),
    fecha_actualizacion: new Date()
  });
  return existing;
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
  let items: BuyerWithPreferences[];

  if (shouldUseDatabase()) {
    try {
      items = await prisma.comprador.findMany({
        include: { preferencias: true },
        orderBy: { fecha_creacion: "desc" }
      });
    } catch {
      items = fallbackBuyers;
    }
  } else {
    items = fallbackBuyers;
  }

  const lastMonthStart = new Date();
  lastMonthStart.setDate(lastMonthStart.getDate() - 30);

  const categoryCounts = new Map<string, number>();
  const sizeCounts = new Map<string, number>();
  const activeItems = items.filter((buyer) => buyer.esta_activo);

  for (const buyer of activeItems) {
    for (const category of buyer.preferencias?.categorias_preferidas ?? []) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
    for (const size of buyer.preferencias?.talles_preferidos ?? []) {
      sizeCounts.set(size, (sizeCounts.get(size) ?? 0) + 1);
    }
  }

  return {
    totalBuyers: items.length,
    activeBuyers: activeItems.length,
    inactiveBuyers: items.length - activeItems.length,
    buyersLastMonth: items.filter((buyer) => buyer.fecha_creacion >= lastMonthStart).length,
    topCategories: [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
    topSizes: [...sizeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  };
}
