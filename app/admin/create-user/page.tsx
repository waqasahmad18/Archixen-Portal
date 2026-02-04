"use client";

import { useState } from "react";

export default function CreateUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [street, setStreet] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, password,
          street, address2, city, state, zip, country
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("User created successfully!");
        setName(""); setEmail(""); setPassword("");
        setStreet(""); setAddress2(""); setCity(""); setState(""); setZip(""); setCountry("");
      } else {
        setMessage("Failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 36 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#222', textAlign: 'center' }}>Create New User</h2>
        <form onSubmit={handleCreateUser}>
          <input
            type="text"
            placeholder="Client Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="email"
            placeholder="Client Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 12, marginBottom: 24, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="Street Address"
            value={street}
            onChange={e => setStreet(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="Address Line 2"
            value={address2}
            onChange={e => setAddress2(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="State / Province"
            value={state}
            onChange={e => setState(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="ZIP / Postal Code"
            value={zip}
            onChange={e => setZip(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 24, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 8, background: loading ? '#aaa' : '#0070f3', color: '#fff', border: 'none', fontWeight: 700, fontSize: 18, letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
          {message && <div style={{marginTop: 18, color: message.includes('success') ? 'green' : 'red', fontWeight: 500, textAlign: 'center'}}>{message}</div>}
        </form>
      </div>
    </div>
  );
}
