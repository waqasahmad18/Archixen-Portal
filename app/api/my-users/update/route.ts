import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  const { id, name, email, password, city, country, street, address2, state, zip } = await req.json();
  if (!id || !name || !email) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, email, password, city, country, street, address2, state, zip } }
    );
    const updated = await users.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
