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
                <Navbar />
                <div className="page-layout">
                    <ComparisonSidebar
                        comparisonProperties={comparisonProperties}
                        onRemoveProperty={handleRemoveFromComparison}
                        onClearAll={handleClearComparison}
                    />
                    <div className="main-content">
                        <div className="loader-container">
                            <div className="loader"></div>
                            <p className="loader-text">Loading properties...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="page-layout">
                    <ComparisonSidebar
                        comparisonProperties={comparisonProperties}
                        onRemoveProperty={handleRemoveFromComparison}
                        onClearAll={handleClearComparison}
                    />
                    <div className="main-content">
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <p className="error">ERROR: {error}</p>
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
                {/* Permanent Left Sidebar */}
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
                                <button 
                                    onClick={() => navigate("/add")}
                                    className="empty-btn"
                                >
                                    Add Property
                                </button>
                            </div>
                        )}

                        {properties.length > 0 && (
                            <>
                                {/* Hot Properties Section */}
                                {hotProperties.length > 0 && (
                                    <section className="properties-section hot-section">
                                        <div className="section-header">
                                            <h2 className="section-titles">Latest</h2>
                                            {/* <p className="section-subtitle">Most sought-after listings</p> */}
                                        </div>
                                        {/* Desktop Grid */}
                                        <div className="hot-properties-grid">
                                            {hotProperties.map((property) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                    isHot={true}
                                                    showActions={false}
                                                    onAddToCompare={handleAddToComparison}
                                                />
                                            ))}
                                        </div>
                                        {/* Mobile Slider */}
                                        <div className="hot-properties-slider">
                                            <div className="hot-slider-content">
                                                {hotProperties.map((property) => (
                                                    <PropertyCard
                                                        key={property.id}
                                                        property={property}
                                                        isHot={true}
                                                        showActions={false}
                                                        onAddToCompare={handleAddToComparison}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Recommended Properties Section */}
                                {recommendedProperties.length > 0 && (
                                    <section>
                                        <div className="section-header">
                                            <h2 className="section-titles">Recommended For You</h2>
                                            {/* <p className="section-subtitle">Handpicked selections</p> */}
                                        </div>
                                        <div className="recommended-properties-grids">
                                            {recommendedProperties.map((property) => (
                                                <PropertyCard
                                                    key={property.id}
                                                    property={property}
                                                    isHot={false}
                                                    showActions={false}
                                                    onAddToCompare={handleAddToComparison}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </div>

                    {/* Floating Add Property Button */}
                    {/* <button 
                        onClick={() => navigate("/add")}
                        className="floating-add-btn"
                        title="Add New Property"
                    >
                        <span className="floating-plus">+</span>
                    </button> */}

                    {/* Add bottom spacing for mobile nav */}
                    <div className="bottom-spacer"></div>
                </div>
            </div>
        </>
    );
}