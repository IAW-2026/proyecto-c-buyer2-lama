import { NextResponse } from 'next/server';
import { syncUserToDB } from '@/lib/clerk';
import { compradorSchema } from '@/lib/validation';

export async function GET() {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    return NextResponse.json(comprador);
  } catch (error) {
    console.error('Error fetching perfil:', error);
    return NextResponse.json(
      { error: 'Error fetching perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const comprador = await syncUserToDB();

    if (!comprador) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = compradorSchema.parse(body);

    const updated = await (await import('@/lib/prisma')).prisma.comprador.update({
      where: { id: comprador.id },
      data: {
        nombreComprador: validated.nombreComprador,
        email: validated.email,
        dni: validated.dni,
        telefono: validated.telefono,
        direccionEnvio: validated.direccionEnvio,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating perfil:', error);
    return NextResponse.json(
      { error: 'Error updating perfil' },
      { status: 500 }
    );
  }
}
