import { NextResponse } from "next/server";
import { paymentMethods } from "@/lib/mock-external";

export async function GET() {
  return NextResponse.json(paymentMethods.filter((method) => method.esta_activo));
}

