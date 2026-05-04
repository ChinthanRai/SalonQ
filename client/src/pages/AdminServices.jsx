import React, { useEffect, useState } from "react";
import api from "../api.js";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", durationMinutes: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  // Function to get image based on service name
  const getServiceImage = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes("hair") || name.includes("beard")) {
      return "/images/haircut.svg";
    } else if (name.includes("facial") || name.includes("spa")) {
      return "/images/facial.svg";
    } else if (name.includes("massage")) {
      return "/images/massage.svg";
    } else if (name.includes("manicure") || name.includes("pedicure")) {
      return "/images/massage.svg";
    }
    return "/images/facial.svg"; // default image
  };

  const loadServices = async () => {
    try {
      const { data } = await api.get("/services");
      console.log("Admin services fetched:", data); // Debug log
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing service
        await api.put(`/services/${editingId}`, form);
      } else {
        // Create new service
        await api.post("/services", form);
      }
      setForm({ name: "", durationMinutes: "", price: "" });
      setEditingId(null);
      loadServices();
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      durationMinutes: service.duration || service.durationMinutes,
      price: service.price
    });
    setEditingId(service._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
      alert("Service deleted successfully");
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service.");
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: "", durationMinutes: "", price: "" });
    setEditingId(null);
  };

  return (
    <section>
      <h2 className="section-title">Manage Services</h2>
      
      <div className="luxury-card">
        <h3>{editingId ? "Edit Service" : "Add New Service"}</h3>
        <form className="inline-form" onSubmit={handleSubmit} style={{ flexDirection: "column" }}>
          <label>
            Service Name
            <input
              name="name"
              placeholder="e.g., Premium Haircut"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Duration (minutes)
            <input
              name="durationMinutes"
              type="number"
              min="0"
              placeholder="e.g., 60"
              value={form.durationMinutes}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Price (₹)
            <input
              name="price"
              type="number"
              min="0"
              placeholder="e.g., 1500"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
            <button className="btn-primary" type="submit">
              {editingId ? "Update Service" : "Add Service"}
            </button>
            {editingId && (
              <button className="btn-outline" type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <h3 className="section-title">Current Services ({services.length})</h3>
      {services.length === 0 ? (
        <div className="luxury-card" style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
          <p className="muted">No services available. Add your first service above.</p>
        </div>
      ) : (
        <div className="grid">
          {services.map((s) => (
            <div key={s._id} className="luxury-card fade-in">
              <div className="service-image-container">
                <img 
                  src={getServiceImage(s.name)} 
                  alt={s.name} 
                  className="service-image"
                  onError={(e) => {
                    console.log("Image load error for:", s.name); // Debug log
                    e.target.src = "/images/facial.svg"; // fallback image
                  }}
                />
              </div>
              <h3>{s.name}</h3>
              <p>{s.duration || s.durationMinutes} mins</p>
              <p className="big-number">₹{s.price}</p>
              <div style={{ display: "flex", gap: "var(--spacing-xs)", marginTop: "var(--spacing-sm)" }}>
                <button className="btn-outline" onClick={() => handleEdit(s)} style={{ flex: 1 }}>
                  Edit
                </button>
                <button className="btn-secondary" onClick={() => handleDelete(s._id)} style={{ flex: 1 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminServices;