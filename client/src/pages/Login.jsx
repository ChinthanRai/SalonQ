import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log("API base URL:", api.defaults.baseURL);
    console.log("Login form data:", form);
    
    try {
      const response = await api.post("/auth/login", form);
      console.log("Login response:", response);
      
      // Check if response has the expected structure
      if (response.data && response.data.token && response.data.user) {
        login(response.data.user, response.data.token);
        if (response.data.user.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || "Server error during login");
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error - unable to reach server");
      } else {
        // Something else happened
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card fade-in">
      <h2>Welcome Back</h2>
      <p className="muted" style={{ textAlign: "center", marginBottom: "var(--spacing-md)" }}>
        Sign in to your SALONQ account
      </p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email Address
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="your@email.com"
            required 
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="muted">
        New to SALONQ? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;