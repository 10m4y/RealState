import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyList from "./pages/PropertList"
import PropertyDetails from "./pages/PropertyDetails";
import AddEditProperty from "./pages/AddEditProperty";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PropertyList />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/add" element={<AddEditProperty />} />
        <Route path="/edit/:id" element={<AddEditProperty />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
