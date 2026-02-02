'use client';

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../styling/PropertDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  async function fetchProperty() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
    }
    
    if (!error) setProperty(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container">
        <div className="error">
          <div className="error-icon">🏠</div>
          <p className="error-text">Property not found</p>
          <button className="error-btn" onClick={() => navigate("/")}>
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="header-title">Details</h1>
        {/* <button
          className={`heart-btn ${liked ? "liked" : ""}`}
          onClick={() => setLiked(!liked)}
        >
          ♡
        </button> */}
      </div>

      <div className="details-wrapper">
        <div>
          {/* Hero Section */}
          <div className="hero-section">
            {property.image_url ? (
              <img
                src={property.image_url || "/placeholder.svg"}
                alt={property.title}
                className="hero-image"
              />
            ) : (
              <div
                className="hero-image"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
            )}
            <div className="hero-overlay">
              <h2 className="hero-title">{property.title}</h2>
              <p className="hero-subtitle">{property.location}</p>
            </div>
          </div>

          {/* Price Section */}
          <div className="price-section" style={{ marginTop: "24px" }}>
            <div className="price">₹{property.price?.toLocaleString("en-IN")}</div>
            <div className="price-details">
              <span>{property.area ? `${property.area} sq.ft` : "Area not specified"}</span>
            </div>
            {/* <button
              className={`save-btn ${saved ? "saved" : ""}`}
              onClick={() => setSaved(!saved)}
              title="Save Property"
            >
              📑
            </button> */}
          </div>

          {/* Description Section */}
          <div className="description-section" style={{ marginTop: "24px" }}>
            <h3 className="section-titles">Description</h3>
            <p className="description-text">
              {property.description ||
                "This modern house features spacious interiors, large windows, and natural light, creating a warm, inviting atmosphere. Surrounded by greenery, it blends comfort with contemporary design, offering an ideal retreat for family living, relaxation, and cherished moments in a serene setting."}
            </p>
            {/* <button className="read-more-btn">Read more...</button> */}
          </div>

          {/* Facilities Section */}
          <div className="facilities-section" style={{ marginTop: "24px" }}>
            <h3 className="section-titles">Facilities</h3>
            <div className="facilities-grid">
              <div className="facility-item">
                <div className="facility-icon">🛏️</div>
                <div className="facility-count">
                  {property.bedroom || 0}
                </div>
                <div className="facility-label">Bedrooms</div>
              </div>
              <div className="facility-item">
                <div className="facility-icon">🚿</div>
                <div className="facility-count">
                  {property.bathroom || 0}
                </div>
                <div className="facility-label">Bathrooms</div>
              </div>
              <div className="facility-item">
                <div className="facility-icon">📐</div>
                <div className="facility-count">
                  {property.area || 0}
                </div>
                <div className="facility-label">Sq.ft</div>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="amenities-section">
            <h3 className="section-titles">Amenities</h3>
            <div className="amenities-list">
              <div className="amenity-item">
                <span className="amenity-icon">🏊</span>
                <span>Swimming Pool</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon">🎾</span>
                <span>Tennis Court</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon">💪</span>
                <span>Gym</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon">🌳</span>
                <span>Garden</span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          {property.contact && (
            <div className="owner-section">
              <h3 className="section-titles">Contact Information</h3>
              <div className="owner-card">
                <div className="owner-avatar">📞</div>
                <div className="owner-info">
                  <h4>Contact Owner</h4>
                  <p>{property.contact}</p>
                </div>
              </div>
              <div className="owner-buttons">
                <button className="owner-btn" onClick={() => window.location.href = `tel:${property.contact}`}>
                  📞 Call
                </button>
                <button className="owner-btn" onClick={() => window.location.href = `sms:${property.contact}`}>
                  💬 Message
                </button>
              </div>
            </div>
          )}

          {/* Location Section */}
          <div className="location-section">
            <h3 className="section-titles">Location</h3>
            <div className="location-details">
              <div className="location-item">
                <h4>Address</h4>
                <p>{property.location || "Location not specified"}</p>
              </div>
              <div className="location-item">
                <h4>Area</h4>
                <p>{property.area || "N/A"} sq.ft</p>
              </div>
            </div>
            <div className="map-placeholder">
              📍 Map Integration Here
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar">
          <div className="info-card">
            <h3>Area</h3>
            <p>{property.area || "N/A"} sq.ft</p>
          </div>
          <div className="info-card">
            <h3>Bedrooms</h3>
            <p>{property.bedroom || 0}</p>
          </div>
          <div className="info-card">
            <h3>Bathrooms</h3>
            <p>{property.bathroom || 0}</p>
          </div>
          <div className="info-card">
            <h3>Price</h3>
            <p>₹{property.price?.toLocaleString("en-IN") || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="action-buttons" style={{ marginTop: "24px" }}>
        <button className="btn-action btn-tour">
          📅 Book a Tour
        </button>
        <button className="btn-action btn-offer">
          💰 Make an offer
        </button>
      </div> */}
    </div>
  );
}