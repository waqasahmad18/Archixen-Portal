import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { email, userId } = await req.json();

  if (!email && !userId) {
    return NextResponse.json({ success: false, error: "Missing user identifier" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const invoices = db.collection("invoices");

    let filter: any = {};
    if (email && userId) {
      filter = { $or: [{ email }, { userId }] };
    } else if (email) {
      filter = { email };
    } else {
      filter = { userId };
    }

    const results = await invoices.find(filter).sort({ createdAt: -1 }).toArray();
    const serialized = results.map((inv: any) => ({
      ...inv,
      _id: inv._id?.toString?.() || inv._id,
      createdAt: inv.createdAt?.toISOString?.() || inv.createdAt
    }));
    return NextResponse.json({ success: true, invoices: serialized });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
