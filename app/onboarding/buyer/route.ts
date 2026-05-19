import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { assignBuyerRoleIfUnassigned } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await assignBuyerRoleIfUnassigned(userId);
  redirect("/perfil");
}
