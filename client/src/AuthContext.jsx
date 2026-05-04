import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("salonUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("salonToken") || "");

  useEffect(() => {
    if (user) localStorage.setItem("salonUser", JSON.stringify(user));
    else localStorage.removeItem("salonUser");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("salonToken", token);
    else localStorage.removeItem("salonToken");
  }, [token]);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
