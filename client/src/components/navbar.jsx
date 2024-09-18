// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Create a CSS file for styling

const Navbar = () => {
  return (
    <div className="navbar">
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/customer">Customer</Link></li>
        <li><Link to="/supplier">Supplier</Link></li>
        <li><Link to="/expense">Expense</Link></li>
        <li><Link to="/sale">Sale</Link></li>
        <li><Link to="/payment">Payment</Link></li>
        <li><Link to="/report">Reports</Link></li>
        <li><Link to="/data">Data</Link></li>
        <li><Link to="/today">Today</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
