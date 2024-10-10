import React, { useState } from "react";
import "./RegisterPage.css";
import Navbar from "../components/navbar";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [loading, setLoading] = useState(false); 
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        // Optionally redirect or notify the user
      } else {
        setErrorMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-register-container">
        <div className="login-register-card">
          <h2>Register</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
          <form onSubmit={ handleRegister}>
              <div className="input-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Processing..." : ( "Register")}
            </button>
          </form>
          <p className="toggle-link">
            {
              <>
                Already have an account?{" "}
                <button type="button" onClick={()=>navigate('/login')}>Login</button>
              </>
            }
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
