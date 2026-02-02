import { useNavigate } from "react-router-dom";
import "../styling/PropertyCard.css";

export default function PropertyCard({ 
    property, 
    isHot = false, 
    showActions = false, 
    onDelete, 
    onEdit,
    onAddToCompare 
}) {
    const navigate = useNavigate();

    function handleCardClick() {
        navigate(`/property/${property.id}`);
    }

    function handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) {
            onDelete(property.id, e);
        }
    }

    function handleEdit(e) {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) {
            onEdit(property.id, e);
        }
    }

    function handleAddToCompare(e) {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCompare) {
            onAddToCompare(property);
        }
    }

    if (isHot) {
        return (
            <div 
                className="property-card hot-card"
                onClick={handleCardClick}
            >
                <div 
                    className="hot-card-image"
                    style={{
                        backgroundImage: property.image_url 
                            ? `url(${property.image_url})` 
                            : 'linear-gradient(135deg, #2d3436 0%, #000000 100%)'
                    }}
                >
                    <div className="hot-card-overlay">
                        <div className="hot-badge">Featured</div>
                        {onAddToCompare && (
                            <button 
                                className="compare-add-btn hot-compare-btn"
                                onClick={handleAddToCompare}
                                title="Add to comparison"
                            >
                                <span className="compare-icon">⚖️</span>
                            </button>
                        )}
                        <h3 className="hot-title">{property.title}</h3>
                        <p className="hot-location">
                            {property.location}
                        </p>
                        <p className="hot-price">₹{property.price?.toLocaleString('en-IN')}</p>
                        
                        {property.bedroom && (
                            <div className="hot-meta">
                                <span>{property.bedroom} Bedrooms</span>
                                {property.bathroom && <span>{property.bathroom} Bathrooms</span>}
                                {property.area && <span>{property.area} sq.ft</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="property-card normal-card"
            onClick={handleCardClick}
        >
            <div 
                className="property-image"
                style={{
                    backgroundImage: property.image_url 
                        ? `url(${property.image_url})` 
                        : 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)'
                }}
            >
                {!property.image_url && (
                    <div className="image-placeholder">
                        <span className="placeholder-icon">🏠</span>
                    </div>
                )}
                {onAddToCompare && (
                    <button 
                        className="compare-add-btn"
                        onClick={handleAddToCompare}
                        title="Add to comparison"
                    >
                        <span className="compare-icon">⚖️</span>
                        <span className="compare-text">Compare</span>
                    </button>
                )}
            </div>

            <div className="property-content">
                <h3 className="property-title">{property.title}</h3>
                <p className="location">
                    {property.location}
                </p>
                <p className="price">₹{property.price?.toLocaleString('en-IN')}</p>
                
                {property.bedroom && (
                    <div className="property-meta">
                        <span>{property.bedroom} Beds</span>
                        {property.bathroom && <span>{property.bathroom} Baths</span>}
                        {property.area && <span>{property.area} sq.ft</span>}
                    </div>
                )}

                {showActions && (
                    <div className="card-actions">
                        <button 
                            onClick={handleEdit}
                            className="btn-edit-card"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="btn-delete-card"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}