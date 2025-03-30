import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-logo">
            <h2>Used Car Marketplace</h2>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com"><FaFacebookF /></a>
            <a href="https://www.x.com"><FaTwitter /></a>
            <a href="https://www.instagram.com"><FaInstagram /></a>
            <a href="https://www.youtube.com"><FaYoutube /></a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <div>
            <h4>Popular Locations</h4>
            <ul>
              <li><a href="#">Kolkata</a></li>
              <li><a href="#">Mumbai</a></li>
              <li><a href="#">Chennai</a></li>
              <li><a href="#">Pune</a></li>
            </ul>
          </div>
          <div>
            <h4>Trending Locations</h4>
            <ul>
              <li><a href="#">Hyderabad</a></li>
              <li><a href="#">Bangalore</a></li>
              <li><a href="#">Delhi</a></li>
              <li><a href="#">Ahmedabad</a></li>
            </ul>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>© 2025 Used Car Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
