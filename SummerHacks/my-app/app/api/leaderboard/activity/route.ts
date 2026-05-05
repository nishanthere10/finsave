import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8001";

export async function GET(req: Request) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "4";
    
    // Forward the GET request to FastAPI backend with the Clerk JWT
    const res = await fetch(`${BACKEND_URL}/api/leaderboard/activity?limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // Important cache behavior for dynamic routes
        cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Leaderboard Activity Proxy] Error:", error.message);
    // Return empty array on error so UI doesn't crash completely
    return NextResponse.json([], { status: 500 });
  }
}
