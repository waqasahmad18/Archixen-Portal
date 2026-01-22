"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const tabs = [
  { key: "profile", label: "My Profile" },
  { key: "invoices", label: "My Invoices" },
];

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<any>(null);
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

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("clientUser");
      window.location.href = "/";
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Topbar */}
      <div style={{ width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 60 }}>
        <button
          onClick={handleLogout}
          style={{ marginRight: 32, padding: '8px 24px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      <div style={{ display: "flex" }}>
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
          <Image src="/Logo-Variation-13.png" alt="Archixen Logo" width={140} height={60} style={{marginBottom: 18}} />
          <h2 style={{marginBottom: 32, fontWeight: 700, fontSize: 22, color: '#0070f3'}}>Client Portal</h2>
          <nav style={{ width: "100%" }}>
            {tabs.map(tab => (
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
          {activeTab === "profile" && (
            <div style={{ maxWidth: 420, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", padding: 36 }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#222', textAlign: 'center' }}>My Profile</h2>
              {user ? (
                <>
                  <div style={{fontSize:18,marginBottom:16}}><b>Name:</b> {user.name || <span style={{color:'#aaa'}}>N/A</span>}</div>
                  <div style={{fontSize:18,marginBottom:16}}><b>Email:</b> {user.email || <span style={{color:'#aaa'}}>N/A</span>}</div>
                  {user.street && <div style={{fontSize:18,marginBottom:16}}><b>Street:</b> {user.street}</div>}
                  {user.address2 && <div style={{fontSize:18,marginBottom:16}}><b>Address 2:</b> {user.address2}</div>}
                  {user.city && <div style={{fontSize:18,marginBottom:16}}><b>City:</b> {user.city}</div>}
                  {user.state && <div style={{fontSize:18,marginBottom:16}}><b>State:</b> {user.state}</div>}
                  {user.zip && <div style={{fontSize:18,marginBottom:16}}><b>Zip:</b> {user.zip}</div>}
                  {user.country && <div style={{fontSize:18,marginBottom:16}}><b>Country:</b> {user.country}</div>}
                </>
              ) : (
                <div style={{color:'#aaa',fontSize:18}}>No user info found.</div>
              )}
            </div>
          )}
          {activeTab === "invoices" && (
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
    </div>
  );
}
