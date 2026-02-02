import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyList from "./pages/PropertyList";
import PropertyDetails from "./pages/PropertyDetails";
import AddEditProperty from "./pages/AddEditProperty";
import MyProperties from "./pages/MyProperties";
import PropertyComparison from "./pages/PropertyComparison";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/add" element={<AddEditProperty />} />
        <Route path="/edit/:id" element={<AddEditProperty />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/compare" element={<PropertyComparison />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;