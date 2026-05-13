import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is missing');
  }

  const headersList = await headers();
  const wh = new Webhook(SIGNING_SECRET);

  try {
    const evt = wh.verify(
      await req.text(),
      Object.fromEntries(headersList)
    ) as any;

    if (evt.type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data;

      await prisma.comprador.create({
        data: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address || '',
          nombreComprador: `${first_name || ''} ${last_name || ''}`.trim() || 'Usuario',
        },
      });

      await prisma.preferenciaComprador.create({
        data: {
          compradorId: (await prisma.comprador.findUnique({ where: { clerkUserId: id } }))?.id!,
          tallesPreferidos: [],
          categoriasPreferidas: [],
          vendedoresPreferidos: [],
        },
      });
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return Response.json({ error: 'Webhook error' }, { status: 400 });
  }
}
