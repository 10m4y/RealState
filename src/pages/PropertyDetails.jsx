import {useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function PropertyDetails(){

    const {id} = useParams();
    const [property,setProperty]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        fetchProperty();
    },[]);

    async function fetchProperty(){
        const {data,error}=await supabase
            .from("properties")
            .select("*")
            .eq("id",id)
            .single();
        
            if(!error)setProperty(data);
            setLoading(false);
    }
    if(loading)return <p>Loading...</p>
    if(!property) return <p>Property not found</p>;

    return(
        <div>
            <h1>{property.title}</h1>
            <p>{property.location}</p>
            <p>₹{property.price}</p>
            <p>{property.description}</p>

            {property.image_url && (
                <img src={property.image_url} width="300" />
            )}
        </div>

    );
}