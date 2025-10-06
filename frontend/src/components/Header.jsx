import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { AiOutlineUser } from "react-icons/ai";
import "./Header.css";

const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedPriceRange, 
  setSelectedPriceRange,
  
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [username, setUsername] = React.useState("");
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

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
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img 
          src={logo} 
          alt="Used Car Marketplace Logo" 
          className="logo-img" 
          onClick={() => navigate("/")} 
        />
      </div>

      <div className="searchdiv">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Price Filter Dropdown */}
      <div className="custom-dropdown">
        <button className="dropdown-btn">
          {selectedPriceRange || "All Prices"}
        </button>
        <div className="dropdown-content">
          <button onClick={() => setSelectedPriceRange("")}>All Prices</button>
          <button onClick={() => setSelectedPriceRange("<500000")}>Below ₹500,000</button>
          <button onClick={() => setSelectedPriceRange("500000-1500000")}>₹500,000 - ₹1,500,000</button>
          <button onClick={() => setSelectedPriceRange("1500000-2500000")}>₹1,500,000 - ₹2,500,000</button>
          <button onClick={() => setSelectedPriceRange(">2500000")}>Above ₹2,500,000</button>
        </div>
      </div>

      
    

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/sell">Sell a Car</Link></li>
      </ul>

      {username ? (
        <div className="user-profile" ref={dropdownRef}>
          <button className="profile-icon" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <AiOutlineUser size={24} />
          </button>
          
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="profile-username"><strong>{username}</strong></div>
              <button onClick={() => navigate(`/my-cars/${username}`)}>My Cars</button>
              <button onClick={() => { 
  localStorage.removeItem("username"); 
  localStorage.removeItem("isAdmin"); 
  setUsername(""); 
  window.location.href = "/";
}}>
  Logout
</button>

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
