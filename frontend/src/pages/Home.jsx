import React, { useState, useEffect } from "react";
import axios from "axios";
import CarCard from "../components/CarCard";
import "./Home.css";

const Home = ({ searchQuery, selectedPriceRange }) => {
  const [cars, setCars] = useState([]);
  const [mostDemandedCars, setMostDemandedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8081/get-cars");
        setCars(response.data.map(car => ({
          ...car,
          image: car.image_url, // ✅ Ensuring correct image property
        })));
      } catch (error) {
        setError("Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    if (!selectedPriceRange) { 
      const fetchMostDemandedCars = async () => {
        try {
          const response = await axios.get("http://localhost:8081/get-cars/most-demanded");
          setMostDemandedCars(response.data.map(car => ({
            ...car,
            image: car.image_url, // ✅ Ensuring correct image property
          })));
        } catch (error) {
          console.error("Failed to fetch most demanded cars:", error);
        }
      };
      fetchMostDemandedCars();
    } else {
      setMostDemandedCars([]);
    }
  }, [selectedPriceRange]);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.price.toString().includes(searchQuery) ||
      car.year_of_production.toString().includes(searchQuery) ||
      car.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.color.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (selectedPriceRange) {
      const price = car.price;
      switch (selectedPriceRange) {
        case "<500000":
          matchesPrice = price < 500000;
          break;
        case "500000-1500000":
          matchesPrice = price >= 500000 && price <= 1500000;
          break;
        case "1500000-2500000":
          matchesPrice = price >= 1500000 && price <= 2500000;
          break;
        case ">2500000":
          matchesPrice = price > 2500000;
          break;
        default:
          matchesPrice = true;
      }
    }

    return matchesSearch && matchesPrice;
  });

  if (loading) return <p>Loading cars...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-container">
      {searchQuery === "" && (!selectedPriceRange || selectedPriceRange === "") && (
        <div className="most-demanded-container">
          <h2>Most Demanded Cars</h2>
          <div className="car-list">
            {mostDemandedCars.length > 0 ? (
              mostDemandedCars.map((car) => <CarCard key={car.id} car={car} />)
            ) : (
              <p>No most demanded cars found.</p>
            )}
          </div>
        </div>
      )}

      <h2>Available Cars</h2>
      {filteredCars.length > 0 ? (
        <div className="car-list">
          {filteredCars.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      ) : (
        <p className="no-results">No cars found for "{searchQuery}"</p>
      )}
    </div>
  );
};

export default Home;
