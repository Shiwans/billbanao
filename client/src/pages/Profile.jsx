import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { toast, Slide } from "react-toastify";
import "./profile.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaAddressCard,
} from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchCust = async () => {
      try {
        const response = await fetch("http://localhost:4000/customer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setCustomer(data.data);
      } catch (error) {
        console.error("Unable to fetch customers", error);
        toast.error("Unable to fetch customers!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
      }
    };
    fetchCust();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const fetchSales = async () => {
        try {
          const name = selectedCustomer.name;
          const query = new URLSearchParams({ name }).toString();
          const response = await fetch(
            `http://localhost:4000/sales/customer?${query}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              cache: "no-cache", // Add this to bypass cache
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          setSales(result.data);
        } catch (error) {
          console.log("Error fetching sales", error);
        }
      };
      fetchSales();
    }
  }, [selectedCustomer]);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab("details");
  };

  const Dashboard = () => (
    <div>
      <h2>Queries Dashboard</h2>
    </div>
  );

  const CustomerDetails = () => {
    if (!selectedCustomer) {
      return <p>Select a customer to view details.</p>;
    }

    return (
      <>
        <div className="profile-container">
          {/* Header Section */}
          <div className="header">
            <h1 className="customer-name">{selectedCustomer.name}</h1>
            <div className="header-info">
              <div className="info-item">
                <FaPhoneAlt className="icon" />{" "}
                {selectedCustomer?.contactInfo?.phone || "N/A"}{" "}
                <span className="add-info">Add Phone No.</span>
              </div>
              <div className="info-item">
                <FaEnvelope className="icon" />{" "}
                {selectedCustomer?.contactInfo?.email || "N/A"}{" "}
                <span className="add-info">Add Email ID</span>
              </div>
              <div className="info-item">
                <FcMoneyTransfer />
                <span>You'll get:</span>{" "}
              </div>
              <div className="info-item">
                <FaAddressCard className="icon" />{" "}
                {selectedCustomer?.contactInfo?.address || "N/A"}:{" "}
                <span className="add-info">Add Address</span>
              </div>
              <div className="icons">
                <FaWhatsapp className="icon-whatsapp" />
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="transaction-section">
            <h2>TRANSACTIONS</h2>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>DATE</th>
                  <th>KG</th>
                  <th>PRICE</th>
                  <th>TOTAL</th>
                  <th>JAMA</th>
                </tr>
              </thead>
              <tbody>
                {sales && sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr key={sale._id}>
                      <td>Sale</td>
                      <td>{sale.date}</td>
                      <td>{sale.quantity}</td>
                      <td>₹{sale.price}</td>
                      <td>₹{sale.amount}</td>
                      <td>
                        {sale.paymentDetails.paidAmount
                          ? `₹${sale.paymentDetails.paidAmount}`
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No sales found for this customer.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "details":
        return <CustomerDetails />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="sidebar w-3/12 bg-green-700 p-2.5 h-screen">
          <h3>Customers</h3>
          <button className="w-9">+Add</button>
          {customer.length > 0 ? (
            customer.map((cust) => (
              <div
                key={cust._id}
                className="customer-item p-2 cursor-pointer hover:bg-green-800"
                onClick={() => handleCustomerClick(cust)}
              >
                {cust.name}
              </div>
            ))
          ) : (
            <p>No customers found.</p>
          )}
        </div>
        <div className="cont w-9/12 p-4">{renderContent()}</div>
      </div>
    </>
  );
};

export default Profile;
