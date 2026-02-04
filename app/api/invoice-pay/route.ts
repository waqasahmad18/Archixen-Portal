import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { invoiceId, orderId } = await req.json();

  if (!invoiceId) {
    return NextResponse.json({ success: false, error: "Missing invoiceId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const invoices = db.collection("invoices");

    const result = await invoices.updateOne(
      { _id: new ObjectId(invoiceId) },
      {
        $set: {
          status: "paid",
          paidAt: new Date(),
          paypalOrderId: orderId || null
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
