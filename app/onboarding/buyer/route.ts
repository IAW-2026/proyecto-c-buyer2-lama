import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureCompradorRole, SUPER_ADMIN_ROLE } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const roles = await ensureCompradorRole(userId);

  if (roles.includes(SUPER_ADMIN_ROLE)) {
    redirect("/admin");
  }

  redirect("/perfil");
}
