"use client";
import { useState } from "react";
import Image from "next/image";

const sidebarTabs = [
  { key: "new-invoice", label: "Create New Invoice" },
  { key: "my-invoices", label: "My Invoices" },
];

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("new-invoice");

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
            <form>
              <input type="text" placeholder="Client Name" style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
              <input type="email" placeholder="Client Email" style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
              <input type="text" placeholder="Invoice Title" style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
              <textarea placeholder="Description" style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, minHeight: 80 }} />
              <input type="number" placeholder="Amount (USD)" style={{ width: '100%', padding: 12, marginBottom: 24, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }} />
              <button type="submit" style={{ width: '100%', padding: 14, borderRadius: 8, background: '#0070f3', color: '#fff', border: 'none', fontWeight: 700, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>Send Invoice</button>
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
      </main>
    </div>
  );
}
