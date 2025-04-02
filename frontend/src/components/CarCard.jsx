import React from "react";
import { useNavigate } from "react-router-dom";
import "./CarCard.css";

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  const handleViewDetails = (carId) => {
    fetch(`http://localhost:8081/get-cars/increment-clicks/${carId}`, {  
      method: "POST",
    }).catch((error) => console.error("Error updating clicks:", error));

    navigate(`/car/${carId}`);
  };

  return (
    <div className="car-card">
      {car.image ? (
        <img src={car.image} alt={car.name} className="car-image" />
      ) : (
        <p className="no-image">Image not available</p>
      )}
      <div className="car-details">
        <h2 className="car_name">{car.name}</h2>
        <p className="car_price">Price: ₹{car.price}</p>
        <p className="car_location">Location: {car.location ?? "Not specified"}</p>
      </div>
      <button className="view-button" onClick={() => handleViewDetails(car.id)}>View Details</button>
    </div>
  );
};

export default CarCard;
