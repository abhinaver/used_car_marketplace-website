import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CarDetails.css"; 

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/get-car/${id}`)
      .then((response) => {
        setCar(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch car details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading-message">Loading car details...</p>;
  if (error) return <h2 className="error-message">{error}</h2>;
  if (!car) return <h2 className="error-message">Car not found</h2>;

  return (
    <div className="car-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

      <div className="car-details-card">
        {/* Car Image */}
        <img src={car.image_url} alt={car.name} className="car-image" />

        {/* Car Details */}
        <div className="car-info">
          <h2 className="car-name">{car.name || "Unknown Car"}</h2>

          <p className="car-price">Price: <span>₹{(car.price ?? 0).toLocaleString()}</span></p>
          <p className="car-model">Model: <span>{car.model || "N/A"}</span></p>
          <p className="car-year">Year: <span>{car.year_of_production || "N/A"}</span></p>
          <p className="car-location">Location: <span>{car.location || "Unknown"}</span></p>
          <p className="car-km">Kilometers Driven: <span>{(car.kilometers_driven ?? 0).toLocaleString()} km</span></p>
          <p className="car-owners">Previous Owners: <span>{car.previous_owners ?? "N/A"}</span></p>
          <p className="car-color">Color: <span>{car.color || "N/A"}</span></p>
          <p className="car-phone">Contact: <span>{car.phone || "Not provided"}</span></p>

          <p className="car-description">{car.description || "No description available."}</p>
          
          <button className="buy-now">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
