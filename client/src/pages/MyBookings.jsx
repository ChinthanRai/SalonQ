import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    };
    fetchBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusClass = (status, isVerified, isAdminApproved) => {
    if (!isVerified) return "status-pending";
    if (!isAdminApproved && status === "pending") return "status-pending";
    if (status === "confirmed") return "status-confirmed";
    if (status === "completed") return "status-completed";
    if (status === "cancelled") return "status-cancelled";
    return "status-default";
  };

  // Get status text for display
  const getStatusText = (isVerified, isAdminApproved, status) => {
    if (!isVerified) return "Pending Verification";
    if (!isAdminApproved) return "Awaiting Admin Approval";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <section>
      <h2 className="section-title">My Appointments</h2>
      {bookings.length === 0 ? (
        <div className="luxury-card" style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
          <p className="muted">You don't have any bookings yet.</p>
          <a href="/book" className="btn-primary" style={{ marginTop: "var(--spacing-md)", display: "inline-block" }}>
            Book Your First Appointment
          </a>
        </div>
      ) : (
        <div className="grid">
          {bookings.map((b) => (
            <div key={b._id} className="luxury-card fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3>{b.service?.name}</h3>
                  <p style={{ margin: "var(--spacing-xs) 0", color: "var(--silver)" }}>
                    {formatDate(b.date)}
                  </p>
                  <p style={{ margin: "var(--spacing-xs) 0", fontWeight: "600" }}>
                    {b.timeSlotStart}
                  </p>
                </div>
                <span className={`status-badge ${getStatusClass(b.status, b.isVerified, b.isAdminApproved)}`}>
                  {getStatusText(b.isVerified, b.isAdminApproved, b.status)}
                </span>
              </div>
              <div style={{ marginTop: "var(--spacing-md)", paddingTop: "var(--spacing-md)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ margin: "var(--spacing-xs) 0", display: "flex", alignItems: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "var(--spacing-xs)" }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Booking ID: {b._id.substring(0, 8)}
                </p>
                {!b.isVerified && (
                  <p style={{ margin: "var(--spacing-xs) 0", color: "#FF9800" }}>
                    Please verify your booking with the OTP sent to your email
                  </p>
                )}
                {b.isVerified && !b.isAdminApproved && b.status !== "cancelled" && (
                  <p style={{ margin: "var(--spacing-xs) 0", color: "#2196F3" }}>
                    Awaiting admin approval
                  </p>
                )}
                {b.isAdminApproved && (
                  <p style={{ margin: "var(--spacing-xs) 0", color: "#4CAF50" }}>
                    ✓ Confirmed by admin
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyBookings;