import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const invoices = db.collection("invoices");

    const results = await invoices.find({}).sort({ createdAt: -1 }).toArray();
    const serialized = results.map((inv: any) => ({
      ...inv,
      _id: inv._id?.toString?.() || inv._id,
      createdAt: inv.createdAt?.toISOString?.() || inv.createdAt,
      paidAt: inv.paidAt?.toISOString?.() || inv.paidAt
    }));

    return NextResponse.json({ success: true, invoices: serialized });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
