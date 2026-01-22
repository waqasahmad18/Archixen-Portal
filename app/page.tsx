
"use client";
import Image from "next/image";
import { useState } from "react";
import React from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Hardcoded admin credentials
  const adminEmail = "admin@archixen.com";
  const adminPassword = "admin123";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === adminEmail && password === adminPassword) {
      window.location.href = "/admin";
      return;
    }
    // Try client login
    try {
      const res = await fetch("/api/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        // Store user info in localStorage for client portal
        if (typeof window !== "undefined") {
          localStorage.setItem("clientUser", JSON.stringify(data.user));
        }
        window.location.href = "/client";
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
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
        background: "rgba(255,255,255,0.96)",
        borderRadius: 28,
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        padding: 48,
        minWidth: 370,
        maxWidth: 410,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Image src="/Logo-Variation-13.png" alt="Archixen Logo" width={180} height={80} style={{margin: '0 auto 18px auto', display: 'block'}} />
        <h1 style={{marginBottom: 24, color: '#1a1a1a', fontWeight: 700, fontSize: 32, letterSpacing: 1, fontFamily: 'Segoe UI, sans-serif'}}>Login</h1>
        <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 18}}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "16px 14px",
              marginBottom: 0,
              borderRadius: 12,
              border: '1.5px solid #e0e0e0',
              fontSize: 17,
              outline: 'none',
              background: '#f7f8fa',
              transition: 'border 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
            onFocus={e => e.target.style.border = '1.5px solid #0070f3'}
            onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
          />
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "16px 44px 16px 14px",
                marginBottom: 0,
                borderRadius: 12,
                border: '1.5px solid #e0e0e0',
                fontSize: 17,
                outline: 'none',
                background: '#f7f8fa',
                transition: 'border 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
              onFocus={e => e.target.style.border = '1.5px solid #0070f3'}
              onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#888',
                fontSize: 16
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {error && <div style={{color: 'red', marginBottom: 8, fontWeight: 500, fontSize: 15}}>{error}</div>}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 12,
              background: 'linear-gradient(90deg, #0070f3 60%, #0051a8 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: 1,
              boxShadow: '0 2px 12px rgba(0,112,243,0.10)',
              cursor: 'pointer',
              marginTop: 6,
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #0051a8 0%, #0070f3 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #0070f3 60%, #0051a8 100%)'}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
