import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero">
      {/* Hero Banner with Salon Image Background - Buttons First */}
      <div className="hero-banner-top">
        <div className="hero-banner-gradient"></div>
        {/* Decorative salon elements */}
        <div className="salon-decorations">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-banner-content">
          <h1 className="banner-title">SALONQ</h1>
          <p className="banner-subtitle">Where Style Meets Excellence</p>
          
          {/* Brief Description */}
          <p className="salon-description">
            Your premier destination for luxury salon services. Expert stylists delivering 
            exceptional haircuts, styling, and grooming in a sophisticated atmosphere.
          </p>
          
          {/* Action Buttons */}
          <div className="hero-banner-actions">
            <Link to="/services" className="btn-primary pulse-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Explore Services
            </Link>
            <Link to="/book" className="btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
      
      {/* Salon Features Section */}
      <div className="salon-features-section">
        <h2 className="section-title">Our Salon Features</h2>
        
        <div className="features-grid">
          {/* Feature 1 - Haircuts & Styling */}
          <div className="feature-card-image luxury-card fade-in">
            <div className="feature-image-container" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80')" }}>
              <div className="feature-overlay"></div>
              <div className="feature-content">
                <div className="feature-icon-large">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
                <h3>Premium Haircuts & Styling</h3>
                <p>Expert cuts and modern styling for all hair types</p>
              </div>
            </div>
          </div>

          {/* Feature 2 - Beard Grooming */}
          <div className="feature-card-image luxury-card fade-in">
            <div className="feature-image-container" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80')" }}>
              <div className="feature-overlay"></div>
              <div className="feature-content">
                <div className="feature-icon-large">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3>Beard Grooming & Shaving</h3>
                <p>Professional beard shaping and hot towel shaves</p>
              </div>
            </div>
          </div>

          {/* Feature 3 - Hair Treatments */}
          <div className="feature-card-image luxury-card fade-in">
            <div className="feature-image-container" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80')" }}>
              <div className="feature-overlay"></div>
              <div className="feature-content">
                <div className="feature-icon-large">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3>Hair Treatments & Care</h3>
                <p>Specialized treatments for healthy, vibrant hair</p>
              </div>
            </div>
          </div>

          {/* Feature 4 - Kids Haircuts */}
          <div className="feature-card-image luxury-card fade-in">
            <div className="feature-image-container" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80')" }}>
              <div className="feature-overlay"></div>
              <div className="feature-content">
                <div className="feature-icon-large">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Kids Haircuts</h3>
                <p>Gentle and fun haircuts for children of all ages</p>
              </div>
            </div>
          </div>

          {/* Feature 5 - Spa & Wellness */}
          <div className="feature-card-image luxury-card fade-in">
            <div className="feature-image-container" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80')" }}>
              <div className="feature-overlay"></div>
              <div className="feature-content">
                <div className="feature-icon-large">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3>Spa & Wellness Services</h3>
                <p>Relaxing massages and rejuvenating spa treatments</p>
              </div>
            </div>
          </div>

          {/* Feature 6 - Nail Care */}
          <div className="feature-card-image luxury-card fade-in">
            <div className="feature-image-container" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80')" }}>
              <div className="feature-overlay"></div>
              <div className="feature-content">
                <div className="feature-icon-large">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3>Manicure & Pedicure</h3>
                <p>Complete nail care and pampering services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Footer */}
      <footer className="copyright-footer">
        <div className="footer-content">
          <p className="copyright-text">
            © {new Date().getFullYear()} SALONQ. All Rights Reserved.
          </p>
          <p className="footer-tagline">
            Luxury Salon Experience | Powered by Excellence
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Home;