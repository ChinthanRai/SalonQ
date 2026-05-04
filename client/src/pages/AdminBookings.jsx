import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await api.get("/bookings");
      setBookings(data);
    };
    fetchBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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

  // Approve booking
  const handleApprove = async (bookingId) => {
    try {
      const response = await api.post(`/bookings/approve/${bookingId}`);
      // Update the booking in state
      setBookings(bookings.map(b => 
        b._id === bookingId ? {...b, ...response.data.booking} : b
      ));
    } catch (err) {
      console.error("Error approving booking:", err);
      alert("Failed to approve booking");
    }
  };

  // Reject booking
  const handleReject = async (bookingId) => {
    try {
      const response = await api.post(`/bookings/reject/${bookingId}`);
      // Update the booking in state
      setBookings(bookings.map(b => 
        b._id === bookingId ? {...b, ...response.data.booking} : b
      ));
    } catch (err) {
      console.error("Error rejecting booking:", err);
      alert("Failed to reject booking");
    }
  };

  // Delete booking
  const handleDelete = async (bookingId) => {
    try {
      await api.delete(`/bookings/delete/${bookingId}`);
      // Remove the booking from state
      setBookings(bookings.filter(b => b._id !== bookingId));
      alert("Booking deleted successfully");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  return (
    <section>
      <h2 className="section-title">All Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="luxury-card" style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
          <p className="muted">No bookings found.</p>
        </div>
      ) : (
        <div className="luxury-card">
          <div className="table-wrapper">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "var(--spacing-sm)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Customer</th>
                  <th style={{ textAlign: "left", padding: "var(--spacing-sm)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Service</th>
                  <th style={{ textAlign: "left", padding: "var(--spacing-sm)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Date & Time</th>
                  <th style={{ textAlign: "left", padding: "var(--spacing-sm)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "var(--spacing-sm)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <td style={{ padding: "var(--spacing-sm)" }}>
                      <div style={{ fontWeight: "600" }}>{b.customer?.name}</div>
                      <div className="muted" style={{ fontSize: "0.85rem" }}>{b.customer?.email}</div>
                    </td>
                    <td style={{ padding: "var(--spacing-sm)" }}>{b.service?.name}</td>
                    <td style={{ padding: "var(--spacing-sm)" }}>
                      <div>{formatDate(b.date)}</div>
                      <div className="muted" style={{ fontSize: "0.85rem" }}>{b.timeSlotStart}</div>
                    </td>
                    <td style={{ padding: "var(--spacing-sm)" }}>
                      <div>
                        <span className={`status-badge ${getStatusClass(b.status, b.isVerified, b.isAdminApproved)}`}>
                          {b.status === "cancelled" ? "Cancelled" :
                           b.isAdminApproved ? b.status : 
                           b.isVerified ? "Verified, Awaiting Approval" : "Pending Verification"}
                        </span>
                      </div>
                      {!b.isVerified && (
                        <div className="muted" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                          Customer verification pending
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "var(--spacing-sm)" }}>
                      {!b.isVerified ? (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span className="muted">Awaiting customer verification</span>
                          <button 
                            className="btn-danger" 
                            onClick={() => handleDelete(b._id)}
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                            title="Delete this booking"
                          >
                            Delete
                          </button>
                        </div>
                      ) : b.isAdminApproved ? (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span className="status-confirmed">Approved</span>
                          <button 
                            className="btn-danger" 
                            onClick={() => handleDelete(b._id)}
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                            title="Delete this booking"
                          >
                            Delete
                          </button>
                        </div>
                      ) : b.status === "cancelled" ? (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span className="status-cancelled">Cancelled</span>
                          <button 
                            className="btn-danger" 
                            onClick={() => handleDelete(b._id)}
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                            title="Delete this booking"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <button 
                            className="btn-primary" 
                            onClick={() => handleApprove(b._id)}
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn-secondary" 
                            onClick={() => handleReject(b._id)}
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                          >
                            Reject
                          </button>
                          <button 
                            className="btn-danger" 
                            onClick={() => handleDelete(b._id)}
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                            title="Delete this booking"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminBookings;