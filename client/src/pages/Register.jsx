import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
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
    console.log("Form data:", form);
    
    try {
      const response = await api.post("/api/auth/register", form);
      console.log("Registration response:", response);
      
      // Check if response has the expected structure
      if (response.data && response.data.token && response.data.user) {
        login(response.data.user, response.data.token);
        navigate("/");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || "Server error during registration");
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error - unable to reach server");
      } else {
        // Something else happened
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card fade-in">
      <h2>Create Account</h2>
      <p className="muted" style={{ textAlign: "center", marginBottom: "var(--spacing-md)" }}>
        Join SALONQ for exclusive salon experiences
      </p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Your full name"
            required 
          />
        </label>
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
            placeholder="Create a strong password"
            required
          />
        </label>
        <label>
          Account Type
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;