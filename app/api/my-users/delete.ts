import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: "Missing user id" }, { status: 400 });
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    await users.deleteOne({ _id: new (await import("mongodb")).ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
