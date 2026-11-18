import { NextResponse } from "next/server";
import { generate24HourForecast, DEFAULT_SCENARIOS, ScenarioParams } from "@/lib/forecasting-engine";

export async function GET() {
  const result = generate24HourForecast(DEFAULT_SCENARIOS["summer-normal"]);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ScenarioParams;
    const result = generate24HourForecast(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid scenario parameters provided" },
      { status: 400 }
    );
  }
}
