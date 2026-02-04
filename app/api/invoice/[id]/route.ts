import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id?: string } }) {
  let id = params?.id;
  if (!id) {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    id = parts[parts.length - 1];
  }
  if (!id || id === "invoice") {
    return NextResponse.json({ success: false, error: "Missing invoice id" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const invoices = db.collection("invoices");
    const invoice = await invoices.findOne({ _id: new ObjectId(id) });

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    const serialized = {
      ...invoice,
      _id: invoice._id?.toString?.() || invoice._id,
      createdAt: invoice.createdAt?.toISOString?.() || invoice.createdAt,
      paidAt: invoice.paidAt?.toISOString?.() || invoice.paidAt
    };

    return NextResponse.json({ success: true, invoice: serialized });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
