import React, { useState } from "react";
import "./LoginPage.css";
import Navbar from "../components/navbar";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email and password are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Adjust this line based on your server response structure
      navigate('/customer');
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Navbar />
      <div className="login-register-container">
        <div className="login-register-card">
          <h2>{ "Login"}</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Processing..." : ( "Login")}
            </button>
          </form>
          <p className="toggle-link">
              <>
                Don't have an account?{" "}
                <button type="button" onClick={() => (navigate('/register'))}>Register</button>
              </>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
