import React, { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register", { name, email, password });
      login({ token: res.data.token, user: res.data.user });
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-slate-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <div className="bg-red-600 p-2 rounded mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-slate-800 rounded"
          minLength={3}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-slate-800 rounded"
          type="email"
          required
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-slate-800 rounded"
          type="password"
          minLength={6}
          required
        />
        <button
          disabled={loading}
          className="w-full py-2 bg-indigo-600 rounded"
        >
          {loading ? "Please wait..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
