// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            // Attempt to retrieve the user profile if already logged in
            try {
                const response = await axios.get('http://localhost:4000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                setUser(null); // User is not logged in
            }
        };
        if (token) {
            checkSession();
        }
    }, [token]);

    const login = async (userData) => {
        setUser(userData.user);
        setToken(userData.token); // Store the token
        localStorage.setItem('token', userData.token); // Optional: Store in local storage
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); // Optional: Remove from local storage
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
