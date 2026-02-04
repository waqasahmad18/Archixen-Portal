import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { userId, email, clientName, invoiceTitle, description, amount } = await req.json();

  if (!invoiceTitle || !description || amount === undefined || amount === null) {
    return NextResponse.json({ success: false, error: "Missing invoice fields" }, { status: 400 });
  }

  if (!email && !userId) {
    return NextResponse.json({ success: false, error: "Missing user identifier" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    let resolvedEmail: string | undefined = email;
    let resolvedUserId: string | undefined = userId;
    let resolvedName: string | undefined = clientName;

    if (!resolvedEmail || !resolvedUserId || !resolvedName) {
      let user: any = null;
      if (resolvedEmail) {
        user = await users.findOne({ email: resolvedEmail });
      } else if (resolvedUserId) {
        try {
          user = await users.findOne({ _id: new ObjectId(resolvedUserId) });
        } catch {
          user = null;
        }
      }

      if (user) {
        if (!resolvedEmail && user.email) resolvedEmail = user.email;
        if (!resolvedName && user.name) resolvedName = user.name;
        if (!resolvedUserId && user._id) resolvedUserId = user._id.toString();
      }
    }

    if (!resolvedEmail) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const invoices = db.collection("invoices");
    await invoices.insertOne({
      userId: resolvedUserId || null,
      email: resolvedEmail,
      clientName: resolvedName || null,
      title: invoiceTitle,
      description,
      amount: Number(amount),
      status: "unpaid",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
