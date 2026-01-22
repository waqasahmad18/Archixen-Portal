import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { name, email, password, street, address2, city, state, zip, country } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    // Check if user already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 });
    }
    await users.insertOne({
      name,
      email,
      password,
      street,
      address2,
      city,
      state,
      zip,
      country
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
