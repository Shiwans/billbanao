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
import Data from "./pages/Data"
import Today from "./pages/Today";
import Profile from "./pages/Profile";
import './App.css'

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/report" element={<Reports />} />
          <Route path="/data" element={<Data />} />
          <Route path="/today" element={<Today />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile" element={<Profile />} />

          {/* <Route path="/login" element={<Login />} /> for later where there will be functionality for multiple user*/}
        </Routes>
      </div>
    </div>
  );
};

export default App;
