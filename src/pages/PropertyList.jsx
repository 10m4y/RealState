import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import PropertyCard from "../components/PropertyCard";
import ComparisonSidebar from "../components/ComparisonSidebar";
import "../styling/PropertyList.css";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonProperties, setComparisonProperties] = useState([]);
  const [userName, setUserName] = useState('User');
  const navigate = useNavigate();
  const MAX_COMPARISON = 3;

  useEffect(() => {
    // Get userName from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    fetchProperties();

    // Load comparison properties from localStorage
    const saved = localStorage.getItem('comparisonProperties');
    if (saved) {
      try {
        setComparisonProperties(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading comparison properties:', e);
      }
    }
  }, []);

  // Save comparison properties to localStorage
  useEffect(() => {
    localStorage.setItem('comparisonProperties', JSON.stringify(comparisonProperties));
  }, [comparisonProperties]);

  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProperties(data);
    }
    setLoading(false);
  }

  const handleAddToComparison = (property) => {
    // Check if property is already in comparison
    if (comparisonProperties.find(p => p.id === property.id)) {
      showNotification('This property is already in the comparison list!', 'warning');
      return;
    }

    // Check if we've reached the maximum
    if (comparisonProperties.length >= MAX_COMPARISON) {
      showNotification(`You can only compare up to ${MAX_COMPARISON} properties!`, 'warning');
      return;
    }

    // Add property to comparison
    setComparisonProperties(prev => [...prev, property]);
    showNotification('✓ Added to comparison', 'success');
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `comparison-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2500);
  };

  const handleRemoveFromComparison = (propertyId) => {
    setComparisonProperties(prev => prev.filter(p => p.id !== propertyId));
    showNotification('Property removed from comparison', 'info');
  };

  const handleClearComparison = () => {
    if (window.confirm('Are you sure you want to clear all properties from comparison?')) {
      setComparisonProperties([]);
      showNotification('Comparison list cleared', 'info');
    }
  };

  // Separate hot properties (first 3) and recommended (rest)
  const hotProperties = properties.slice(0, 3);
  const recommendedProperties = properties.slice(3);

  if (loading) {
    return (
      <>
        <Navbar userName={userName} />
        <div className="page-layout">
          <div className="main-content">
            <div className="loader-container">
              <div className="loader"></div>
              <div className="loader-text">Loading properties...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar userName={userName} />
        <div className="page-layout">
          <div className="main-content">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <div className="error">ERROR: {error}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userName={userName} />
      <div className="page-layout">
        {/* Comparison Sidebar with built-in toggle */}
        <ComparisonSidebar
          comparisonProperties={comparisonProperties}
          onRemoveProperty={handleRemoveFromComparison}
          onClearAll={handleClearComparison}
        />

        {/* Main Content */}
        <div className="main-content">
          <div className="container">
            <div className="page-header">
              <div className="header-content">
                <h1 className="page-title">Discover Your Dream Property</h1>
                <p className="page-subtitle">{properties.length} premium properties available</p>
              </div>
            </div>

            {properties.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <h2>No properties found</h2>
                <p>Start by adding your first property</p>
                <button onClick={() => navigate("/add")} className="empty-btn">
                  Add Property
                </button>
              </div>
            )}

            {properties.length > 0 && (
              <>
                {/* Hot Properties Section - WITH isHot PROP */}
                {hotProperties.length > 0 && (
                  <div className="properties-section hot-section">
                    <div className="section-header">
                      <div>
                        <h2 className="section-titles">Latest</h2>
                      </div>
                    </div>

                    {/* Horizontal Slider for Hot Properties */}
                    <div className="hot-properties-slider">
                      <div className="hot-slider-content">
                        {hotProperties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isHot={true}  
                            onAddToComparison={handleAddToComparison}
                            isInComparison={comparisonProperties.some(p => p.id === property.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommended Properties Section - Regular Cards */}
                {recommendedProperties.length > 0 && (
                  <div className="properties-section">
                    <div className="section-header">
                      <div>
                        <h2 className="section-titles">Recommended For You</h2>
                      </div>
                    </div>

                    <div className="recommended-properties-grids">
                      {recommendedProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isHot={false}  
                          onAddToComparison={handleAddToComparison}
                          isInComparison={comparisonProperties.some(p => p.id === property.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Add bottom spacing for mobile nav */}
          <div className="bottom-spacer"></div>
        </div>
      </div>
    </>
  );
}