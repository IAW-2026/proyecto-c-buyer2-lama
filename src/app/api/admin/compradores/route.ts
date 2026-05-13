import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { nombreComprador: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [compradores, total] = await Promise.all([
      prisma.comprador.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comprador.count({ where }),
    ]);

    return NextResponse.json({
      compradores,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching compradores:', error);
    return NextResponse.json(
      { error: 'Error fetching compradores' },
      { status: 500 }
    );
  }
}
