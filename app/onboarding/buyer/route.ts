import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureBuyerRole } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await ensureBuyerRole(userId);
  redirect("/perfil");
}
