import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/security/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, createdAt: true }
  });

  return NextResponse.json({ authenticated: true, user });
}
