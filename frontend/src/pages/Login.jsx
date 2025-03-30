import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";  
import { jwtDecode } from "jwt-decode";  
import "./Login.css";
import { FcGoogle } from "react-icons/fc";  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8081/login", { email, password })
      .then((response) => {
        console.log(response.data);
        if (response.data.message) {
          localStorage.setItem("username", response.data.user?.username || "");
          navigate("/");
          window.location.reload();
        } else {
          alert("Invalid Credentials");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Login Failed. Try Again.");
      });
  };

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Google User:", decoded);

    axios
      .post("http://localhost:8081/google-login", { token: credentialResponse.credential })
      .then((response) => {
        localStorage.setItem("username", decoded.name);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Google Login Failed:", error);
        alert("Google Login Failed. Try Again.");
      });
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>

        <div className="divider">
          <span>or</span>
        </div>

        {/* Google Login Button */}
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Login Failed")} />

        {/* Sign-up Link */}
        <p className="signup-text">
          Don't have an account? <a href="#" onClick={handleSignupClick}>Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
