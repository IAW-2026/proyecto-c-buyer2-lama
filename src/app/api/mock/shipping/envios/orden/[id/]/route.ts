import { NextRequest, NextResponse } from 'next/server';
import { simularRespuestaEstadoEnvio } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const envio = simularRespuestaEstadoEnvio(params.id);

    return NextResponse.json(envio);
  } catch (error) {
    console.error('Error fetching shipping estado:', error);
    return NextResponse.json(
      { error: 'Error fetching envio' },
      { status: 500 }
    );
  }
}
