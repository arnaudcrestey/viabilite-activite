import { NextResponse } from "next/server";
import { buildDiagnostic, type DiagnosticPayload } from "@/lib/diagnostic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as DiagnosticPayload;

    if (!payload?.answers || typeof payload.freeText !== "string") {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }

    const result = buildDiagnostic(payload);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Erreur lors du diagnostic." }, { status: 500 });
  }
}
