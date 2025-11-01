import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    // keep user in sync if token removed elsewhere
    const handle = () => {
      const token = localStorage.getItem("token");
      if (!token) setUser(null);
    };
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  function login({ token, user }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    navigate("/");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  const value = { user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
