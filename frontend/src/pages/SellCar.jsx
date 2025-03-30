import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { AiOutlinePlus } from "react-icons/ai"; // Plus icon for file upload
import axios from "axios"; // To send data to backend
import "./SellCar.css";

const SellCar = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState({
    name: "",
    model: "",
    year_of_production: "",
    kilometers_driven: "",
    previous_owners: "",
    color: "",
    extra_fittings: false,
    price: "",
    phone: "",
    location: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [username, setUsername] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {  // 2MB size limit
      alert("File size should be less than 2MB");
      return;
    }
    setCarData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!carData.name || !carData.model || !carData.year_of_production || !carData.image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("username", username); // Ensure correct username is sent
  
    Object.keys(carData).forEach((key) => {
      formDataToSend.append(key, carData[key]);
    });
  
    try {
      const res = await axios.post("http://localhost:8081/add-car", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.data.message === "Car listed successfully!") {
        alert("Car listed successfully!");
        navigate("/"); // Redirect to home page
        window.location.reload(); // Refresh to reflect new data
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to list car. ${error.response?.data?.error || "Unknown error"}`);
    }
  };
  

  return (
    <div className="sell-car-container">
      <h2>Sell Your Car</h2>
      <form onSubmit={handleSubmit} className="sell-car-form">
        <div className="horizontal">
          <label className="file-input">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Car Preview"
                className="preview-image"
                onClick={() => document.getElementById("file-upload").click()}
              />
            ) : (
              <>
                <input
                  className="upload-button"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <AiOutlinePlus size={24} />
                </button>
              </>
            )}
          </label>

          <div className="vertical">
            <input type="text" name="name" placeholder="Car Name" value={carData.name} onChange={handleChange} required />
            <input type="text" name="model" placeholder="Car Model" value={carData.model} onChange={handleChange} required />
            <input type="number" name="year_of_production" placeholder="Year of Production" value={carData.year_of_production} onChange={handleChange} required />
            <input type="number" name="kilometers_driven" placeholder="Kilometers Driven" value={carData.kilometers_driven} onChange={handleChange} required />
            <input type="number" name="previous_owners" placeholder="Previous Owners" value={carData.previous_owners} onChange={handleChange} required />
            
          </div>
        </div>
        <div className="horizontal1">
        <input type="text" name="color" placeholder="Color" value={carData.color} onChange={handleChange} required />
<input type="number" name="price" placeholder="Price (₹)" value={carData.price} onChange={handleChange} required />
</div>
        <div className="checkbox-container">
          <label>
            <input type="checkbox" name="extra_fittings" checked={carData.extra_fittings} onChange={handleChange} />
            Extra Fittings
          </label>
        </div>
<div className="horizontal2">
       
        <input type="tel" name="phone" placeholder="Phone Number" value={carData.phone} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={carData.location} onChange={handleChange} required />
       </div>
        <textarea name="description" placeholder="Description" value={carData.description} onChange={handleChange} required></textarea>

        <button type="submit" className="submit-button">List Car</button>
      </form>
    </div>
  );
};

export default SellCar;
