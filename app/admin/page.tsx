"use client";
import { useState } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
const MyUsersPage = dynamic(() => import("./my-users/page"), { ssr: false });

const sidebarTabs = [
  { key: "create-user", label: "Create User" },
  { key: "new-invoice", label: "New Invoice" },
  { key: "my-invoices", label: "My Invoices" },
  { key: "my-users", label: "My Users" },
];

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("new-invoice");
  // Invoice form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSendInvoice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setMessage("");
    try {
      const subject = `Invoice: ${invoiceTitle}`;
      const html = `<h2>Dear ${clientName},</h2><p>You have a new invoice from Archixen.</p><p><strong>Title:</strong> ${invoiceTitle}</p><p><strong>Description:</strong> ${description}</p><p><strong>Amount:</strong> $${amount}</p><p>Please pay your invoice at your earliest convenience.</p>`;
      const res = await fetch("/api/send-invoice-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: clientEmail,
          subject,
          html
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Invoice email sent successfully!");
        setClientName(""); setClientEmail(""); setInvoiceTitle(""); setDescription(""); setAmount("");
      } else {
        setMessage("Failed to send email: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Sidebar */}
      <aside style={{
        width: 250,
        background: "#fff",
        boxShadow: "2px 0 16px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 0 0 0"
      }}>
        <Image src="/Logo-Variation-13.png" alt="Archixen Logo" width={120} height={60} style={{ marginBottom: 32 }} />
        <nav style={{ width: "100%" }}>
          {sidebarTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                width: "100%",
                padding: "16px 0",
                background: activeTab === tab.key ? "#0070f3" : "transparent",
                color: activeTab === tab.key ? "#fff" : "#222",
                border: "none",
                fontWeight: 600,
                fontSize: 17,
                cursor: "pointer",
                transition: "background 0.2s",
                outline: "none"
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 48 }}>
        {activeTab === "new-invoice" && (
          <div style={{ maxWidth: 520, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", padding: 36 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#222' }}>Create New Invoice</h2>
            {/* Invoice Form Placeholder */}
            <form onSubmit={handleSendInvoice}>
              <input
                type="text"
                placeholder="Client Name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
              <input
                type="email"
                placeholder="Client Email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
              <input
                type="text"
                placeholder="Invoice Title"
                value={invoiceTitle}
                onChange={e => setInvoiceTitle(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, minHeight: 80 }}
              />
              <input
                type="number"
                placeholder="Amount (USD)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 24, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              />
              <button
                type="submit"
                disabled={sending}
                style={{ width: '100%', padding: 14, borderRadius: 8, background: sending ? '#aaa' : '#0070f3', color: '#fff', border: 'none', fontWeight: 700, fontSize: 18, letterSpacing: 1, cursor: sending ? 'not-allowed' : 'pointer' }}
              >
                {sending ? 'Sending...' : 'Send Invoice'}
              </button>
              {message && <div style={{marginTop: 18, color: message.includes('success') ? 'green' : 'red', fontWeight: 500}}>{message}</div>}
            </form>
          </div>
        )}
        {activeTab === "my-invoices" && (
          <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", padding: 36 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#222' }}>My Invoices</h2>
            {/* Invoices Table Placeholder */}
            <div style={{ color: '#888', textAlign: 'center', fontSize: 18, padding: 40 }}>
              No invoices yet.
            </div>
          </div>
        )}
        {activeTab === "create-user" && (
          <iframe src="/admin/create-user" style={{width:'100%',height:600,border:'none',borderRadius:16,background:'#fff',boxShadow:'0 2px 16px rgba(0,0,0,0.07)',margin:'0 auto',display:'block'}} title="Create User" />
        )}
        {activeTab === "my-users" && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <MyUsersPage />
          </div>
        )}
      </main>
    </div>
  );
}
