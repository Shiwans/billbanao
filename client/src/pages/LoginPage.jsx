// import React, { useState } from "react";
// import "./LoginPage.css";
// import Navbar from "../components/navbar";

// const LoginPage = () => {
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:4000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }), // Send email and password
//         credentials: "include", // If you're using cookies for authentication
//       });

//       const data = await response.json();
//       console.log("data from LoginPage", data);

//       if (response.ok) {
//         // Handle successful login
//         console.log("Login successful:", data);
//         // Store token or redirect user if needed
//       } else {
//         // Handle login failure
//         alert(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       alert("Login failed");
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     // Check if passwords match
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
//     try {
//       // Send a POST request to the registration endpoint
//       const response = await fetch("http://localhost:4000/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, email, password }), // Send name, email, and password
//       });

//       const data = await response.json();
//       console.log("data from loginRegister", data);

//       if (response.ok) {
//         // Handle successful registration
//         console.log("Registration successful:", data);
//         // Redirect user, store token, or perform another action as needed
//       } else {
//         // Handle registration failure
//         alert(data.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error("Error during registration:", error);
//       alert("Registration failed");
//     }
//   };

// //   const handleGoogleSignIn = (e) => {
// //     e.preventDefault();
// //     const response = (window.location.href =
// //       "http://localhost:5050/auth/google");
// //   };

//   return (
//     <>
//       <Navbar />
//       <div className="login-register-container">
//         <div className="login-register-card">
//           <h2>{isRegistering ? "Register" : "Login"}</h2>
//           <form onSubmit={isRegistering ? handleRegister : handleLogin}>
//             {isRegistering && (
//               <div className="input-group">
//                 <label htmlFor="name">Name:</label>
//                 <input
//                   type="text"
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>
//             )}
//             <div className="input-group">
//               <label htmlFor="email">Email:</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label htmlFor="password">Password:</label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {isRegistering && (
//               <div className="input-group">
//                 <label htmlFor="confirm-password">Confirm Password:</label>
//                 <input
//                   type="password"
//                   id="confirm-password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             )}
//             <button type="submit" className="login-button">
//               {isRegistering ? "Register" : "Login"}
//             </button>
//             {/* <button
//               className="google-signin-button"
//               onClick={handleGoogleSignIn}
//             > */}
//               {/* <img
//                 src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
//                 alt="Sign in with Google"
//                 className="google-icon"
//               />
//             </button> */}
//           </form>
//           <p className="toggle-link">
//             {isRegistering ? (
//               <>
//                 Already have an account?{" "}
//                 <button onClick={() => setIsRegistering(false)}>Login</button>
//               </>
//             ) : (
//               <>
//                 Don’t have an account?{" "}
//                 <button onClick={() => setIsRegistering(true)}>Register</button>
//               </>
//             )}
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;


import React, { useState } from "react";
import "./LoginPage.css";
import Navbar from "../components/navbar";
import { useAuth } from './auth/AuthContext'; // Importing AuthContext

const LoginPage = () => {
  const { login } = useAuth(); // Using login from AuthContext
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // For loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Reset error
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        login(data); // Update user state in AuthContext
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        // Optionally log the user in automatically after registration
        // login(data.user);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-register-container">
        <div className="login-register-card">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {error && <p className="error-message">{error}</p>} {/* Error message */}
            {isRegistering && (
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
            )}
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
            {isRegistering && (
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
            )}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
            </button>
            {/* Google Sign-In (uncomment to use) */}
            {/* <button className="google-signin-button" onClick={handleGoogleSignIn}>
              <img
                src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
                alt="Sign in with Google"
                className="google-icon"
              />
            </button> */}
          </form>
          <p className="toggle-link">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsRegistering(false)}>Login</button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button onClick={() => setIsRegistering(true)}>Register</button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
