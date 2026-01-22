import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri!);
  try {
    await client.connect();
    const db = client.db();
    // Return password for editing (do not do this in production!)
    const users = await db.collection("users").find({}).toArray();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
