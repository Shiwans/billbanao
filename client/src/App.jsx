import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Customer from "./pages/customer";
import Supplier from "./pages/supplier";
import Sale from "./pages/sale";
import Payment from "./pages/payment";
import Reports from "./pages/reports";
import Navbar from "./components/navbar";
import NotFound from "./pages/NotFound";
import Data from "./pages/Data";
import Today from "./pages/Today";
import Profile from "./pages/Profile";
import Settings from './pages/setting';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import ProtectedRoute from './protectedRoute'; // Import the ProtectedRoute component

import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="maincontent">
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/customer" element={<ProtectedRoute element={<Customer />} />} />
          <Route path="/supplier" element={<ProtectedRoute element={<Supplier />} />} />
          <Route path="/sale" element={<ProtectedRoute element={<Sale />} />} />
          <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />
          <Route path="/report" element={<ProtectedRoute element={<Reports />} />} />
          <Route path="/data" element={<ProtectedRoute element={<Data />} />} />
          <Route path="/today" element={<ProtectedRoute element={<Today />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/setting" element={<ProtectedRoute element={<Settings />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
