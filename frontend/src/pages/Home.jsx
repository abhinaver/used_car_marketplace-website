import React, { useState, useEffect } from "react";
import axios from "axios";
import CarCard from "../components/CarCard";
import AdminPanel from "../components/AdminPanel"; // new component
import "./Home.css";

const Home = ({ searchQuery, selectedPriceRange, selectedKilometersRange }) => {
  const [cars, setCars] = useState([]);
  const [mostDemandedCars, setMostDemandedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const [username, setUsername] = useState(localStorage.getItem("username") || "");
const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
useEffect(() => {
  const handleStorageChange = () => {
    setUsername(localStorage.getItem("username") || "");
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);



console.log("isAdmin in Home.jsx:", isAdmin); // 🔹 Debug

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8081/get-cars");
        setCars(
          response.data.map((car) => ({
            ...car,
            image: car.image_url || "fallback-image.jpg",
          }))
        );
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
            image: car.image_url,
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
      {/* Show admin panel if the user is admin */}
      {isAdmin && (
  <AdminPanel
  
  />
)}



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
      <p className="car-count">
        Showing {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"} matching your filters
      </p>
      {filteredCars.length > 0 ? (
        <div className="car-list">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className="no-results">No cars found for "{searchQuery}"</p>
      )}
    </div>
  );
};

export default Home;
