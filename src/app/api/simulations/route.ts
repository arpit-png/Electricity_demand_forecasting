import { NextResponse } from "next/server";
import { getSimulations, saveSimulation } from "@/lib/firebase";

export async function GET() {
  const result = await getSimulations();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveSimulation(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to persist simulation record" },
      { status: 500 }
    );
  }
}
