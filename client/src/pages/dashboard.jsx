import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Import custom CSS for styling

const Dashboard = () => {
  const [data, setData] = useState({
    salesAmount: 50000,
    salesCount: 49,
    purchaseAmount: 30000,
    userCount: 10,
    receivableAmount: 10000,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("/api/sales/september", {
    //       headers: {
    //         // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //       }
    //     });

    //     if (!response.ok) throw new Error('Failed to fetch data');

    //     const result = await response.json();
    //     setData(result);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // fetchData();
  }, []);
  return (
    <div className="dashboard">
      <div className="row">
        {/* Sale Section */}
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Sale</h3>
            <p className="amount">{data.salesAmount.toLocaleString('en-IN',{maximumFractionDigits: 2,style: 'currency',currency: 'INR'})}</p>
            <p className="description">Total Sale (Sep)</p>
            {/* <p className="growth">0% This Month Growth</p> */}
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Sale's Count</h3>
            <p className="count">{data.salesCount} Sales</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">You'll Get</h3>
            <p className="amount">{data.receivableAmount.toLocaleString('en-IN',{maximumFractionDigits: 2,style: 'currency',currency: 'INR'})}</p>
            <p className="description">Shiwans Vaishya</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Purchase</h3>
            <p className="amount">{data.purchaseAmount.toLocaleString('en-IN',{maximumFractionDigits: 2,style: 'currency',currency: 'INR'})}</p>
            <p className="description">This Month</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">User Count</h3>
            <p className="count">{data.userCount} Users</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">You'll Receive</h3>
            <p className="amount">{data.receivableAmount.toLocaleString('en-IN',{maximumFractionDigits: 2,style: 'currency',currency: 'INR'})}</p>
            <p className="description">Shiwans Vaishya</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
