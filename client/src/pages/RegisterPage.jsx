// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './RegisterPage.css'; // Assuming you have a CSS file for styling

// const RegisterPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             await fetch('http://localhost:4000/register', { email, password });
//             navigate('/login'); // Redirect to login after successful registration
//         } catch (error) {
//             setError('Registration failed. Please try again.'); // Set error message
//             console.error('Registration failed', error);
//         } finally {
//             setLoading(false); // Reset loading state
//         }
//     };

//     return (
//         <div className="register-container">
//             <h2>Register</h2>
//             {error && <p className="error-message">{error}</p>}
//             <form onSubmit={handleRegister}>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Registering...' : 'Register'}
//                 </button>
//             </form>
//             <p>
//                 Already have an account? <a href="/login">Login</a>
//             </p>
//         </div>
//     );
// };

// export default RegisterPage;
