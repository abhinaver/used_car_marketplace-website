import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { AiOutlineUser } from "react-icons/ai";
import "./Header.css";

const Header = ({ searchQuery, setSearchQuery, setSelectedModel }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [selectedModel, setModel] = useState("");
  const [username, setUsername] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    // Check for stored user information on component mount
    const storedUsername = localStorage.getItem("username");
    
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Click outside handler to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    navigate("/");
  };

  const handleModelChange = (model) => {
    setModel(model);
    setSelectedModel(model); // This ensures the selected model updates in Home.jsx
  };
  

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("username");
    
    // Reset state
    setUsername("");
    setShowProfileDropdown(false);
    
    // Navigate to home page
    navigate("/");
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo-container">
        <img 
          src={logo} 
          alt="Used Car Marketplace Logo" 
          className="logo-img" 
          onClick={() => navigate("/")} 
        />
      </div>
<div className="searchdiv">
      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form></div>

      {/* Car Model Dropdown */}
      <div className="custom-dropdown">
        <button className="dropdown-btn">
          {selectedModel || "All Models"} ▼
        </button>
        <div className="dropdown-content">
          <div onClick={() => handleModelChange("")}>All Models</div>
          <div onClick={() => handleModelChange("SUV")}>SUV</div>
          <div onClick={() => handleModelChange("Sedan")}>Sedan</div>
          <div onClick={() => handleModelChange("Hatchback")}>Hatchback</div>
          <div onClick={() => handleModelChange("Convertible")}>Convertible</div>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/sell">Sell a Car</Link></li>
      </ul>

      {/* User Authentication/Profile */}
      {username ? (
        <div className="user-profile" ref={dropdownRef}>
          <button 
            className="profile-icon" 
            onClick={toggleProfileDropdown}
          >
            <AiOutlineUser size={24} />
          </button>
          
          {showProfileDropdown && (
  <div className="profile-dropdown">
    <div className="profile-username"><strong>{username}</strong></div>
    <button onClick={() => navigate(`/my-cars/${username}`)}>My Cars</button>
    <button onClick={handleLogout}>Logout</button>
  </div>
)}
        </div>
      ) : (
        <Link to="/login" className="login-button">Login</Link>
      )}
    </nav>
  );
};

export default Header;
