"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
const MyUsersPage = dynamic(() => import("./my-users/page"), { ssr: false });
const CreateUserPage = dynamic(() => import("./create-user/page"), { ssr: false });

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
  const [adminInvoices, setAdminInvoices] = useState<any[]>([]);
  const [adminInvoiceLoading, setAdminInvoiceLoading] = useState(false);
  const [adminInvoiceError, setAdminInvoiceError] = useState("");

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
        const saveRes = await fetch("/api/create-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: clientEmail,
            clientName,
            invoiceTitle,
            description,
            amount
          })
        });
        const saveData = await saveRes.json();
        if (saveData.success) {
          setMessage("Invoice email sent and saved successfully!");
          setClientName(""); setClientEmail(""); setInvoiceTitle(""); setDescription(""); setAmount("");
        } else {
          setMessage("Email sent, but failed to save invoice: " + (saveData.error || "Unknown error"));
        }
      } else {
        setMessage("Failed to send email: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setSending(false);
    }
  }

  async function fetchAdminInvoices() {
    setAdminInvoiceLoading(true);
    setAdminInvoiceError("");
    try {
      const res = await fetch("/api/admin-invoices");
      const data = await res.json();
      if (data.success) {
        setAdminInvoices(data.invoices || []);
      } else {
        setAdminInvoiceError(data.error || "Failed to load invoices.");
      }
    } catch (err: any) {
      setAdminInvoiceError(err.message || "Failed to load invoices.");
    } finally {
      setAdminInvoiceLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "my-invoices") {
      fetchAdminInvoices();
    }
  }, [activeTab]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 280,
        background: "#fff",
        boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        padding: "40px 0"
      }}>
        <div style={{textAlign: 'center', marginBottom: 40, paddingLeft: 16, paddingRight: 16}}>
          <div style={{fontWeight: 800, fontSize: 26, color: '#1e40af', letterSpacing: 1}}>Archixen</div>
          <div style={{fontSize: 13, color: '#6b7280', marginTop: 6}}>Admin Panel</div>
        </div>
        <nav style={{ width: "100%", display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sidebarTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                width: "calc(100% - 24px)",
                padding: "14px 20px",
                background: activeTab === tab.key ? "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" : "transparent",
                color: activeTab === tab.key ? "#fff" : "#4b5563",
                border: "none",
                fontWeight: activeTab === tab.key ? 700 : 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.3s",
                outline: "none",
                borderRadius: 8,
                margin: '0 12px'
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
          <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: '#1e40af' }}>Create New Invoice</h2>
            <form onSubmit={handleSendInvoice}>
              <input
                type="text"
                placeholder="Client Name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, background: '#fafbfc' }}
              />
              <input
                type="email"
                placeholder="Client Email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, background: '#fafbfc' }}
              />
              <input
                type="text"
                placeholder="Invoice Title"
                value={invoiceTitle}
                onChange={e => setInvoiceTitle(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, background: '#fafbfc' }}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, minHeight: 100, background: '#fafbfc', resize: 'none' }}
              />
              <input
                type="number"
                placeholder="Amount (USD)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                style={{ width: '100%', padding: 12, marginBottom: 24, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, background: '#fafbfc' }}
              />
              <button
                type="submit"
                disabled={sending}
                style={{ width: '100%', padding: 14, borderRadius: 8, background: sending ? '#9ca3af' : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, letterSpacing: 0.5, cursor: sending ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}
              >
                {sending ? 'Sending...' : 'Send Invoice'}
              </button>
              {message && <div style={{marginTop: 18, padding: 12, color: message.includes('success') ? '#065f46' : '#dc2626', background: message.includes('success') ? '#d1fae5' : '#fee2e2', fontWeight: 600, borderRadius: 8, textAlign: 'center'}}>{message}</div>}
            </form>
          </div>
        )}
        {activeTab === "my-invoices" && (
          <div style={{ maxWidth: 1000, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1e40af' }}>My Invoices</h2>
              <button
                onClick={fetchAdminInvoices}
                style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, color: '#1e40af', transition: 'all 0.3s' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f0f9ff';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                ↻ Refresh
              </button>
            </div>

            {adminInvoiceLoading && (
              <div style={{ color: '#6b7280', textAlign: 'center', fontSize: 16, padding: 60 }}>
                Loading invoices...
              </div>
            )}
            {!adminInvoiceLoading && adminInvoiceError && (
              <div style={{ color: '#dc2626', background: '#fee2e2', textAlign: 'center', fontSize: 16, padding: 20, borderRadius: 12 }}>
                {adminInvoiceError}
              </div>
            )}
            {!adminInvoiceLoading && !adminInvoiceError && adminInvoices.length === 0 && (
              <div style={{ color: '#6b7280', textAlign: 'center', fontSize: 16, padding: 60, background: '#f9fafb', borderRadius: 12 }}>
                No invoices yet.
              </div>
            )}
            {!adminInvoiceLoading && !adminInvoiceError && adminInvoices.length > 0 && (
              <div style={{ display: "grid", gap: 12 }}>
                {adminInvoices.map((inv, idx) => (
                  <div key={inv._id || idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, background: '#fafbfc' }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: "#1f2937", marginBottom: 4 }}>{inv.title || "Invoice"}</div>
                        {inv.clientName && <div style={{ fontSize: 14, color: "#6b7280" }}>{inv.clientName} ({inv.email})</div>}
                      </div>
                      <div style={{ fontWeight: 700, padding: '6px 14px', borderRadius: 6, fontSize: 13, background: inv.status === "paid" ? "#d1fae5" : "#fef3c7", color: inv.status === "paid" ? "#065f46" : "#92400e" }}>
                        {inv.status === "paid" ? "Paid" : "Pending"}
                      </div>
                    </div>
                    {inv.description && <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 12 }}>{inv.description}</div>}
                    <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: 13, color: '#6b7280' }}>
                      <div><b>Amount:</b> <span style={{color: '#1e40af', fontWeight: 700}}>${Number(inv.amount || 0).toFixed(2)}</span></div>
                      <div><b>Created:</b> {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "-"}</div>
                      {inv.paidAt && <div><b>Paid:</b> {new Date(inv.paidAt).toLocaleDateString()}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "create-user" && (
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <CreateUserPage />
          </div>
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
