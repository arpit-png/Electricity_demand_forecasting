import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, issueSessionToken, setSessionCookie } from "@/lib/security/auth";
import { checkRateLimit } from "@/lib/security/rate-limiter";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().optional()
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const { allowed } = checkRateLimit(ip, 10, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: validated.email } });
    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(validated.password);
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        name: validated.name || "Operative"
      }
    });

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
