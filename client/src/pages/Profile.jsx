// import React, { useState, useEffect } from "react";
// import Navbar from "../components/navbar";
// import { toast, Slide } from "react-toastify";
// import "./profile.css";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaWhatsapp,
//   FaAddressCard,
// } from "react-icons/fa";
// import { FcMoneyTransfer } from "react-icons/fc";

// const Profile = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [customer, setCustomer] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [sales, setSales] = useState([]);
//   const [pay, setPay] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);

//   useEffect(() => {
//     const fetchCust = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/customer", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });
//         const data = await response.json();
//         setCustomer(data.data);
//       } catch (error) {
//         console.error("Unable to fetch customers", error);
//         toast.error("Unable to fetch customers!", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Slide,
//         });
//       }
//     };
//     fetchCust();
//   }, []);

//   useEffect(() => {
//     if (selectedCustomer) {
//       const fetchSales = async () => {
//         try {
//           const name = selectedCustomer.name;
//           const query = new URLSearchParams({ name }).toString();
//           const response = await fetch(
//             `http://localhost:4000/sales/customer?${query}`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               credentials: "include",
//               cache: "no-cache",
//             }
//           );
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           const result = await response.json();
//           setSales(result.data);
//         } catch (error) {
//           console.log("Error fetching sales", error);
//         }
//       };

//       const fetchPay = async () => {
//         try {
//           const name = selectedCustomer.name;
//           const query = new URLSearchParams({ name }).toString();
//           const response = await fetch(
//             `http://localhost:4000/payment/pay?${query}`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               credentials: "include",
//               cache: "no-cache",
//             }
//           );
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           const result = await response.json();
//           setPay(result.data);
//         } catch (error) {
//           console.log("Error fetching payments", error);
//         }
//       };

//       fetchSales();
//       fetchPay();
//     }
//   }, [selectedCustomer]);

