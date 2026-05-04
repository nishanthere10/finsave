import { NextRequest, NextResponse } from 'next/server';

// DEPRECATED: Polling has been replaced by synchronous Groq LLM logic in /api/analysis/submit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ error: "Deprecated endpoint. Use /api/analysis/submit directly." }, { status: 404 });
}

