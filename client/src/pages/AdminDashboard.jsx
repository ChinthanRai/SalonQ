import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await api.get("/bookings/stats");
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="luxury-card" style={{ textAlign: "center", padding: "var(--spacing-xl)" }}><p>Loading dashboard...</p></div>;

  // Calculate percentages for chart
  const total = stats.totalBookings;
  const confirmedPercent = total > 0 ? (stats.confirmed / total) * 100 : 0;
  const pendingPercent = total > 0 ? (stats.pending / total) * 100 : 0;

  return (
    <section>
      <h2 className="section-title">Admin Dashboard</h2>
      
      <div className="grid">
        <div className="luxury-card">
          <h3>Total Bookings</h3>
          <p className="big-number">{stats.totalBookings}</p>
          <div className="stat-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
        
        <div className="luxury-card">
          <h3>Confirmed</h3>
          <p className="big-number" style={{ color: "#4CAF50" }}>{stats.confirmed}</p>
          <div className="stat-chart">
            <div className="chart-bar" style={{ width: `${confirmedPercent}%`, backgroundColor: "#4CAF50" }}></div>
          </div>
          <p className="muted">{confirmedPercent.toFixed(1)}% of total</p>
        </div>
        
        <div className="luxury-card">
          <h3>Pending</h3>
          <p className="big-number" style={{ color: "#FF9800" }}>{stats.pending}</p>
          <div className="stat-chart">
            <div className="chart-bar" style={{ width: `${pendingPercent}%`, backgroundColor: "#FF9800" }}></div>
          </div>
          <p className="muted">{pendingPercent.toFixed(1)}% of total</p>
        </div>
      </div>
      
      <h3 className="section-title">Service Performance</h3>
      <div className="grid">
        {stats.perService.map((row) => (
          <div key={row.serviceName} className="luxury-card">
            <h4>{row.serviceName}</h4>
            <p className="big-number">{row.count}</p>
            <p className="muted">bookings</p>
            <div className="progress-container">
              <div className="progress-bar" style={{ 
                width: `${(row.count / Math.max(...stats.perService.map(s => s.count))) * 100}%`,
                background: "var(--gradient-gold)"
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;