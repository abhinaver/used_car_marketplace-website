import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyCars.css";

const MyCars = () => {
    const { username } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/user-cars/${username}`)
        .then((response) => {
            setCars(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("❌ Error fetching user cars:", error);
            setError(error.response?.data?.error || "Failed to fetch cars.");
            setLoading(false);
        });
}, [username]);

  const handleEdit = (id) => {
    navigate(`/edit-car/${id}`); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
        await axios.delete(`http://localhost:8081/delete-car/${username}/${id}`);
        setCars(cars.filter(car => car.id !== id));
    } catch (error) {
        console.error("❌ Error deleting car:", error);
        alert("Failed to delete car.");
    }
};
  if (loading) return <p>Loading your listed cars...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!cars.length) return <p>No cars listed by you.</p>;

  return (
    <div className="my-cars-container">
      <h2>My Listed Cars</h2>
      <div className="cars-list">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img 
              src={car.image_url || "https://via.placeholder.com/300"} 
              alt={car.name} 
              onError={(e) => e.target.src = "https://via.placeholder.com/300"} 
            />
            <h3>{car.name}</h3>
            <p><strong>Price:</strong> ₹{car.price.toLocaleString()}</p>
            <p><strong>Location:</strong> {car.location}</p>
            <p><strong>Model:</strong> {car.model} ({car.year_of_production})</p>

            {/* Buttons for Edit & Delete */}
            <div className="car-actions">
              <button className="edit-btn" onClick={() => handleEdit(car.id)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(car.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCars;
