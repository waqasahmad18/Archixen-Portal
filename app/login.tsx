"use client";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded admin credentials
  const adminEmail = "admin@archixen.com";
  const adminPassword = "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === adminEmail && password === adminPassword) {
      // Redirect to admin dashboard (replace with router push in real app)
      window.location.href = "/admin";
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: 'url(/Home-Banner.jpg)',
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.92)",
        borderRadius: 16,
        boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
        padding: 36,
        minWidth: 340,
        maxWidth: 380,
        textAlign: "center"
      }}>
        <Image src="/Logo-Variation-13.png" alt="Archixen Logo" width={120} height={60} style={{marginBottom: 24}} />
        <h2 style={{marginBottom: 24, color: '#222'}}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{width: "100%", padding: 10, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc'}}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{width: "100%", padding: 10, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc'}}
          />
          {error && <div style={{color: 'red', marginBottom: 12}}>{error}</div>}
          <button type="submit" style={{width: "100%", padding: 12, borderRadius: 8, background: '#0070f3', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16}}>Login</button>
        </form>
      </div>
    </div>
  );
}
