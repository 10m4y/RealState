import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import "../styling/AddEditProperty.css";

export default function AddEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    bedroom: "",
    bathroom: "",
    area: "",
    image_url: "",
    contact: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState('User');
  const isEdit = Boolean(id);

  useEffect(() => {
    // Get userName from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    
    if (isEdit) fetchProperty();
  }, [isEdit, id]);

  async function fetchProperty() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        alert("Error loading property: " + error.message);
        navigate("/");
        return;
      }

      if (data) {
        setForm({
          title: data.title || "",
          location: data.location || "",
          price: data.price || "",
          description: data.description || "",
          bedroom: data.bedroom || "",
          bathroom: data.bathroom || "",
          area: data.area || "",
          image_url: data.image_url || "",
          contact: data.contact || "",
        });
        setImagePreview(data.image_url);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error loading property");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function uploadImage(file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("property-image")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("property-image")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.location || !form.price) {
      alert("Please fill all required fields (Title, Location, Price)");
      return;
    }

    setLoading(true);
    let imageUrl = form.image_url;

    if (imageFile) {
      try {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      } catch (err) {
        console.error("Upload error:", err);
        alert("Image upload failed: " + err.message);
        setLoading(false);
        setUploading(false);
        return;
      }
    }

    // Build payload matching exact database schema
    const payload = {
      title: form.title,
      location: form.location,
      description: form.description || null,
      price: form.price ? parseFloat(form.price) : null,
      bedroom: form.bedroom ? parseInt(form.bedroom) : null,
      bathroom: form.bathroom ? parseInt(form.bathroom) : null,
      area: form.area ? parseFloat(form.area) : null,
      image_url: imageUrl || null,
      contact: form.contact || null,
    };

    console.log("Payload being sent:", payload);

    try {
      if (isEdit) {
        const { data, error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", id)
          .select();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        console.log("Update response:", data);
      } else {
        const { data, error } = await supabase
          .from("properties")
          .insert([payload])
          .select();

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        console.log("Insert response:", data);
      }
      navigate("/my-properties");
    } catch (err) {
      console.error("Error saving property:", err);
      alert("Error saving property: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && isEdit) {
    return (
      <>
        <Navbar userName={userName} />
        <div className="form-container">
          <div className="loader-wrapper">
            <div className="loader"></div>
            <p className="loader-text">Loading property...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userName={userName} />
      
      <div className="form-container">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="form-title">
            {isEdit ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="form-subtitle">
            {isEdit ? "Update property details" : "Fill in the details to list your property"}
          </p>
        </div>

        <form className="property-form" onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className="form-section image-section">
            <h3 className="section-title">Property Image</h3>
            <div className="image-upload-wrapper">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img 
                    src={imagePreview} 
                    alt="Property preview" 
                    className="image-preview"
                  />
                  <button 
                    type="button"
                    className="change-image-btn"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    📷 Change Image
                  </button>
                </div>
              ) : (
                <label htmlFor="file-input" className="image-upload-label">
                  <div className="upload-placeholder">
                    <div className="upload-icon">📸</div>
                    <p className="upload-text">Click to upload property image</p>
                    <p className="upload-hint">JPG, PNG or WEBP (MAX. 5MB)</p>
                  </div>
                </label>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="title">Property Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Modern Luxury Villa"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., Mumbai, Maharashtra"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g., 5000000"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Area (sq.ft)</label>
                <input
                  id="area"
                  name="area"
                  type="number"
                  placeholder="e.g., 2500"
                  value={form.area}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="form-section">
            <h3 className="section-title">Property Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bedroom">Bedrooms</label>
                <input
                  id="bedroom"
                  name="bedroom"
                  type="number"
                  placeholder="e.g., 3"
                  value={form.bedroom}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathroom">Bathrooms</label>
                <input
                  id="bathroom"
                  name="bathroom"
                  type="number"
                  placeholder="e.g., 2"
                  value={form.bathroom}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="contact">Contact Information</label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  placeholder="e.g., +91 98765 43210"
                  value={form.contact}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h3 className="section-title">Description</h3>
            <div className="form-group full-width">
              <label htmlFor="description">Property Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your property, its features, and amenities..."
                value={form.description}
                onChange={handleChange}
                rows="6"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-submit"
            >
              {loading || uploading ? (
                <>
                  <span className="btn-spinner"></span>
                  {uploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  {isEdit ? "✓ Update Property" : "+ Create Property"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}