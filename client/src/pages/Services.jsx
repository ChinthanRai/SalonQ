import React, { useEffect, useState } from "react";
import api from "../api.js";
import { Link } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get("/services");
        console.log("Services fetched:", data);
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Function to get background image based on service name
  const getServiceBackgroundImage = (serviceName) => {
    const name = serviceName.toLowerCase();
    
    // Haircut services
    if (name.includes("haircut") || name.includes("styling")) {
      return "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80";
    }
    // Beard services
    else if (name.includes("beard") || name.includes("shaving")) {
      return "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80";
    }
    // Hair color/treatment
    else if (name.includes("color") || name.includes("treatment") || name.includes("coloring")) {
      return "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80";
    }
    // Facial/spa
    else if (name.includes("facial") || name.includes("spa")) {
      return "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80";
    }
    // Manicure/pedicure
    else if (name.includes("manicure") || name.includes("pedicure")) {
      return "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80";
    }
    // Kids haircut
    else if (name.includes("kid") || name.includes("child")) {
      return "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80";
    }
    // Massage
    else if (name.includes("massage")) {
      return "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80";
    }
    // Hair wash
    else if (name.includes("wash") || name.includes("shampoo")) {
      return "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80";
    }
    // Makeup
    else if (name.includes("makeup") || name.includes("bridal")) {
      return "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80";
    }
    // Default - barber shop
    return "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80";
  };

  return (
    <section>
      <h2 className="section-title">Our Premium Services</h2>
      {services.length === 0 ? (
        <div className="luxury-card" style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
          <p className="muted">No services available at the moment.</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((s) => (
            <div key={s._id} className="service-card-image luxury-card fade-in">
              <div 
                className="service-bg-container" 
                style={{ backgroundImage: `url('${getServiceBackgroundImage(s.name)}')` }}
              >
                <div className="service-overlay"></div>
                <div className="service-info">
                  <h3>{s.name}</h3>
                  <div className="service-details">
                    <p className="service-duration">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {s.duration || s.durationMinutes} mins
                    </p>
                    <p className="service-price">₹{s.price}</p>
                  </div>
                  <Link to={`/book?serviceId=${s._id}`} className="btn-primary" style={{ marginTop: "var(--spacing-md)", width: "100%" }}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Services;