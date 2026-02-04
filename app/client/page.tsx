"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const tabs = [
  { key: "profile", label: "My Profile" },
  { key: "invoices", label: "My Invoices" },
];

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  useEffect(() => {
    async function fetchUser() {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("clientUser");
        if (userStr) {
          const { email } = JSON.parse(userStr);
          if (email) {
            const res = await fetch("/api/client-info", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
            } else {
              setUser(null);
            }
          }
        }
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchInvoices() {
      if (typeof window === "undefined") return;
      const userStr = localStorage.getItem("clientUser");
      const localUser = userStr ? JSON.parse(userStr) : null;
      const email = user?.email || localUser?.email;
      const userId = user?._id || localUser?._id;
      if (!email && !userId) return;

      setInvoiceLoading(true);
      setInvoiceError("");
      try {
        const res = await fetch("/api/user-invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, userId })
        });
        const data = await res.json();
        if (data.success) {
          setInvoices(data.invoices || []);
        } else {
          setInvoiceError(data.error || "Failed to load invoices.");
        }
      } catch (err: any) {
        setInvoiceError(err.message || "Failed to load invoices.");
      } finally {
        setInvoiceLoading(false);
      }
    }

    if (activeTab === "invoices") {
      fetchInvoices();
    }
  }, [activeTab, user]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("clientUser");
      window.location.href = "/";
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      {/* Topbar */}
      <div style={{ width: '100%', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        <div style={{ fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: 1 }}>Archixen</div>
        <button
          onClick={handleLogout}
          style={{ padding: '10px 28px', borderRadius: 8, background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#b91c1c')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#dc2626')}
        >
          Logout
        </button>
      </div>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{
          width: 270,
          background: "#fff",
          boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          padding: "40px 0"
        }}>
          <div style={{textAlign: 'center', marginBottom: 40}}>
            <div style={{fontWeight: 800, fontSize: 26, color: '#1e40af', letterSpacing: 1}}>Archixen</div>
            <div style={{fontSize: 13, color: '#6b7280', marginTop: 6}}>Client Portal</div>
          </div>
          <nav style={{ width: "100%", display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tabs.map(tab => (
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
                  fontSize: 15,
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
          {activeTab === "profile" && (
            <div style={{ maxWidth: 520, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: 48 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: '#1e40af', textAlign: 'center' }}>My Profile</h2>
              {user ? (
                <div style={{display: 'grid', gap: 16}}>
                  <div style={{padding: 16, background: '#f9fafb', borderRadius: 12, borderLeft: '4px solid #3b82f6'}}>
                    <div style={{fontSize: 13, color: '#6b7280', marginBottom: 4}}>NAME</div>
                    <div style={{fontSize: 18, fontWeight: 700, color: '#1f2937'}}>{user.name || '-'}</div>
                  </div>
                  <div style={{padding: 16, background: '#f9fafb', borderRadius: 12, borderLeft: '4px solid #3b82f6'}}>
                    <div style={{fontSize: 13, color: '#6b7280', marginBottom: 4}}>EMAIL</div>
                    <div style={{fontSize: 16, color: '#374151'}}>{user.email || '-'}</div>
                  </div>
                  {(user.street || user.address2 || user.city || user.state || user.zip || user.country) && (
                    <div style={{padding: 20, background: '#f0f9ff', borderRadius: 12, borderLeft: '4px solid #3b82f6'}}>
                      <div style={{fontSize: 13, color: '#6b7280', marginBottom: 12, fontWeight: 700}}>ADDRESS</div>
                      <div style={{fontSize: 15, color: '#374151', lineHeight: 1.6}}>
                        {user.street && <div>{user.street}</div>}
                        {user.address2 && <div>{user.address2}</div>}
                        {user.city && <div>{user.city}</div>}
                        {user.state && <div>{user.state} {user.zip}</div>}
                        {user.country && <div>{user.country}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{padding: 24, background: '#fef3c7', borderRadius: 12, textAlign: 'center', color: '#92400e'}}>No user info found.</div>
              )}
            </div>
          )}
          {activeTab === "invoices" && (
            <div style={{ maxWidth: 1000, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: 48 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: '#1e40af' }}>My Invoices</h2>
              {invoiceLoading && (
                <div style={{ color: '#6b7280', textAlign: 'center', fontSize: 16, padding: 60 }}>Loading invoices...</div>
              )}
              {!invoiceLoading && invoiceError && (
                <div style={{ color: '#dc2626', background: '#fee2e2', textAlign: 'center', fontSize: 16, padding: 20, borderRadius: 12 }}>{invoiceError}</div>
              )}
              {!invoiceLoading && !invoiceError && invoices.length === 0 && (
                <div style={{ color: '#6b7280', textAlign: 'center', fontSize: 16, padding: 60, background: '#f9fafb', borderRadius: 12 }}>No invoices yet.</div>
              )}
              {!invoiceLoading && !invoiceError && invoices.length > 0 && (
                <div style={{ display: "grid", gap: 12 }}>
                  {invoices.map((inv, idx) => (
                    <Link
                      key={inv._id || idx}
                      href={`/client/invoices/${inv._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, cursor: "pointer", background: '#fafbfc', transition: 'all 0.3s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f0f9ff';
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#fafbfc';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 17, color: "#1f2937", marginBottom: 6 }}>{inv.title || "Invoice"}</div>
                          {inv.description && (
                            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>{inv.description}</div>
                          )}
                          <div style={{ color: "#9ca3af", fontSize: 13 }}>{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : ""}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#1e40af", marginBottom: 8 }}>${Number(inv.amount || 0).toFixed(2)}</div>
                          <div style={{ fontWeight: 600, padding: '4px 12px', borderRadius: 6, fontSize: 13, background: inv.status === "paid" ? "#d1fae5" : "#fef3c7", color: inv.status === "paid" ? "#065f46" : "#92400e" }}>
                            {inv.status === "paid" ? "Paid" : "Pending"}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
