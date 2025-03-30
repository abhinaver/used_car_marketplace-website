import React, { useState, useEffect } from "react";
import axios from "axios";
import CarCard from "../components/CarCard";
import "./Home.css";

const Home = ({ searchQuery, selectedModel }) => {
  const [cars, setCars] = useState([]);
  const [mostDemandedCars, setMostDemandedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all available cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8081/get-cars");
        setCars(response.data);
      } catch (error) {
        setError("Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Fetch most demanded cars (only when "All Models" is selected)
  useEffect(() => {
    if (!selectedModel) { // Only fetch when "All Models" is selected
      const fetchMostDemandedCars = async () => {
        try {
          const response = await axios.get("http://localhost:8081/get-cars/most-demanded");
          setMostDemandedCars(response.data);
        } catch (error) {
          console.error("Failed to fetch most demanded cars:", error);
        }
      };
      fetchMostDemandedCars();
    } else {
      setMostDemandedCars([]); // Clear most demanded cars when a specific model is selected
    }
  }, [selectedModel]);

  // Filter cars based on search query and selected model
  const filteredCars = cars.filter((car) =>
    (!selectedModel || car.model.toLowerCase() === selectedModel.toLowerCase()) &&
    (car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.price.toString().includes(searchQuery) ||
      car.year_of_production.toString().includes(searchQuery) ||
      car.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.kilometers_driven.toString().includes(searchQuery))
  );

  if (loading) return <p>Loading cars...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-container">
      {/* Most Demanded Cars Section - Show only when not searching and All Models is selected */}
      {searchQuery === "" && (!selectedModel || selectedModel === "") && (
        <div className="most-demanded-container">
          <h2>Most Demanded Cars</h2>
          <div className="car-list">
            {mostDemandedCars.length > 0 ? (
              mostDemandedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={{
                    id: car.id,
                    name: car.name,
                    price: car.price,
                    model: car.model,
                    year: car.year_of_production,
                    location: car.location,
                    color: car.color,
                    kilometers_driven: car.kilometers_driven,
                    image: car.image_url,
                  }}
                />
              ))
            ) : (
              <p>No most demanded cars found.</p>
            )}
          </div>
        </div>
      )}
  
      {/* Available Cars Section - Apply search filter only here */}
      <h2>Available Cars</h2>
      {filteredCars.length > 0 ? (
        <div className="car-list">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={{
                id: car.id,
                name: car.name,
                price: car.price,
                model: car.model,
                year: car.year_of_production,
                location: car.location,
                color: car.color,
                kilometers_driven: car.kilometers_driven,
                image: car.image_url,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="no-results">No cars found for "{searchQuery}"</p>
      )}
    </div>
  );
  
};

export default Home;
