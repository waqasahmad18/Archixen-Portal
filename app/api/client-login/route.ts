import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ email, password });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }
    // Don't return password
    const { password: _, ...userData } = user;
    return NextResponse.json({ success: true, user: userData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