//   const handleCustomerClick = (customer) => {
//     setSelectedCustomer(customer);
//     setActiveTab("details");
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const Dashboard = () => (
//     <div>
//       <h2>Queries Dashboard</h2>
//     </div>
//   );

//   const CustomerDetails = () => {
//     if (!selectedCustomer) {
//       return <p>Select a customer to view details.</p>;
//     }

//     // Merge sales and payments, sort by date
//     const allTransactions = [
//       ...sales.map((sale) => ({ ...sale, type: "Sale" })),
//       ...pay.map((payment) => ({ ...payment, type: "Payment" })),
//     ].sort((a, b) => new Date(b.date) - new Date(a.date));

//     const currentTransactions = allTransactions.slice(
//       indexOfFirstItem,
//       indexOfLastItem
//     );

//     return (
//       <>
//         <div className="profile-container">
//           <div className="header">
//             <h1 className="customer-name">{selectedCustomer.name}</h1>
//             <div className="header-info">
//               <div className="info-item">
//                 <FaPhoneAlt className="icon" />{" "}
//                 {selectedCustomer?.contactInfo?.phone || "N/A"}{" "}
//                 <span className="add-info">Add Phone No.</span>
//               </div>
//               <div className="info-item">
//                 <FaEnvelope className="icon" />{" "}
//                 {selectedCustomer?.contactInfo?.email || "N/A"}{" "}
//                 <span className="add-info">Add Email ID</span>
//               </div>
//               <div className="info-item">
//                 <FcMoneyTransfer />
//                 <span>You'll get:</span>{" "}
//               </div>
//               <div className="info-item">
//                 <FaAddressCard className="icon" />{" "}
//                 {selectedCustomer?.contactInfo?.address || "N/A"}:{" "}
//                 <span className="add-info">Add Address</span>
//               </div>
//               <div className="icons">
//                 <FaWhatsapp className="icon-whatsapp" />
//               </div>
//             </div>
//           </div>

//           {/* Transaction Table */}
//           <div className="transaction-section">
//             <h2>Transactions</h2>
//             <table className="transaction-table">
//               <thead>
//                 <tr>
//                   <th>TYPE</th>
//                   <th>DATE</th>
//                   <th>KG</th>
//                   <th>PRICE</th>
//                   <th>TOTAL</th>
//                   <th>JAMA</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentTransactions && currentTransactions.length > 0 ? (
//                   currentTransactions.map((transaction) => (
//                     <tr key={transaction._id}>
//                       <td>{transaction.type}</td>
//                       <td>
//                         {transaction.type === "Payment"
//                           ? transaction.paymentDate
//                             ? new Date(
//                                 transaction.paymentDate
//                               ).toLocaleDateString()
//                             : "N/A"
//                           : transaction.date
//                           ? new Date(transaction.date).toLocaleDateString()
//                           : "N/A"}
//                       </td>

//                       <td>
//                         {transaction.type === "Sale"
//                           ? transaction.quantity
//                           : "-"}
//                       </td>
//                       <td>
//                         {transaction.type === "Sale"
//                           ? `₹${transaction.price}`
//                           : "-"}
//                       </td>
//                       <td>
//                         {transaction.type === "Sale"
//                           ? `₹${transaction.amount}`
//                           : "-"}
//                       </td>
//                       <td>
//                         {transaction.type === "Payment"
//                           ? `₹${transaction.amount}`
//                           : `₹${transaction.paymentDetails.paidAmount}`}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6">
//                       No transactions found for this customer.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="pagination">
//               {Array.from({
//                 length: Math.ceil(allTransactions.length / itemsPerPage),
//               }).map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => paginate(index + 1)}
//                   className={`pagination-btn ${
//                     currentPage === index + 1 ? "active" : ""
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return <Dashboard />;
//       case "details":
//         return <CustomerDetails />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex">
//         <div className="sidebar w-3/12 bg-green-700 p-2.5 h-screen">
//           <h3>Customers</h3>
//           <button className="w-9">+Add</button>
//           {customer.length > 0 ? (
//             customer.map((cust) => (
//               <div
//                 key={cust._id}
//                 className="customer-item p-2 cursor-pointer hover:bg-green-800"
//                 onClick={() => handleCustomerClick(cust)}
//               >
//                 {cust.name}
//               </div>
//             ))
//           ) : (
//             <p>No customers found.</p>
//           )}
//         </div>
//         <div className="cont w-9/12 p-4">{renderContent()}</div>
//       </div>
//     </>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { toast, Slide } from "react-toastify";
import "./profile.css";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaAddressCard } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [pay, setPay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchCust = async () => {
      try {
        const response = await fetch("http://localhost:4000/customer");
        const data = await response.json();
        setCustomer(data.data);
      } catch (error) {
        console.error("Unable to fetch customers", error);
        toast.error("Unable to fetch customers!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          theme: "dark",
          transition: Slide,
        });
      }
    };
    fetchCust();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const fetchSalesAndPayments = async () => {
        const name = selectedCustomer.name;
        try {
          const salesResponse = await fetch(`http://localhost:4000/sales/customer?name=${name}`);
          const salesData = await salesResponse.json();
          setSales(salesData.data);

          const payResponse = await fetch(`http://localhost:4000/payment/pay?name=${name}`);
          const payData = await payResponse.json();
          setPay(payData.data);
        } catch (error) {
          console.log("Error fetching data", error);
        }
      };
      fetchSalesAndPayments();
    }
  }, [selectedCustomer]);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab("details");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const CustomerDetails = () => {
    if (!selectedCustomer) return <p>Select a customer to view details.</p>;

    const allTransactions = [
      ...sales.map((sale) => ({ ...sale, type: "Sale" })),
      ...pay.map((payment) => ({ ...payment, type: "Payment" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const currentTransactions = allTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="profile-container">
        <div className="header">
          <h1 className="customer-name">{selectedCustomer.name}</h1>
          <div className="header-info">
            <div className="info-item"><FaPhoneAlt /> {selectedCustomer?.contactInfo?.phone || "N/A"}</div>
            <div className="info-item"><FaEnvelope /> {selectedCustomer?.contactInfo?.email || "N/A"}</div>
            <div className="info-item"><FcMoneyTransfer /> <span>You'll get:</span></div>
            <div className="info-item"><FaAddressCard /> {selectedCustomer?.contactInfo?.address || "N/A"}</div>
            <FaWhatsapp className="icon-whatsapp" />
          </div>
        </div>

        <h2>Transactions</h2>
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
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.type}</td>
                  <td>{transaction.type === "Sale" ? new Date(transaction.date).toLocaleDateString() : new Date(transaction.paymentDate).toLocaleDateString()}</td>
                  <td>{transaction.type === "Sale" ? transaction.quantity : "-"}</td>
                  <td>{transaction.type === "Sale" ? `₹${transaction.price}` : "-"}</td>
                  <td>{transaction.type === "Sale" ? `${transaction.amount.toLocaleString('en-IN',{maximumFractionDigits: 2,style: 'currency',currency: 'INR'})}` : "-"}</td>
                  <td>{transaction.type === "Payment" ? `${transaction.amount.toLocaleString('en-IN',{maximumFractionDigits: 2,style: 'currency',currency: 'INR'})}` : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transactions found for this customer.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: Math.ceil(allTransactions.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="sidebar">
          <h3>Customers</h3>
          <button className="add-button">+ Add</button>
          {customer.length > 0 ? (
            customer.map((cust) => (
              <div key={cust._id} className="customer-item" onClick={() => handleCustomerClick(cust)}>
                {cust.name}
              </div>
            ))
          ) : (
            <p>No customers found.</p>
          )}
        </div>
        <div className="content">{activeTab === "details" ? <CustomerDetails /> : null}</div>
      </div>
    </>
  );
};

export default Profile;
