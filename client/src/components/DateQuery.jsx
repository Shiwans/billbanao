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

const DateQuery = () => {
  const [startDate, setStartDate] = useState("");
  const [name, setName] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editData, setEditData] = useState({}); // Hold the row data for editing
  // const [paidAmount, setPaidAmount] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customer`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('en-CA') : "";

        const queryParams = new URLSearchParams({
          date: formattedStartDate,
          name: name,
        });

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/sales/fetch?${queryParams}`,
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
        console.log('response after fetching data',result)
        setSalesData(result.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [startDate, name]);

  useEffect(() => {
    if (Array.isArray(salesData)) {
      let filteredList = salesData;
  
      // if (name) {
      //   filteredList = filteredList.filter((sale) => sale.customerName === name);
      // }
  
      // if (startDate) {
      //   const formattedStartDate = new Date(startDate).toLocaleDateString('en-CA'); // Consistent formatting
      //   filteredList = filteredList.filter(
      //     (sale) => new Date(sale.date).toLocaleDateString('en-CA') === formattedStartDate
      //   );
      // }
      console.log('result after filtering',filteredList)
      setFilteredData(filteredList || []);
    } else {
      console.log("salesData is not an array:", salesData);
      setFilteredData([]);
    }
  }, [name, startDate, salesData]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sales/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        setSalesData((prevSales) =>
          prevSales.filter((sale) => sale._id !== id)
        );

        toast.success("sale deleted successfully!", {
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
        toast.error("Error deleting customer!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("unable to delete sale!", {
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
    // const totalAmount = editData.quantity * editData.price;
    // const updatedEditData = {
    //   ...editData,
    //   paidAmount:
    //     editData.paymentStatus === "partial"
    //       ? parseInt(paidAmount) || 0
    //       : editData.paymentDetails.paidAmount,
    //   dueAmount:
    //     editData.paymentStatus === "paid"
    //       ? 0
    //       : editData.paymentStatus === "partial"
    //       ? totalAmount - (parseInt(paidAmount) || 0)
    //       : totalAmount,
    // };
    try {
      const response = await fetch(
       `${process.env.REACT_APP_BACKEND_URL}/sales/${editingRow}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(editData),
          // body: JSON.stringify(updatedEditData),
        }
      );

      if (response.ok) {
        const updatedSale = await response.json();
        setSalesData((prevSales) =>
          prevSales.map((sale) =>
            sale._id === editingRow ? updatedSale.data : sale
          )
        );
        toast.success("Sale updated successfully!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
        });
        setEditingRow(null); // Exit edit mode
      } else {
        toast.error("Error updating sale!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Unable to update sale!", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
      });
    }
  };
  // console.log("sale")
  // console.log(editingRow)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));

    // // Calculate total amount based on quantity and price
    // const totalAmount = editData.quantity * editData.price;

    // // Update paymentDetails based on paymentStatus
    // if (name === "paymentStatus") {
    //   if (value === "paid") {
    //     setEditData((prevData) => ({
    //       ...prevData,
    //       paymentDetails: { paidAmount: totalAmount, dueAmount: 0 },
    //     }));
    //   } else if (value === "unpaid") {
    //     setEditData((prevData) => ({
    //       ...prevData,
    //       paymentDetails: { paidAmount: 0, dueAmount: totalAmount },
    //     }));
    //   } else if (value === "partial") {
    //     const paidAmountValue = parseInt(paidAmount) || 0; // Parse the paid amount
    //     setEditData((prevData) => ({
    //       ...prevData,
    //       paymentDetails: {
    //         paidAmount: paidAmountValue,
    //         dueAmount: totalAmount - paidAmountValue,
    //       },
    //     }));
    //   }
    // }

    // // Handle updates to paidAmount
    // if (editData.paymentStatus === "partial" && name === "paidAmount") {
    //   const paidAmountValue = parseInt(value) || 0; // Parse the paid amount
    //   setEditData((prevData) => ({
    //     ...prevData,
    //     paymentDetails: {
    //       ...prevData.paymentDetails,
    //       paidAmount: paidAmountValue,
    //       dueAmount: totalAmount - paidAmountValue,
    //     },
    //   }));
    // }

    // const totalAmount = editData.quantity * editData.price;

    // const calculatePaymentDetails = (status, paidAmountValue) => {
    //   if (status === "paid") {
    //     return { paidAmount:totalAmount, dueAmount: 0 };
    //   } else if (status === "unpaid") {
    //     return { paidAmount: 0, dueAmount: totalAmount };
    //   } else if (status === "partial") {
    //     return {
    //       paidAmount: paidAmountValue,
    //       dueAmount: totalAmount - paidAmountValue,
    //     };
    //   }
    // };

    // // Update paymentDetails based on paymentStatus
    // if (name === "paymentStatus") {
    //   const newPaymentDetails = calculatePaymentDetails(value, parseFloat(paidAmount) || 0);
    //   setEditData((prevData) => ({
    //     ...prevData,
    //     paymentDetails: newPaymentDetails,
    //   }));
    // }

    // Handle updates to paidAmount
    // if (editData.paymentStatus === "partial" && name === "paidAmount") {
    //   const paidAmountValue = parseFloat(value) || 0; // Use parseFloat for decimal values
    //   setEditData((prevData) => ({
    //     ...prevData,
    //     paymentDetails: {
    //       ...prevData.paymentDetails,
    //       paidAmount: paidAmountValue,
    //       dueAmount: totalAmount - paidAmountValue,
    //     },
    //   }));
    // }
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
              <TableCell>Customer</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Total (₹)</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Paid Amount (₹)</TableCell>
              <TableCell>Due Amount (₹)</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((sale) =>
                editingRow === sale._id ? (
                  <TableRow key={sale._id}>
                    <TableCell>{editData.date}</TableCell>
                    <TableCell>{editData.name}</TableCell>
                    <TableCell>
                      <TextField
                        name="quantity"
                        value={editData.quantity}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="price"
                        value={editData.price}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      {(editData.quantity * editData.price).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "INR",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      {editData.paymentStatus}
                      {/* <select
                        name="paymentStatus"
                        value={editData.paymentStatus}
                        onChange={handleInputChange}
                      > */}
                      {/* <TextField
                        select
                        label="Payment Status"
                        value={editData.paymentStatus || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEditData({ ...editData, paymentStatus: value });
                          if (value !== "partial") {
                            setPaidAmount(""); // Clear paid amount if not partial
                          }
                        }}
                      >
                        {/* <option value="Paid">Paid</option> */}
                      {/* <option value="Partial">Partial</option>
                        <option value="unpaid">unpaid</option> */}
                      {/* <MenuItem value="paid">Full</MenuItem>
                        <MenuItem value="partial">Partial</MenuItem>
                        <MenuItem value="unpaid">unpaid</MenuItem>  */}
                      {/* </TextField> */}
                      {/* </select> */}
                    </TableCell>
                    {/* <TableCell>{editData.paymentDetails?.paidAmount}</TableCell> */}
                    <TableCell>
                      {/* {editData.paymentStatus === "partial" && (
                        <TextField
                          label="Paid Amount"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          type="number"
                        />
                      )} */}
                      {editData.paymentDetails.paidAmount}
                    </TableCell>
                    <TableCell>{editData.paymentDetails.dueAmount}</TableCell>
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
                  <TableRow key={sale._id}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.name}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>{sale.price}</TableCell>
                    <TableCell>
                      {(sale.quantity * sale.price).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </TableCell>
                    <TableCell>{sale.paymentStatus}</TableCell>
                    <TableCell>{sale.paymentDetails.paidAmount}</TableCell>
                    <TableCell>
                      {sale.paymentDetails?.dueAmount ?? ""}
                    </TableCell>
                    <TableCell className="flex text-center p-2">
                      <Button
                        variant="outlined"
                        size="small"
                        className="p-0.5 w-2"
                        onClick={() => handleEdit(sale)}
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
                        onClick={() => handleDelete(sale._id)}
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

export default DateQuery;
