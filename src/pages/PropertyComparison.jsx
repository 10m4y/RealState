import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Navbar from '../components/NavBar';
import '../styling/PropertyComparison.css';

export default function PropertyComparison() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // Get userName from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    const propertyIds = searchParams.get('properties');
    if (propertyIds) {
      fetchProperties(propertyIds.split(','));
    } else {
      setError('No properties selected for comparison');
      setLoading(false);
    }
  }, [searchParams]);

  async function fetchProperties(ids) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', ids);

      if (error) throw error;

      // Sort properties in the same order as the IDs
      const sortedData = ids.map(id => 
        data.find(prop => prop.id === id)
      ).filter(Boolean);

      setProperties(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const comparisonRows = [
    { 
      label: 'Image', 
      key: 'image_url',
      render: (property) => (
        property.image_url ? (
          <img 
            src={property.image_url} 
            alt={property.title}
            className="comparison-image"
          />
        ) : (
          <div className="comparison-image-placeholder">🏠</div>
        )
      )
    },
    { 
      label: 'Title', 
      key: 'title',
      render: (property) => (
        <div className="comparison-title">{property.title}</div>
      )
    },
    { 
      label: 'Location', 
      key: 'location',
      render: (property) => (
        <div className="comparison-location">
          📍 {property.location || 'N/A'}
        </div>
      )
    },
    { 
      label: 'Price', 
      key: 'price',
      render: (property) => (
        <div className="comparison-price">
          ₹{property.price?.toLocaleString('en-IN') || 'N/A'}
        </div>
      ),
      highlight: true
    },
    { 
      label: 'Area', 
      key: 'area',
      render: (property) => (
        <div className="comparison-area">
          {property.area || 'N/A'} sq.ft
        </div>
      ),
      highlight: true
    },
    { 
      label: 'Bedrooms', 
      key: 'bedroom',
      render: (property) => (
        <div className="comparison-bedrooms">
          🛏️ {property.bedroom || 0}
        </div>
      )
    },
    { 
      label: 'Bathrooms', 
      key: 'bathroom',
      render: (property) => (
        <div className="comparison-bathrooms">
          🚿 {property.bathroom || 0}
        </div>
      )
    },
    { 
      label: 'Price per Sq.ft', 
      key: 'price_per_sqft',
      render: (property) => {
        const pricePerSqft = property.price && property.area 
          ? Math.round(property.price / property.area)
          : null;
        return (
          <div className="comparison-price-per-sqft">
            {pricePerSqft ? `₹${pricePerSqft.toLocaleString('en-IN')}` : 'N/A'}
          </div>
        );
      },
      highlight: true
    },
    { 
      label: 'Contact', 
      key: 'contact',
      render: (property) => (
        <div className="comparison-contact">
          {property.contact ? (
            <a href={`tel:${property.contact}`} className="contact-link">
              📞 {property.contact}
            </a>
          ) : (
            'N/A'
          )}
        </div>
      )
    },
    { 
      label: 'Description', 
      key: 'description',
      render: (property) => (
        <div className="comparison-description">
          {property.description || 'No description available'}
        </div>
      )
    }
  ];

  // Find best values for highlighting
  const getBestValue = (key) => {
    if (key === 'price' || key === 'price_per_sqft') {
      // Lower is better for price
      return Math.min(...properties.map(p => {
        if (key === 'price_per_sqft') {
          return p.price && p.area ? p.price / p.area : Infinity;
        }
        return p.price || Infinity;
      }));
    } else if (key === 'area' || key === 'bedroom' || key === 'bathroom') {
      // Higher is better for these
      return Math.max(...properties.map(p => p[key] || 0));
    }
    return null;
  };

  const isBestValue = (property, key) => {
    const bestValue = getBestValue(key);
    if (bestValue === null) return false;

    if (key === 'price') {
      return property.price === bestValue;
    } else if (key === 'price_per_sqft') {
      const pricePerSqft = property.price && property.area 
        ? property.price / property.area 
        : Infinity;
      return Math.abs(pricePerSqft - bestValue) < 1;
    } else {
      return property[key] === bestValue;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar userName={userName} />
        <div className="comparison-container">
          <div className="loader-container">
            <div className="loader"></div>
            <p className="loader-text">Loading comparison...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || properties.length < 2) {
    return (
      <>
        <Navbar userName={userName} />
        <div className="comparison-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-text">
              {error || 'Please select at least 2 properties to compare'}
            </p>
            <button 
              className="back-to-properties-btn"
              onClick={() => navigate('/properties')}
            >
              Back to Properties
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userName={userName} />
      
      <div className="comparison-container">
        {/* Header */}
        <div className="comparison-page-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <div className="header-content">
            <h1 className="comparison-page-title">Property Comparison</h1>
            <p className="comparison-page-subtitle">
              Comparing {properties.length} properties side by side
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="comparison-label-cell">Features</th>
                {properties.map((property, index) => (
                  <th key={property.id} className="comparison-property-cell">
                    <div className="property-header">
                      <span className="property-number">Property {index + 1}</span>
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/property/${property.id}`)}
                      >
                        View Details →
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.key} className={row.highlight ? 'highlight-row' : ''}>
                  <td className="comparison-label-cell">
                    <strong>{row.label}</strong>
                  </td>
                  {properties.map((property) => (
                    <td 
                      key={property.id} 
                      className={`comparison-value-cell ${
                        row.highlight && isBestValue(property, row.key) ? 'best-value' : ''
                      }`}
                    >
                      {row.render(property)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="comparison-actions-section">
          <button 
            className="action-btn primary"
            onClick={() => navigate('/properties')}
          >
            Browse More Properties
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => window.print()}
          >
            📄 Print Comparison
          </button>
        </div>
      </div>

      {/* Legend */}
      {/* <div className="comparison-legend">
        <div className="legend-item">
          <div className="legend-badge best"></div>
          <span>Best Value</span>
        </div>
      </div> */}
    </>
  );
}