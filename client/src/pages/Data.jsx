//DATA
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "./Data.css";
import { toast, Slide } from "react-toastify";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalJama, setTotalJama] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (startDate) {
          const formattedStartDate = startDate
            ? new Date(startDate).toISOString().split("T")[0]
            : "";
          const formattedEndDate = endDate
            ? new Date(endDate).toISOString().split("T")[0]
            : "";
          const queryParams = new URLSearchParams({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          }).toString();
          const response = await fetch(
            `http://localhost:4000/sales?${queryParams}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          const data = await response.json();

          setSalesData(data);
        } else {
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
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    // Apply customer name filter if name is selected
    if (name) {
      const filteredList = salesData.filter(
        (sale) => sale.customerName === name
      );
      setFilteredData(filteredList || []);
    } else {
      setFilteredData(salesData || []);
    }
  }, [name, salesData]);

  useEffect(() => {
    // Calculate totals after filtering
    const totalSold = filteredData.reduce(
      (acc, item) => acc + (item.amount || 0),
      0
    );
    const totalPaid = filteredData.reduce(
      (acc, item) => acc + (item.paymentDetails?.paidAmount || 0),
      0
    );
    setTotalAmount(totalSold);
    setTotalJama(totalPaid);
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
          </div>
        </div>

        <div className="table-container">
          <h2>Sales Report</h2>
          <table className="sales-table">
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
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                    <td>{item.customerName}</td>
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
        </div>
      </div>
    </div>
  );
};

export default Reports;
