import {useEffect,useState} from"react";
import { supabase } from "../services/supabaseClient";
import { useNavigate,useParams } from "react-router-dom";

export default function AddEditProperty(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [form,setForm]=useState({
        title:"",
        location:"",
        price:"",
        description:"",
        image_url:"",
    });

    const isEdit = Boolean(id);

    useEffect(()=>{
        if(isEdit)fetchProperty();
    },[]);

    async function fetchProperty(){
        const {data} = await supabase
            .from("properties")
            .select("*")
            .eq("id",id)
            .single();

        setForm(data);
    }
    function handleChange(e){
        setForm({...form,[e.target.name]:e.target.value});
    }

    async function handleSubmit(e){
        e.preventDefault();

        if(!form.title || !form.location || !form.price){
            alert("Please fill required fields");
            return;
        }

        if(isEdit){
            await supabase
            .from("properties")
            .update(form)
            .eq("id",id);
        }
        else{
            await supabase
            .from("properties")
            .insert([form]);
        }
        navigate("/");
    }
    return(
        <form onSubmit={handleSubmit}>
            <h1>{isEdit ? "Edit Property" : "Add Property"}</h1>

            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />

            <button type="submit">
                {isEdit ? "Update" : "Create"}
            </button>
        </form>
    );
}