import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Data.css";
import MonthDaysDropdown from "../components/MonthDaysDropdown";
import Card from "react-bootstrap/Card";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast, Slide } from "react-toastify";

const Data = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customerList, setCustomerList] = useState([]);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:4000/customer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();
        setCustomerList(result.data);
      } catch (error) {
        console.error("unable to fetch customer list", error);
        setCustomerList([]);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = () => {};

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/customer/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        setCustomerList(customerList.filter((customer) => customer._id !== id));
        toast.success("Customer deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          theme: "light",
          transition: Slide,
        });
      } else {
        toast.error("Error deleting customer!", {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Error deleting customer", error);
      toast.error("Error deleting customer!", {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
        transition: Slide,
      });
    }
  };


  const Dashboard = () => {
    return (
      <div className="dashboard">
        <h2>queries Dashboard</h2>
        <MonthDaysDropdown />
      </div>
    );
  };

  const ManageUsers = () => {
    return (
      <div className="manage-users">
        <div className="filter">
          <div class="search-container">
            <input type="text" placeholder="Search..." class="search-input" />
            <button class="search-button">
              <img
                src="https://img.icons8.com/material-outlined/24/000000/search.png"
                alt="Search"
              />
            </button>
          </div>
          <div class="filter-container">
            <label for="filter-select">Filter By:</label>
            <select id="filter-select" class="filter-select">
              <option value="name">Name</option>
              <option value="location">Location</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
        <h2>Manage Users</h2>
        <p>Here you can manage all registered users.</p>
        {/* Add user management content here */}
      </div>
    );
  };

  const Settings = () => {
    return (
      <div className="flex flex-wrap">
        {customerList.length > 0 ? (
          customerList.map((customer) => (
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{customer.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {customer.contactInfo.phone}
                </Card.Subtitle>
                <Card.Text>
                  {customer.contactInfo.email} <br />
                  {customer.contactInfo.address}
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted text-sm">
                  {customer.createdAt}
                </Card.Subtitle>
                <div className="absolute top-1 right-4">
                  <button className="block px-1 m-1 bg-yellow-400 rounded">
                    <FaRegEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="px-1 m-1 bg-red-500 rounded"
                  >
                    <MdDelete />
                  </button>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <option disabled>No customers found</option>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "manageUsers":
        return <ManageUsers />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <div className="sidebar">
          <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveTab("manageUsers")}>
            Manage Users
          </button>
          <button onClick={() => setActiveTab("settings")}>Settings</button>
        </div>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
    // <MonthDaysDropdown />
  );
};

export default Data;
