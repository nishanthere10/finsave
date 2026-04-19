import { NextRequest, NextResponse } from 'next/server';

// Mock: instantly return a payload_id so the dashboard starts polling
export async function POST(request: NextRequest) {
  const payload_id = `mock_${Date.now()}`;
  return NextResponse.json({ payload_id }, { status: 200 });
}
