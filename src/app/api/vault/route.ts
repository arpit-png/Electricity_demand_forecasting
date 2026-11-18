import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getAuthenticatedSession } from "@/lib/security/auth";
import { encryptAES256GCM, decryptAES256GCM } from "@/lib/security/crypto";

const CreateVaultItemSchema = z.object({
  title: z.string().min(1).max(100),
  sensitiveContent: z.string().min(1).max(5000)
});

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const items = await prisma.vaultItem.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" }
  });

  const decryptedItems = items.map((item) => {
    try {
      const plaintext = decryptAES256GCM({
        ciphertext: item.encryptedData,
        iv: item.iv,
        authTag: item.authTag
      });
      return {
        id: item.id,
        title: item.title,
        content: plaintext,
        createdAt: item.createdAt
      };
    } catch {
      return {
        id: item.id,
        title: item.title,
        content: "[CIPHERTEXT_CORRUPTED_OR_TAMPERED]",
        createdAt: item.createdAt
      };
    }
  });

  return NextResponse.json({ items: decryptedItems });
}

export async function POST(req: Request) {
  const session = await getAuthenticatedSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, sensitiveContent } = CreateVaultItemSchema.parse(body);

    const { ciphertext, iv, authTag } = encryptAES256GCM(sensitiveContent);

    const item = await prisma.vaultItem.create({
      data: {
        title,
        encryptedData: ciphertext,
        iv,
        authTag,
        userId: session.userId
      }
    });

    return NextResponse.json({
      success: true,
      item: { id: item.id, title: item.title, createdAt: item.createdAt }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to encrypt and store data" }, { status: 500 });
  }
}
