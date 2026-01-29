import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function AddEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) fetchProperty();
  }, []);

  async function fetchProperty() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    setForm(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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
      alert("Please fill required fields");
      return;
    }

    let imageUrl = form.image_url;

    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        alert("Image upload failed");
        return;
      }
    }

    const payload = {
      ...form,
      image_url: imageUrl,
    };

    if (isEdit) {
      await supabase
        .from("properties")
        .update(payload)
        .eq("id", id);
    } else {
      await supabase
        .from("properties")
        .insert([payload]);
    }

    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isEdit ? "Edit Property" : "Add Property"}</h1>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {form.image_url && (
        <img src={form.image_url} alt="preview" width="150" />
      )}

      <button type="submit">
        {isEdit ? "Update" : "Create"}
      </button>
    </form>
  );
}
