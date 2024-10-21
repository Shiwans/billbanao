import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { toast, Slide } from "react-toastify";
import "./profile.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsappSquare,
  FaAddressCard,
  FaFileDownload
} from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import generatePDF from "../components/download";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// import html2pdf from "html2pdf.js";

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
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/customer`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
            `${process.env.REACT_APP_BACKEND_URL}/sales/customer?name=${name}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const salesData = await salesResponse.json();
          setSales(salesData.data);

          const payResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/payment/pay?name=${name}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const payData = await payResponse.json();
          setPay(payData.data);
        } catch (error) {
          console.log("Error fetching data", error);
        }
      };
      fetchSalesAndPayments();
    }
  }, [selectedCustomer, token]);

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



    function generatePDF() {
      const table = document.getElementById("profile-table"); 
      html2canvas(table, { scale: 1.5 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.9); // Compress the image
        const pdf = new jsPDF({orientation:"landscape",unit: "mm",
          format: "a4"});
          pdf.setFontSize(16);

    // Center the user's name
    const pageWidth = pdf.internal.pageSize.getWidth();
    const userName = selectedCustomer.name; // Ensure selectedCustomer is defined
    const textWidth = pdf.getStringUnitWidth(userName) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    const xPosition = (pageWidth - textWidth) / 2; // Centered X position

    pdf.text(userName, xPosition, 15); 

    // Add space below the name
    const imgYPosition = 20;

    // Calculate image dimensions
    const imgWidth = pageWidth - 20; // Set margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the canvas image to the PDF (landscape orientation)
    pdf.addImage(imgData, "JPEG", 10, imgYPosition, imgWidth, imgHeight); 
        // pdf.addImage(imgData, "PNG", 10, 10);
        pdf.save("table-content.pdf"); // This will download the PDF locally
      });
  }
  


    // function shareOnWhatsApp() {
    //   const element = document.getElementById('profile-table');
    //    // Options for generating the PDF
    // const options = {
    //   margin: 1,
    //   filename: 'table-content.pdf',
    //   html2canvas: { scale: 2 }, // Increase scale for better quality
    //   jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    // };

    // html2pdf()
    //   .from(element)
    //   .set(options)
    //   .outputPdf('blob') // Generate a Blob from the PDF
    //   .then((pdfBlob) => {
    //     const blobURL = URL.createObjectURL(pdfBlob);
    //     window.open(blobURL);
    //     // Programmatically trigger a download (optional)
    //     const link = document.createElement('a');
    //     link.href = blobURL;
    //     link.download = 'table-content.pdf';
    //     link.click();
    //     // const deployedURL = process.env.REACT_APP_FRONT_URL;
    //     const whatsappURL = `https://api.whatsapp.com/send?text=Check%20out%20this%20table%20content%20PDF:%20${encodeURIComponent(blobURL)}`;
    //     window.open(whatsappURL, '_blank');
    //     // Revoke the Blob URL after use to free up memory
    //     URL.revokeObjectURL(blobURL);
    //   });
    //   }

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
              <FcMoneyTransfer />{" "}
              <span className="info">
                You'll get:{" "}
                {selectedCustomer.totalDue.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                }) || 0}
              </span>
            </div>
            <div className="info-item">
              <FaAddressCard />{" "}
              <span className="info">
                {selectedCustomer?.contactInfo?.upi || "N/A"}
              </span>
            </div>
            {/* <FaWhatsappSquare
              className="icon-whatsapp"
              onClick={shareOnWhatsApp}
            /> */}
            <FaFileDownload 
              className="icon-download"
              onClick={generatePDF}
            />

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
