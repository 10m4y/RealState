import { useEffect,useState } from "react";
import {supabase} from "../services/supabaseClient"
import { Link } from "react-router-dom";

export default function PropertList(){
    const [properties, setProperties] = useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{
        fetchProperties();
    },[]);

    async function fetchProperties(){
        setLoading(true);

        const {data,error}=await supabase
        .from("properties")
        .select("*")
        .order("created_at", {ascending: false});

        if(error){
            setError(error.message);
        }else{
            setProperties(data);
        }
        setLoading(false);
    }
    async function deleteProperty(id){
        const confirm = window.confirm("Delete this property");
        if(!confirm)return;

        await supabase.from("properties").delete().eq("id",id);

        setProperties((prev)=>prev.filter((p)=> p.id !==id));
    }
    if(loading)return <p>LOADING PROPERTIES</p>
    if(error)return <p>ERROR: {error}</p>;

    return(
        <div>
            <p>hello</p>
            <h1>Property Listings</h1>
            <Link to="/add">Add Property</Link>

            {properties.length === 0 && <p>No properties found.</p>}

            {properties.map((property) => (
                <div key={property.id}>
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <p>₹{property.price}</p>

                <Link to={`/property/${property.id}`}>View</Link>
                <Link to={`/edit/${property.id}`}>Edit</Link>
                <button onClick={() => deleteProperty(property.id)}>
                    Delete
                </button>

                </div>
            ))}
        </div>
    );
}