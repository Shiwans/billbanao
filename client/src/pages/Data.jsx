//DATA
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Data.css";
import { toast, Slide } from "react-toastify";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalJama, setTotalJama] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [averagePrice, setAveragePrice] = useState([]);
  const [totalDue, setTotalDue] = useState([]);
  const [profitOrLoss, setProfitOrLoss] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/customer`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const result = await response.json();
        setCustomerList(result.data);
      } catch (error) {
        console.error("unable to fetch customer list", error);
        setCustomerList([]);
      }
    };
    fetchCustomers();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!startDate || !endDate) {
          toast.info("Select options!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          });
        }
        const formattedStartDate = startDate
          ? new Date(startDate).toISOString().split("T")[0]
          : "";
        const formattedEndDate = endDate
          ? new Date(endDate).toISOString().split("T")[0]
          : "";
        if (startDate && endDate) {
          if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start date cannot be later than end date!");
            return;
          }
          const queryParams = new URLSearchParams({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          }).toString();
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/sales?${queryParams}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );
          const data = await response.json();
          console.log("this is going to be stored in sales data", data);
          setSalesData(data.data);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [startDate, endDate, token]);

  useEffect(() => {
    console.log("Current name for filtering:", name); // Log the name being filtered
    console.log("Current sales data:", salesData);
    if (!name) {
      setFilteredData(salesData);
      return;
    }

    // Filter sales data based on selected customer name
    const filteredList = salesData.filter((sale) => sale.name === name);
    console.log("Filtered data:", filteredList); // Log the filtered data
    setFilteredData(filteredList);
  }, [name, salesData]);
  useEffect(() => {
    // if (!Array.isArray(filteredData)) return;
    const totalSold = filteredData.reduce(
      (acc, item) => acc + (item.amount || 0),
      0
    );
    const totalPaid = filteredData.reduce(
      (acc, item) => acc + (item.paymentDetails?.paidAmount || 0),
      0
    );
    const totalQuantity = filteredData.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
    const totalPurchase = filteredData.reduce(
      (acc, item) => acc + (item.purchaseAmount || 0), // Assuming purchaseAmount exists
      0
    );

    const averagePrice = totalQuantity > 0 ? totalSold / totalQuantity : 0;
    const totalDue = totalSold - totalPaid;
    const profitOrLoss = totalSold - totalPurchase;

    setTotalAmount(totalSold);
    setTotalJama(totalPaid);
    setAveragePrice(averagePrice);
    setTotalDue(totalDue);
    setProfitOrLoss(profitOrLoss);
  }, [filteredData]);

  // Button handlers for setting date ranges
  const setToday = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setStartDate(today);
    setEndDate(tomorrow);
  };

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

  // const handleDelete = async(id) => {
  //   try {
  //     const response = await fetch(`http://localhost:4000/sales/${id}`,{
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });
  //     if (response.ok) {
  //       setFilteredData((prevCust) => prevCust.filter((customer) => customer._id !== id));
  //       toast.success("Sale deleted successfully!", {position: "top-right",autoClose: 1000});
  //     } else {
  //       toast.error("Error deleting sale!", { position: "top-right", autoClose: 1000 });
  //     }

  //   } catch (error) {
  //     toast.error('unable to delete sale!', {position: "top-right",autoClose: 1000});
  //   }
  // }

  function generatePDF() {
    const table = document.getElementById("my-table");
    html2canvas(table, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.9); // Compress the image
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      pdf.setFontSize(16);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const userName = name;
      const textWidth =
        (pdf.getStringUnitWidth(userName) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      const xPosition = (pageWidth - textWidth) / 2; // Centered X position

      pdf.text(userName, xPosition, 15);
      // pdf.text(startDate,60,40)
      // pdf.text(endDate,40,15)

      const imgYPosition = 20;

      // Calculate image dimensions
      const imgWidth = pageWidth - 20; // Set margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the canvas image to the PDF (landscape orientation)
      pdf.addImage(imgData, "JPEG", 10, imgYPosition, imgWidth, imgHeight);

      const infoYPosition = imgYPosition + imgHeight + 10; // 10mm space after the image
      pdf.setFontSize(14); // Set font size for additional info
      pdf.setTextColor(249 ,115, 22); // Red
      pdf.text(`Total Due: ${totalDue.toLocaleString("en-IN")}`, 230, infoYPosition+10);
      pdf.setTextColor(14 ,165 ,233); // Blue
      pdf.text(`Total: ${totalAmount.toLocaleString("en-IN")}`, 170, infoYPosition); // Add total amount
      pdf.setTextColor(16 ,185, 129); // green
      pdf.text(`Total Jama: ${totalJama.toLocaleString("en-IN")}`, 230, infoYPosition);
      pdf.save("table-content.pdf"); // This will download the PDF locally
    });
  }

  return (
    <div>
      <Navbar />
      <div className="reports-container">
        <div className="date-filters">
          <label>Select Date Range:</label>
          <div className="date-picker-container">
            {/* <DatePicker selected={name} onChange={(naam) => setName(naam)} /> */}
            <select
              required
              className=" px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setName(e.target.value);
                console.log("Selected customer name:", e.target.value);
              }}
            >
              <option value="">Select Customer</option>
              {customerList.length > 0 ? (
                customerList.map((customer) => (
                  <option key={customer._id} value={customer.name}>
                    {customer.name}
                  </option>
                ))
              ) : (
                <option disabled>No customers found</option>
              )}
            </select>
            <span className="mx-4"> from </span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-9/12"
            />
            <span className="mr-4"> to </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-9/12	"
            />
          </div>
          <div className="preset-buttons">
            <button onClick={setToday}> Today</button>
            <button onClick={setLastDay}>Last Day</button>
            <button onClick={setLastWeek}>Last Week</button>
            <button onClick={setLastMonth}>Last Month</button>
            <button onClick={generatePDF}>Download</button>
          </div>
        </div>

        <div className="table-container">
          <div className="flex justify-between mb-1">
            <h2 className="font-medium text-lg">Sales Report</h2>
            {/* pdf here */}
            {/* <button className="pdf-button	" onClick={handleClick}>
              Export
            </button> */}
          </div>
          <table className="sales-table" id="my-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Jama</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {console.log("Sales data before showing on screen,", salesData)}
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.amount.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td>
                      {item.paymentDetails.paidAmount.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    {/* <td>
                      <button className="edit-btn" onClick={()=>{handleEdit(item._id)}}>
                        <FaRegEdit />
                      </button>
                      <button className="delete-btn" onClick={()=>{handleDelete(item._id)}}>
                        <MdDelete />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="totals">
          <div>
            Total Amount:{" "}
            <span className="text-sky-500">
              {totalAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
          <div>
            Total Jama:{" "}
            <span className="text-emerald-500">
              {totalJama.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
          <div>
            Average Price:{" "}
            <span className="text-orange-500">
              {averagePrice.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
          <div>
            Total Due:{" "}
            <span className="text-red-500">
              {totalDue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
          <div>
            Profit/Loss:{" "}
            <span
              className={profitOrLoss >= 0 ? "text-green-500" : "text-red-500"}
            >
              {profitOrLoss.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
