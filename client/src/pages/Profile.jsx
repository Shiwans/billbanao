import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { toast, Slide } from "react-toastify";
import "./profile.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsappSquare,
  FaAddressCard,
} from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import html2pdf from 'html2pdf.js';


const Profile = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [pay, setPay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchCust = async () => {
      try {
        const response = await fetch("http://localhost:4000/customer",{
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`,
          }
        });
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
  }, [token]);

  useEffect(() => {
    if (selectedCustomer) {
      const fetchSalesAndPayments = async () => {
        const name = selectedCustomer.name;
        try {
          const salesResponse = await fetch(
            `http://localhost:4000/sales/customer?name=${name}`
          ,{
            headers:{
              "Content-Type":"application/json",
              Authorization: `Bearer ${token}`,

            }
          });
          const salesData = await salesResponse.json();
          setSales(salesData.data);

          const payResponse = await fetch(
            `http://localhost:4000/payment/pay?name=${name}`
          ,{
            headers:{
              "Content-Type":"application/json",
              Authorization: `Bearer ${token}`,

            }});
          const payData = await payResponse.json();
          setPay(payData.data);
        } catch (error) {
          console.log("Error fetching data", error);
        }
      };
      fetchSalesAndPayments();
    }
  }, [selectedCustomer,token]);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab("details");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const CustomerDetails = () => {
    if (!selectedCustomer)
      return <p className="text-white">Select a customer to view details.</p>;

    const allTransactions = [
      ...sales.map((sale) => ({ ...sale, type: "Sale" })),
      ...pay.map((payment) => ({ ...payment, type: "Payment" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const currentTransactions = allTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );


    // function generatePDF() {
    //   const table = document.getElementById("profile-table"); // Replace 'yourTableId' with the actual table ID
    //   html2canvas(table).then((canvas) => {
    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF();
    //     pdf.addImage(imgData, "PNG", 10, 10);
    //     pdf.save("table-content.pdf"); // This will download the PDF locally
    //   });
    // }

    function shareOnWhatsApp() {
      const element = document.getElementById('profile-table');
       // Options for generating the PDF
  const options = {
    margin: 1,
    filename: 'table-content.pdf',
    html2canvas: { scale: 2 }, // Increase scale for better quality
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  // Generate PDF directly from the HTML element
  html2pdf()
    .from(element)
    .set(options)
    .outputPdf('blob') // Generate a Blob from the PDF
    .then((pdfBlob) => {
      // Create an Object URL for the Blob
      const blobURL = URL.createObjectURL(pdfBlob);

      // Open the generated PDF in a new tab (optional)
      window.open(blobURL);

      // Programmatically trigger a download (optional)
      const link = document.createElement('a');
      link.href = blobURL;
      link.download = 'table-content.pdf';
      link.click();

      // Share via WhatsApp
      const whatsappURL = `https://api.whatsapp.com/send?text=Check%20out%20this%20table%20content%20PDF:%20${encodeURIComponent(blobURL)}`;
      window.open(whatsappURL, '_blank');

      // Revoke the Blob URL after use to free up memory
      URL.revokeObjectURL(blobURL);
    });
    }
    

    return (
      <div className="profile-container">
        <div className="header">
          <h1 className="customer-name">{selectedCustomer.name}</h1>
          <div className="header-info">
            <div className="info-item">
              <FaPhoneAlt />
              <span className="info">
                {selectedCustomer?.contactInfo?.phone || "N/A"}
              </span>
            </div>
            <div className="info-item">
              <FaEnvelope />{" "}
              <span className="info">
                {selectedCustomer?.contactInfo?.email || "N/A"}
              </span>
            </div>
            <div className="info-item">
              <FcMoneyTransfer /> <span className="info">You'll get:</span>
            </div>
            <div className="info-item">
              <FaAddressCard />{" "}
              <span className="info">
                {selectedCustomer?.contactInfo?.upi || "N/A"}
              </span>
            </div>
            <FaWhatsappSquare className="icon-whatsapp" onClick={shareOnWhatsApp}/>
          </div>
        </div>

        <h2 className="font-bold text-lg">Transactions</h2>
        <table className="transaction-table font-normal	" id="profile-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Jama</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.type}</td>
                  <td>
                    {transaction.type === "Sale"
                      ? new Date(transaction.date).toLocaleDateString()
                      : new Date(transaction.paymentDate).toLocaleDateString()}
                  </td>
                  <td>
                    {transaction.type === "Sale" ? transaction.quantity : "-"}
                  </td>
                  <td>
                    {transaction.type === "Sale"
                      ? `₹${transaction.price}`
                      : "-"}
                  </td>
                  <td>
                    {transaction.type === "Sale"
                      ? `${transaction.amount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "INR",
                        })}`
                      : "-"}
                  </td>
                  <td>
                    {transaction.type === "Payment"
                      ? `${transaction.amount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "INR",
                        })}`
                      : "-"}
                  </td>
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
          {Array.from({
            length: Math.ceil(allTransactions.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`pagination-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
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
          <h1 className="text-lg font-medium">Customers</h1>
          {/* <button className="add-button" to="/customer">+ Add</button> */}
          <div className="mt-4">
            {customer.length > 0 ? (
              customer.map((cust) => (
                <div
                  key={cust._id}
                  className="customer-item"
                  onClick={() => handleCustomerClick(cust)}
                >
                  {cust.name}
                </div>
              ))
            ) : (
              <p>No customers found.</p>
            )}
          </div>
        </div>
        <div className="content">
          {activeTab === "details" ? <CustomerDetails /> : null}
        </div>
      </div>
    </>
  );
};

export default Profile;
