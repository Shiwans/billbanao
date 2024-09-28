import React, { useEffect, useState } from 'react';

const Settings = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            fetch('http://localhost:4000/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch user data');
            })
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                console.error('Error:', error);
                // Optionally redirect to login if token is invalid
                window.location.href = 'http://localhost:3000/login'; // Adjust as needed
            });
        } else {
            window.location.href = 'http://localhost:3000/login'; // No token, redirect
        }
    }, []);

    return (
        <div>
            <h1>User Settings</h1>
            {userData ? (
                <div>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    {/* Display other user info as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Settings;
