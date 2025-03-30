import React, { useState } from "react";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Signup Response:", data); // Debugging

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Signup successful! Redirecting...");
        localStorage.setItem("username", formData.name);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    alert("Google Signup Clicked!"); // Placeholder function
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        
        {/* Name */}
        <div className="input-group">
          <AiOutlineUser className="icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name} // ✅ FIXED
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <AiOutlineMail className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email} // ✅ FIXED
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <AiOutlineLock className="icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password} // ✅ FIXED
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <AiOutlineLock className="icon" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword} // ✅ FIXED
            onChange={handleChange}
            required
          />
        </div>

        {/* Error & Success Messages */}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {/* Submit Button */}
        <button type="submit" className="signup-button">
          Sign Up
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        {/* Google Signup Button */}
        <button type="button" className="google-button" onClick={handleGoogleSignup}>
          <FcGoogle size={20} style={{ marginRight: "8px" }} />
          Continue with Google
        </button>

        {/* Login Link */}
        <p className="login-text">
          Already have an account? <span onClick={() => navigate("/login")} className="login-link">Log in</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
