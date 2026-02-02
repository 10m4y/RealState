import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/Home.css';

export default function Home() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(contact.trim())) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Store name and contact in localStorage
      localStorage.setItem('userName', name.trim());
      localStorage.setItem('userContact', contact.trim());

      // Navigate to properties page
      navigate('/properties');
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 10) {
      setContact(value);
    }
  };

  return (
    <div className="home-container">
      {/* Background Image Overlay */}
      <div className="home-background">
        <div className="background-overlay"></div>
      </div>

      {/* Content */}
      <div className="home-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Find Your Dream Property</h1>
          <p className="welcome-subtitle">
            Discover the perfect place to call home from our curated collection of premium properties
          </p>
        </div>

        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">Get Started</h2>
            <p className="form-subtitle">Enter your details to explore properties</p>
          </div>

          <form onSubmit={handleSubmit} className="home-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact" className="form-label">
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                className={`form-input ${errors.contact ? 'error' : ''}`}
                placeholder="Enter 10-digit mobile number"
                value={contact}
                onChange={handleContactChange}
                autoComplete="tel"
              />
              {errors.contact && (
                <span className="error-message">{errors.contact}</span>
              )}
            </div>

            <button type="submit" className="submit-btn">
              <span>Explore Properties</span>
              <span className="btn-arrow">→</span>
            </button>
          </form>

          {/* <div className="form-footer">
            <p className="footer-text">
              Already have properties? 
              <button 
                onClick={() => navigate('/my-properties')} 
                className="footer-link"
              >
                View My Properties
              </button>
            </p>
          </div> */}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>
      <div className="decorative-circle circle-3"></div>
    </div>
  );
}