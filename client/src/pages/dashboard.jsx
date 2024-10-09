import React, { useEffect, useState } from "react";
import "./dashboard.css"; 
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState({
    salesAmount: 0,
    purchaseAmount: 0,
    totalKg: 0,
    custCount: 0,
    receivableAmount: 0,
    payableAmount: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("Authentication token missing");
      navigate("/login"); 
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        console.log(result); // Debugging purposes, log the result from backend
        setData({
          salesAmount: result.salesAmount,
          purchaseAmount: result.purchaseAmount,
          totalKg: result.totalKg,
          custCount: result.custCount,
          receivableAmount: result.receivableAmount,
          payableAmount: result.payableAmount,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="dashboard">
      <div className="row">
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Total Sales</h3>
            <p className="count text-2xl	">
              {data.salesAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
            <p className="description">Total Sale Amount (Till Now)</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Customer Count</h3>
            <p className="count text-2xl	">{data.custCount} Customers</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Receivable Amount</h3>
            <p className="amount text-2xl	">
              {data.receivableAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
            <p className="description">Total Amount You Will Receive</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Total Purchases</h3>
            <p className="count text-2xl	">
              {data.purchaseAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
            <p className="description">Total Purchase Amount</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Total Kg</h3>
            <p className="count text-2xl	">{data.totalKg} Kg Sold</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Payable Amount</h3>
            <p className="amount text-red-600	text-2xl		">
              {data.payableAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </p>
            <p className="description">Total Payable Amount</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
