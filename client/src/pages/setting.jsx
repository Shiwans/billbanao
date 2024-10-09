import React, { useEffect, useState } from 'react';

const Settings = () => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/user`, {
                method: 'GET',
                headers: {
                    "Content-Type":"application/json",
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then(data => {
                setUserData(data);
            })
        } else {
            window.location.href = `${process.env.REACT_APP_BACKEND_URL}/login`; // No token, redirect
        }
    }, []);

    return (
        <div>
            <h1>User Settings</h1>
            {userData ? (
                <div>
                    <p>Name: {userData.name}</p>
                    {/* <p>Name: {req.user.id}</p> */}
                    {/* <p>Email: {req.user.email}</p> */}
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
