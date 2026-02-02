import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import PropertyCard from "../components/PropertyCard";
import "../styling/MyProperties.css";

export default function MyProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userContact, setUserContact] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get user details from localStorage
        const storedName = localStorage.getItem('userName');
        const storedContact = localStorage.getItem('userContact');

        if (!storedContact) {
            // If no contact stored, redirect to home
            navigate('/');
            return;
        }

        setUserName(storedName || 'User');
        setUserContact(storedContact);
        fetchProperties(storedContact);
    }, [navigate]);

    async function fetchProperties(contact) {
        setLoading(true);

        const { data, error } = await supabase
            .from("properties")
            .select("*")
            .eq("contact", contact) // Filter by contact number
            .order("created_at", { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setProperties(data || []);
        }
        setLoading(false);
    }

    async function deleteProperty(id, e) {
        e.preventDefault();
        e.stopPropagation();
        
        const confirm = window.confirm("Are you sure you want to delete this property?");
        if (!confirm) return;

        const { error } = await supabase.from("properties").delete().eq("id", id);
        
        if (error) {
            alert("Failed to delete property");
            return;
        }
        
        setProperties((prev) => prev.filter((p) => p.id !== id));
    }

    function handleEdit(propertyId, e) {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/edit/${propertyId}`);
    }

    if (loading) {
        return (
            <>
                <Navbar userName={userName} />
                <div className="my-properties-layout">
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p className="loader-text">Loading your properties...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar userName={userName} />
                <div className="my-properties-layout">
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <p className="error">ERROR: {error}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar userName={userName} />
            
            <div className="my-properties-layout">
                <div className="container">
                    <div className="page-header">
                        <div className="header-content">
                            <h1 className="page-title">My Properties</h1>
                            <p className="page-subtitle">
                                {properties.length} {properties.length === 1 ? 'listing' : 'listings'} 
                                {userContact && ` • ${userContact}`}
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate("/add")}
                            className="add-property-btn"
                            title="Add New Property"
                        >
                            <span className="plus-icon">+</span>
                            <span className="btn-text">Add Property</span>
                        </button>
                    </div>

                    {properties.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🏠</div>
                            <h2>No properties yet</h2>
                            <p>Start building your portfolio by adding your first property</p>
                            <button 
                                onClick={() => navigate("/add")}
                                className="empty-btn"
                            >
                                Add Your First Property
                            </button>
                        </div>
                    )}

                    {properties.length > 0 && (
                        <div className="my-properties-grid">
                            {properties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    isHot={false}
                                    showActions={true}
                                    onDelete={deleteProperty}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="bottom-spacer"></div>
            </div>
        </>
    );
}