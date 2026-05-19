import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { UserJSON } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { assignBuyerRoleIfUnassigned, getRolesFromMetadata, hasBuyerAccess } from "@/lib/auth";
import { ensureBuyerRegistration } from "@/lib/buyer-store";
import { prisma } from "@/lib/prisma";

function getPrimaryEmail(user: UserJSON) {
  const primaryEmail = user.email_addresses.find(
    (email) => email.id === user.primary_email_address_id
  );

  return primaryEmail?.email_address ?? user.email_addresses[0]?.email_address ?? null;
}

function getDisplayName(user: UserJSON) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return fullName || user.username || null;
}

function isBuyerAppSignup(user: UserJSON) {
  return user.unsafe_metadata?.sourceApp === "buyer";
}

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

    if (event.type === "user.created" || event.type === "user.updated") {
      const user = event.data as UserJSON;
      let roles = getRolesFromMetadata(user.public_metadata);

      if (roles.length === 0 && isBuyerAppSignup(user)) {
        roles = await assignBuyerRoleIfUnassigned(user.id);
      }

      if (!hasBuyerAccess(roles)) {
        return NextResponse.json({ ok: true, skipped: "El usuario no tiene rol buyer." });
      }

      const email = getPrimaryEmail(user);

      if (!email) {
        return NextResponse.json({ ok: false, message: "El usuario de Clerk no tiene email." }, { status: 202 });
      }

      await ensureBuyerRegistration({
        clerkUserId: user.id,
        email,
        name: getDisplayName(user)
      });
    } else if (event.type === "user.deleted") {
      const userId = event.data.id;

      if (!userId) {
        return NextResponse.json({ ok: false, message: "El evento de Clerk no tiene ID de usuario." }, { status: 202 });
      }

      await prisma.comprador.deleteMany({
        where: { clerk_user_id_comprador: userId }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Clerk webhook verification failed", error);
    return NextResponse.json({ ok: false, message: "Webhook invalido." }, { status: 400 });
  }
}
