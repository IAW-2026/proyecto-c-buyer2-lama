import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureCompradorRole } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await ensureCompradorRole(userId);
  redirect("/perfil");
}
