import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function syncUserToDB() {
  const { userId } = await auth();

  if (!userId) return null;

  try {
    // Verificar si el usuario ya existe en la BD
    let comprador = await prisma.comprador.findUnique({
      where: { clerkUserId: userId },
    });

    if (!comprador) {
      // Obtener info del usuario de Clerk
      const user = await currentUser();

      if (!user) return null;

      // Crear nuevo registro de comprador
      comprador = await prisma.comprador.create({
        data: {
          clerkUserId: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          nombreComprador: user.fullName || 'Usuario',
        },
      });

      // Crear preferencias por defecto
      await prisma.preferenciaComprador.create({
        data: {
          compradorId: comprador.id,
          tallesPreferidos: [],
          categoriasPreferidas: [],
          vendedoresPreferidos: [],
        },
      });
    }

    return comprador;
  } catch (error) {
    console.error('Error syncing user to DB:', error);
    return null;
  }
}
