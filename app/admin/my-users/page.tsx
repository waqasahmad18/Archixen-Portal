"use client";
import { useEffect, useState } from "react";

function EditUserModal({ user, onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    password: user.password || "",
    city: user.city || "",
    country: user.country || "",
    street: user.street || "",
    address2: user.address2 || "",
    state: user.state || "",
    zip: user.zip || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/my-users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user._id, ...form })
      });
      const data = await res.json();
      if (data.success) {
        onSave(data.user);
      } else {
        setError(data.error || "Failed to update user");
      }
    } catch (err) {
      setError("Error updating user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[350px] h-[420px] flex flex-col justify-center relative animate-fadeIn border border-gray-200">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold">&times;</button>
        <h3 className="text-xl font-bold text-indigo-700 mb-2 text-center">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-1 overflow-y-auto max-h-[320px] px-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400 pr-10"
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 bg-transparent border-none p-0"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                style={{ background: 'none' }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001c1.636 4.048 5.735 7.5 10.066 7.5 2.042 0 3.97-.613 5.566-1.662M6.228 6.228A9.956 9.956 0 0112 4.5c4.331 0 8.43 3.452 10.066 7.5-.477 1.178-1.197 2.276-2.106 3.24M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.772 6.772L6.228 6.228" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.772 0c-1.636 4.048-5.735 7.5-10.066 7.5S3.57 16.048 1.934 12c1.636-4.048 5.735-7.5 10.066-7.5 4.331 0 8.43 3.452 10.066 7.5z" /></svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input name="street" value={form.street} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input name="address2" value={form.address2} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
            <input name="state" value={form.state} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
            <input name="zip" value={form.zip} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-indigo-400" />
          </div>
          {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
          <button type="submit" disabled={saving} className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MyUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [deletingId, setDeletingId] = useState("");
  async function handleDeleteUser(id: string) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/my-users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u: any) => u._id !== id));
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
    } finally {
      setDeletingId("");
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/my-users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || "Failed to fetch users");
        }
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f8fa' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 36 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: '#222', textAlign: 'center' }}>My Users</h2>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: 18 }}>Loading...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#e11d48', fontWeight: 600 }}>{error}</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888' }}>No users found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>City</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Country</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: 13, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user._id}>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{user.name}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{user.email}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{user.city || '-'}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{user.country || '-'}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>
                      <button
                        style={{ padding: '6px 16px', borderRadius: 8, background: '#facc15', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', marginRight: 8, cursor: 'pointer' }}
                        onClick={() => setEditUser(user)}
                        disabled={deletingId === user._id}
                      >Edit</button>
                      <button
                        style={{ padding: '6px 16px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={deletingId === user._id}
                      >{deletingId === user._id ? 'Deleting...' : 'Delete'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={(updatedUser: any) => {
            setUsers(users.map((u: any) => u._id === updatedUser._id ? updatedUser : u));
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
}
