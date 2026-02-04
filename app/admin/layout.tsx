"use client";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  function handleLogout() {
    // Remove any session or token here if implemented
    window.location.href = "/";
  }
  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa' }}>
      <div style={{ width: '100%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#222', paddingLeft: 32 }}>Archixen Portal</div>
        <button
          onClick={handleLogout}
          style={{ marginRight: 32, padding: '8px 24px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}
