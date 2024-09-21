// import React, { useState, useEffect } from "react";
// import Navbar from "../components/navbar";
// import "./Data.css";
// import MonthDaysDropdown from "../components/MonthDaysDropdown";
// import Card from "react-bootstrap/Card";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { toast, Slide } from "react-toastify";

// const Data = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [customerList, setCustomerList] = useState([]);
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/customer", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });
//         const result = await response.json();
//         setCustomerList(result.data);
//       } catch (error) {
//         console.error("unable to fetch customer list", error);
//         setCustomerList([]);
//       }
//     };
//     fetchCustomers();
//   }, []);

//   const handleEdit = async(id) => {
//     try{
//       const response = await fetch(`http://localhost:4000/customer/${id}`,{
//         method:"PUT",
//         headers:{
//           "Content-Type":"application/json",
//         },credentials:"include",
//       })
//       console.log('response from data',response)
//     }catch(error){
//      console.log(error) 
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:4000/customer/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });
//       if (response.ok) {
//         setCustomerList(customerList.filter((customer) => customer._id !== id));
//         toast.success("Customer deleted successfully!", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           theme: "light",
//           transition: Slide,
//         });
//       } else {
//         toast.error("Error deleting customer!", {
//           position: "top-right",
//           autoClose: 1000,
//           theme: "light",
//           transition: Slide,
//         });
//       }
//     } catch (error) {
//       console.error("Error deleting customer", error);
//       toast.error("Error deleting customer!", {
//         position: "top-right",
//         autoClose: 1000,
//         theme: "light",
//         transition: Slide,
//       });
//     }
//   };


//   const Dashboard = () => {
//     return (
//       <div className="dashboard">
//         <h2>queries Dashboard</h2>
//         <MonthDaysDropdown />
//       </div>
//     );
//   };

//   const ManageUsers = () => {
//     return (
//       <div className="manage-users">
//         <div className="filter">
//           <div class="search-container">
//             <input type="text" placeholder="Search..." class="search-input" />
//             <button class="search-button">
//               <img
//                 src="https://img.icons8.com/material-outlined/24/000000/search.png"
//                 alt="Search"
//               />
//             </button>
//           </div>
//           <div class="filter-container">
//             <label for="filter-select">Filter By:</label>
//             <select id="filter-select" class="filter-select">
//               <option value="name">Name</option>
//               <option value="location">Location</option>
//               <option value="date">Date</option>
//             </select>
//           </div>
//         </div>
//         <h2>Manage Users</h2>
//         <p>Here you can manage all registered users.</p>
//         {/* Add user management content here */}
//       </div>
//     );
//   };

//   const Settings = () => {
//     return (
//       <div className="flex flex-wrap">
//         {customerList.length > 0 ? (
//           customerList.map((customer) => (
//             <Card style={{ width: "18rem" }}>
//               <Card.Body>
//                 <Card.Title>{customer.name}</Card.Title>
//                 <Card.Subtitle className="mb-2 text-muted">
//                   {customer.contactInfo.phone}
//                 </Card.Subtitle>
//                 <Card.Text>
//                   {customer.contactInfo.email} <br />
//                   {customer.totalAmount}<br />
//                   {customer.totalJama}<br />
//                   {customer.totalDue}<br />
//                 </Card.Text>
//                 <Card.Subtitle className="mb-2 text-muted text-sm">
//                   {customer.createdAt}
//                 </Card.Subtitle>
//                 <div className="absolute top-1 right-4">
//                   <button className="block px-1 m-1 bg-yellow-400 rounded" onClick={()=>handleEdit(customer._id)}>
//                     <FaRegEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(customer._id)}
//                     className="px-1 m-1 bg-red-500 rounded"
//                   >
//                     <MdDelete />
//                   </button>
//                 </div>
//               </Card.Body>
//             </Card>
//           ))
//         ) : (
//           <option disabled>No customers found</option>
//         )}
//       </div>
//     );
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return <Dashboard />;
//       case "manageUsers":
//         return <ManageUsers />;
//       case "settings":
//         return <Settings />;
//       default:
//         return <Dashboard />;
//     }
//   };
//   return (
//     <div>
//       <Navbar />
//       <div className="admin-container">
//         <div className="sidebar">
//           <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
//           <button onClick={() => setActiveTab("manageUsers")}>
//             Manage Users
//           </button>
//           <button onClick={() => setActiveTab("settings")}>Settings</button>
//         </div>
//         <div className="content">{renderContent()}</div>
//       </div>
//     </div>
//     // <MonthDaysDropdown />
//   );
// };

// export default Data;


import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Data.css";  // Ensure to add relevant styling here
import { toast, Slide } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Reports = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [salesData, setSalesData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalJama, setTotalJama] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch sales data here based on selected dates
      // For now, this is just mock data
      const fetchedData = [
        { id: 1, name: "Customer 1", sold: 1000, jama: 800 },
        { id: 2, name: "Customer 2", sold: 1500, jama: 1500 },
      ];
      setSalesData(fetchedData);

      const totalSold = fetchedData.reduce((acc, item) => acc + item.sold, 0);
      const totalJama = fetchedData.reduce((acc, item) => acc + item.jama, 0);
      setTotalAmount(totalSold);
      setTotalJama(totalJama);
    };

    fetchData();
  }, [startDate, endDate]);

  // Button handlers for setting date ranges
  const setLastDay = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    setStartDate(yesterday);
    setEndDate(today);
  };

  const setLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    setStartDate(lastMonth);
    setEndDate(today);
  };

  return (
    <div>
      <Navbar />
      <div className="reports-container">
        <div className="date-filters">
          <label>Select Date Range:</label>
          <div className="date-picker-container">
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            <span> to </span>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          </div>
          <div className="preset-buttons">
            <button onClick={setLastDay}>Last Day</button>
            <button onClick={setLastWeek}>Last Week</button>
            <button onClick={setLastMonth}>Last Month</button>
          </div>
        </div>

        <div className="table-container">
          <h2>Sales Report</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount Sold</th>
                <th>Jama (Received)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length > 0 ? (
                salesData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.sold}</td>
                    <td>{item.jama}</td>
                    <td>
                      <button className="edit-btn">
                        <FaRegEdit />
                      </button>
                      <button className="delete-btn">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="totals">
          <div>Total Amount Sold: <span>{totalAmount}</span></div>
          <div>Total Jama: <span>{totalJama}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Reports;


