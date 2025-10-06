import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import SellCar from "./pages/SellCar";
import Login from "./pages/Login"; // Import Login Page
import Header from "./components/Header";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import MyCars from "./pages/MyCars";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";  // Import Google OAuth Provider
import EditCar from "./pages/EditCar";



const App = () => {
  const [searchQuery, setSearchQuery] = useState("");  // Manage search state here
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedKilometersRange, setSelectedKilometersRange] = useState("");


  return (
    <GoogleOAuthProvider clientId="948314527547-2n02jkfu5tv69snn648vtdinuujka0do.apps.googleusercontent.com">  {/* Wrap with GoogleOAuthProvider */}
    <Router>
      <Header searchQuery={searchQuery}
      setSearchQuery={setSearchQuery} 
      selectedPriceRange={selectedPriceRange}
      setSelectedPriceRange={setSelectedPriceRange} 
      selectedKilometersRange={selectedKilometersRange} 
      setSelectedKilometersRange={setSelectedKilometersRange}   /> {/* Pass as props ,Pass setSelectedModel to Header*/} 
      <Routes>
      <Route path="/" element={<Home searchQuery={searchQuery}  selectedPriceRange={selectedPriceRange} selectedKilometersRange={selectedKilometersRange}/>} />  {/* Pass searchQuery to Home */}
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/sell" element={<SellCar />} />
        <Route path="/login" element={<Login />} /> {/* New Route for Login */}
        <Route path="/Signup" element={<Signup/>} />
        <Route path="/my-cars/:username" element={<MyCars />} />
        <Route path="/edit-car/:id" element={<EditCar />} />
        




      </Routes>
      <Footer/>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
