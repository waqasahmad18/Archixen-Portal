"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paypalError, setPaypalError] = useState("");
  const [paid, setPaid] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInvoice() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/invoice/${id}`);
        const data = await res.json();
        if (data.success) {
          setInvoice(data.invoice);
          setPaid(data.invoice?.status === "paid");
        } else {
          setError(data.error || "Failed to load invoice.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchInvoice();
    } else {
      setLoading(false);
      setError("Invalid invoice id.");
    }
  }, [id]);

  useEffect(() => {
    async function loadPayPal() {
      if (!invoice || paid) return;
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      if (!clientId) {
        setPaypalError("PayPal client ID missing. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local.");
        return;
      }

      if (window.paypal && paypalRef.current) {
        paypalRef.current.innerHTML = "";
        window.paypal
          .Buttons({
            createOrder: (_data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: invoice.title || "Invoice",
                    amount: {
                      currency_code: "USD",
                      value: Number(invoice.amount || 0).toFixed(2)
                    }
                  }
                ]
              });
            },
            onApprove: async (data: any, actions: any) => {
              await actions.order.capture();
              await fetch("/api/invoice-pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invoiceId: invoice._id, orderId: data.orderID })
              });
              setPaid(true);
            },
            onError: (err: any) => {
              setPaypalError(err?.message || "PayPal error occurred.");
            }
          })
          .render(paypalRef.current);
        return;
      }

      const scriptId = "paypal-sdk";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.async = true;
        script.onload = () => {
          if (window.paypal && paypalRef.current) {
            paypalRef.current.innerHTML = "";
            window.paypal
              .Buttons({
                createOrder: (_data: any, actions: any) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: invoice.title || "Invoice",
                        amount: {
                          currency_code: "USD",
                          value: Number(invoice.amount || 0).toFixed(2)
                        }
                      }
                    ]
                  });
                },
                onApprove: async (data: any, actions: any) => {
                  await actions.order.capture();
                  await fetch("/api/invoice-pay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ invoiceId: invoice._id, orderId: data.orderID })
                  });
                  setPaid(true);
                },
                onError: (err: any) => {
                  setPaypalError(err?.message || "PayPal error occurred.");
                }
              })
              .render(paypalRef.current);
          }
        };
        document.body.appendChild(script);
      }
    }

    loadPayPal();
  }, [invoice, paid]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: 40 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", padding: 48 }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/client" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
            ← Back to Invoices
          </Link>
        </div>

        {loading && <div style={{ color: "#6b7280", textAlign: 'center', padding: 40, fontSize: 16 }}>Loading invoice...</div>}
        {error && <div style={{ color: "#dc2626", background: '#fee2e2', padding: 20, borderRadius: 12, fontSize: 16 }}>{error}</div>}

        {!loading && !error && invoice && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1e40af", marginBottom: 8 }}>
                  {invoice.title || "Invoice"}
                </h1>
                <div style={{ color: "#6b7280", fontSize: 14 }}>
                  {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>STATUS</div>
                <div style={{ fontWeight: 700, padding: '8px 16px', borderRadius: 8, display: 'inline-block', fontSize: 14, background: invoice.status === "paid" ? "#d1fae5" : "#fef3c7", color: invoice.status === "paid" ? "#065f46" : "#92400e" }}>
                  {invoice.status === "paid" ? "✓ Paid" : "Pending Payment"}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
              <div style={{padding: 20, background: '#f9fafb', borderRadius: 12}}>
                <div style={{fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 700}}>BILL TO</div>
                <div style={{fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 4}}>{invoice.clientName || invoice.email}</div>
                <div style={{fontSize: 14, color: '#6b7280'}}>{invoice.email}</div>
              </div>
              <div style={{padding: 20, background: '#f0f9ff', borderRadius: 12, borderLeft: '4px solid #3b82f6'}}>
                <div style={{fontSize: 13, color: '#1e40af', marginBottom: 8, fontWeight: 700}}>AMOUNT DUE</div>
                <div style={{fontSize: 36, fontWeight: 800, color: '#1e40af'}}>${Number(invoice.amount || 0).toFixed(2)}</div>
              </div>
            </div>

            {invoice.description && (
              <div style={{padding: 20, background: '#fafbfc', borderRadius: 12, marginBottom: 32, borderLeft: '4px solid #3b82f6'}}>
                <div style={{fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 700}}>DESCRIPTION</div>
                <div style={{fontSize: 15, color: '#374151', lineHeight: 1.6}}>{invoice.description}</div>
              </div>
            )}

            {invoice.paidAt && (
              <div style={{padding: 16, background: '#d1fae5', borderRadius: 12, marginBottom: 32, color: '#065f46', fontWeight: 600}}>
                ✓ Paid on {new Date(invoice.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}

            {!paid && (
              <>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#1e40af' }}>Complete Payment</h3>
                {paypalError && (
                  <div style={{ color: "#dc2626", background: '#fee2e2', padding: 16, borderRadius: 12, marginBottom: 20 }}>{paypalError}</div>
                )}
                <div ref={paypalRef} style={{minHeight: 400}} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
