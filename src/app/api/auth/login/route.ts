import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword, issueSessionToken, setSessionCookie } from "@/lib/security/auth";
import { checkRateLimit } from "@/lib/security/rate-limiter";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const { allowed } = checkRateLimit(ip, 10, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Cooldown active." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validated = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: validated.email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(validated.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await issueSessionToken({ userId: user.id, email: user.email });
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
