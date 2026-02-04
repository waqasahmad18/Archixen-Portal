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
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] max-h-[80vh] flex flex-col border border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
        <h3 className="text-2xl font-800 text-blue-700 mb-6 text-center">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-gray-50"
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
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">Street Address</label>
            <input name="street" value={form.street} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">Address Line 2</label>
            <input name="address2" value={form.address2} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">State / Province</label>
            <input name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">ZIP / Postal Code</label>
            <input name="zip" value={form.zip} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-700 text-gray-700 mb-2">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          {error && <div className="text-red-600 text-center font-700 bg-red-50 p-3 rounded-lg">{error}</div>}
          <button type="submit" disabled={saving} className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-800 text-base shadow-lg transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed mt-6">
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
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: '#1e40af' }}>My Users</h2>
      {loading ? (
        <div style={{ textAlign: 'center', fontSize: 16, color: '#6b7280', padding: 60 }}>Loading users...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: '#dc2626', background: '#fee2e2', padding: 20, borderRadius: 12, fontWeight: 600 }}>{error}</div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: 60, background: '#f9fafb', borderRadius: 12 }}>No users found.</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>Name</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>Email</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>City</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>Country</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '16px 20px', color: '#1f2937', fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: 14 }}>{user.email}</td>
                  <td style={{ padding: '16px 20px', color: '#6b7280' }}>{user.city || '-'}</td>
                  <td style={{ padding: '16px 20px', color: '#6b7280' }}>{user.country || '-'}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button
                      style={{ padding: '8px 16px', borderRadius: 6, background: '#fbbf24', color: '#92400e', fontWeight: 700, fontSize: 13, border: 'none', marginRight: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f59e0b';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#fbbf24';
                      }}
                      onClick={() => setEditUser(user)}
                      disabled={deletingId === user._id}
                    >Edit</button>
                    <button
                      style={{ padding: '8px 16px', borderRadius: 6, background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', opacity: deletingId === user._id ? 0.6 : 1, transition: 'all 0.2s' }}
                      onMouseOver={(e) => {
                        if (deletingId !== user._id) e.currentTarget.style.background = '#dc2626';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                      }}
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
