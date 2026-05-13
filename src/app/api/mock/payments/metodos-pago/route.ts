import { NextResponse } from 'next/server';
import { simularRespuestaMetodosPago } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(simularRespuestaMetodosPago());
}
