import React, { useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const PayQuery = () => {
  const [startDate, setStartDate] = useState("");
  const [name, setName] = useState("");
  const [PayData, setPayData] = useState([]); //instead of sales data
  const [filteredData, setFilteredData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editData, setEditData] = useState({}); // Hold the row data for editing
  // const [paidAmount, setPaidAmount] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        //here i am fetching both customer and supplier as they are the once where i'll pay or i'll get
        const response = await fetch("http://localhost:4000/customer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const response2 = await fetch("http://localhost:4000/supplier", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        // Parse the JSON response
        const result = await response.json();
        const result2 = await response2.json();

        setCustomerList([...result.data, ...result2.data]);

      } catch (error) {
        console.error("Unable to fetch customer/supplier list", error);
        setCustomerList([]); 
      }
    };
    fetchCustomers();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStartDate = paymentDate
          ? new Date(paymentDate).toLocaleDateString("en-CA")//YYYY-MM-DD
          : "";

        const queryParams = new URLSearchParams({
          paymentDate: formattedStartDate,
          payerName: name,
        });

        const response = await fetch(`http://localhost:4000/payment/fetch?${queryParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const result = await response.json();
        setPayData(result.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [startDate, name]);

  useEffect(() => {
    if (Array.isArray(PayData)) {
      // Ensure salesData is an array
      if (name) {
        const filteredList = PayData.filter(
          (sale) => sale.payerName === name
        );
        setFilteredData(filteredList || []);
      } else {
        setFilteredData(PayData || []);
      }
    } else {
      console.log("PayData is not an array:", PayData);
      setFilteredData([]);
    }
  }, [name, PayData]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/payment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        setSalesData((prevSales) =>
          prevSales.filter((sale) => payment._id !== id)
        );

        toast.success("Payment deleted successfully!", {
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
      } else {
        toast.error("Error deleting Payment!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("unable to delete Payment!", {
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

  const handleEdit = (sale) => {
    setEditingRow(sale._id); // Set the current row to edit
    setEditData(sale); // Pre-fill the editing form with current row data
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/payment/${editingRow}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        const updatedSale = await response.json();
        setPayData((prevSales) =>
          prevSales.map((pay) =>
            pay._id === editingRow ? updatedSale.data : pay
          )
        );
        toast.success("Payment updated successfully!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
        });
        setEditingRow(null); // Exit edit mode
      } else {
        toast.error("Error updating Payment!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Unable to update Payment!", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <div className="date-picker-container">
        <div>
          <select
            required
            className="px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="">Select Customer/Supplier</option>
            {customerList.length > 0 ? (
              customerList.map((customer) => (
                <option key={customer._id} value={customer.name}>
                  {customer.name}
                </option>
              ))
            ) : (
              <option disabled>No customers/Suppliers found</option>
            )}
          </select>
        </div>
        <span className="mx-4"> on </span>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="w-9/12 border-2 border-gray-200 rounded-lg p-1"
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>PayerType</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Amount(₹)</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((pay) =>
                editingRow === pay._id ? (
                  <TableRow key={pay._id}>
                    <TableCell>{editData.paymentDate}</TableCell>
                    <TableCell>{editData.payerType}</TableCell>
                    <TableCell>{editData.payerName}</TableCell>
                    <TableCell>
                      {(editData.amount).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "INR",
                        }
                      )}
                    </TableCell>
                    {/* <TableCell>{editData.method}</TableCell> */}
                    <TableCell>
                    <TextField
                        name="amount"
                        value={editData.method}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={handleSaveEdit}
                        variant="outlined"
                        size="small"
                        className="p-0.5 w-2"
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outlined"
                        size="small"
                        color="error"
                        className="p-0.5 w-2 mt-1"
                        sx={{ ml: 1 }}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={pay._id}>
                    <TableCell>{pay.paymentDate}</TableCell>
                    <TableCell>{pay.payerType}</TableCell>
                    <TableCell>{pay.payerName}</TableCell>
                    <TableCell>
                      {(pay.amount).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </TableCell>
                    <TableCell>{pay.method}</TableCell>
                    <TableCell className="flex text-center p-2">
                      <Button
                        variant="outlined"
                        size="small"
                        className="p-0.5 w-2"
                        onClick={() => handleEdit(pay)}
                        color="primary"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        className="p-0.5 w-2 mt-1"
                        sx={{ ml: 1 }}
                        onClick={() => handleDelete(pay._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PayQuery;
