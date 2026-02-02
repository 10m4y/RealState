import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/ComparisonSidebar.css';

export default function ComparisonSidebar({ 
  comparisonProperties, 
  onRemoveProperty, 
  onClearAll 
}) {
  const navigate = useNavigate();
  const maxProperties = 3;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleCompare = () => {
    if (comparisonProperties.length >= 2) {
      const ids = comparisonProperties.map(p => p.id).join(',');
      navigate(`/compare?properties=${ids}`);
    }
  };

  const getSlotNumber = (index) => index + 1;

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={toggleMobileSidebar}
        title="Compare Properties"
      >
        <span className="toggle-icon">⚖️</span>
        {comparisonProperties.length > 0 && (
          <span className="toggle-badge">{comparisonProperties.length}</span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`comparison-sidebar-permanent ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        <button 
          className="mobile-close-btn"
          onClick={closeMobileSidebar}
        >
          ✕
        </button>

        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title-section">
            <h3 className="sidebar-title">Compare Properties</h3>
            <span className="sidebar-count">
              {comparisonProperties.length}/{maxProperties}
            </span>
          </div>
          <p className="sidebar-subtitle">
            {comparisonProperties.length === 0 
              ? "Add up to 3 properties to compare"
              : "Add more properties or compare"}
          </p>
        </div>

        {/* Drop Zones */}
        <div className="drop-zones-container">
          {[...Array(maxProperties)].map((_, index) => {
            const property = comparisonProperties[index];
            const slotNumber = getSlotNumber(index);

            return (
              <div
                key={`slot-${index}`}
                className={`drop-zone ${property ? 'filled' : 'empty'}`}
              >
                <div className="slot-number">Slot {slotNumber}</div>

                {property ? (
                  // Filled Slot with Property
                  <div className="property-preview">
                    {property.image_url ? (
                      <img
                        src={property.image_url}
                        alt={property.title}
                        className="preview-image"
                      />
                    ) : (
                      <div className="preview-image-placeholder">🏠</div>
                    )}

                    <div className="preview-content">
                      <h4 className="preview-title">{property.title}</h4>
                      <p className="preview-location">📍 {property.location}</p>
                      <p className="preview-price">
                        ₹{property.price?.toLocaleString('en-IN')}
                      </p>
                      <div className="preview-stats">
                        <span>🛏️ {property.bedroom || 0}</span>
                        <span>🚿 {property.bathroom || 0}</span>
                        <span>📐 {property.area || 0}</span>
                      </div>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => onRemoveProperty(property.id)}
                      title="Remove property"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  // Empty Slot
                  <div className="empty-slot">
                    <div className="empty-icon">+</div>
                    <p className="empty-text">Empty slot</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="sidebar-actions">
          {comparisonProperties.length >= 2 ? (
            <>
              <button 
                className="compare-btn"
                onClick={handleCompare}
              >
                <span className="btn-icon">⚖️</span>
                Compare Properties
              </button>
              <button 
                className="clear-btn"
                onClick={onClearAll}
              >
                Clear All
              </button>
            </>
          ) : (
            <div className="sidebar-hint">
              {comparisonProperties.length === 0 ? (
                <p>Add properties using the compare button on each card</p>
              ) : (
                <p>Add at least one more property to compare</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}