import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-slate-900 text-slate-100 px-6 py-4 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          JobsTracker
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline">Hello, {user.name}</span>
              <Link to="/add" className="px-3 py-1 bg-slate-700 rounded">
                Add Job
              </Link>
              <button onClick={logout} className="px-3 py-1 bg-red-600 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-slate-700 rounded">
                Login
              </Link>
              <Link to="/register" className="px-3 py-1 bg-slate-700 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
