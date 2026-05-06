import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { useSearchParams } from "react-router-dom";

const Book = () => {
  const [services, setServices] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    serviceId: "",
    date: "",
    timeSlotStart: ""
  });

  // Calculate minimum date (today)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await api.get("/services");
      setServices(data);
      
      // Pre-select service from URL if provided
      const serviceIdFromUrl = searchParams.get('serviceId');
      if (serviceIdFromUrl) {
        setForm(prev => ({ ...prev, serviceId: serviceIdFromUrl }));
      }
    };
    fetchServices();
  }, [searchParams]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const [loading, setLoading] = useState(false);

  const createBooking = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    try {
      const { data } = await api.post("/bookings", form);
      setBookingId(data.bookingId);
      setStep(2);
      setMsg(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const { data } = await api.post("/bookings/verify-otp", { bookingId, otp });
      setMsg(data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  const resendOtp = async () => {
    setError("");
    setMsg("");
    try {
      const { data } = await api.post("/bookings/resend-otp", { bookingId });
      setMsg(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <section className="auth-card fade-in">
      <h2>Book Your Appointment</h2>
      {step === 1 && (
        <form onSubmit={createBooking}>
          <label>
            Select Service
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} (₹{s.price})
                </option>
              ))}
            </select>
          </label>
          <label>
            Select Date
            <input 
              name="date" 
              type="date" 
              value={form.date} 
              onChange={handleChange} 
              min={getTodayDate()} // Restrict to today and future dates
              required 
            />
          </label>
          <label>
            Select Time
            <input
              name="timeSlotStart"
              type="time"
              value={form.timeSlotStart}
              onChange={handleChange}
              required
            />
          </label>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp}>
          <label>
            Enter OTP
            <input 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              placeholder="Enter 6-digit code"
              required 
            />
            <p className="muted">Check your email for the verification code</p>
          </label>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
            <button className="btn-primary" type="submit">
              Verify OTP
            </button>
            <button className="btn-outline" type="button" onClick={resendOtp}>
              Resend OTP
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="success-message">
          <div style={{ textAlign: "center", marginBottom: "var(--spacing-md)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 12 11 12 9 9"></polyline>
              <path d="M9 12l2 3 4-4"></path>
            </svg>
          </div>
          <h3 style={{ textAlign: "center", color: "#4CAF50" }}>Booking Verified!</h3>
          <p style={{ textAlign: "center" }}>
            Your booking has been verified successfully. It is now awaiting admin approval.
          </p>
          <p style={{ textAlign: "center", marginTop: "var(--spacing-sm)", color: "#2196F3" }}>
            You will receive a confirmation email once approved by our team.
          </p>
        </div>
      )}

      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default Book;