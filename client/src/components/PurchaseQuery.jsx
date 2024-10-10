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

const PurchaseQuery = () => {
  const [startDate, setStartDate] = useState("");
  const [name, setName] = useState("");
  const [purchaseData, setPurchaseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editData, setEditData] = useState({}); // Hold the row data for editing
  // const [paidAmount, setPaidAmount] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/supplier`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const result = await response.json();
        setSupplierList(result.data);
      } catch (error) {
        console.error("unable to fetch supplier list", error);
        setSupplierList([]);
      }
    };
    fetchSupplier();
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
          `${process.env.REACT_APP_BACKEND_URL}/purchase/fetch?${queryParams}`,
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
        setPurchaseData(result.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [startDate, name]);

  useEffect(() => {
    if (Array.isArray(purchaseData)) {
      let filteredList = purchaseData;
  
      // if (name) {
      //   filteredList = filteredList.filter((purchase) => purchase.name === name);
      // }
  
      // if (startDate) {
      //   const formattedStartDate = new Date(startDate).toLocaleDateString('en-CA'); // Consistent formatting
      //   filteredList = filteredList.filter(
      //     (purchase) => new Date(purchase.date).toLocaleDateString('en-CA') === formattedStartDate
      //   );
      // }
      console.log('result after filtering',filteredList)
      setFilteredData(filteredList || []);
    } else {
      console.log("purchaseData is not an array:", purchaseData);
      setFilteredData([]);
    }
  }, [name, startDate, purchaseData]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/purchase/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        setPurchaseData((prevPur) =>
          prevPur.filter((purchase) => purchase._id !== id)
        );

        toast.success("purchase deleted successfully!", {
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
        toast.error("Error deleting supplier!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("unable to delete purchase!", {
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

  const handleEdit = (purchase) => {
    setEditingRow(purchase._id); 
    setEditData(purchase); 
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
        `${process.env.REACT_APP_BACKEND_URL}/purchase/${editingRow}`,
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
        const updatedPurchase = await response.json();
        setPurchaseData((prevPur) =>
          prevPur.map((purchase) =>
            purchase._id === editingRow ? updatedPurchase.data : purchase
          )
        );
        toast.success("purchase updated successfully!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
        });
        setEditingRow(null); // Exit edit mode
      } else {
        toast.error("Error updating purchase!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Unable to update purchase!", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
      });
    }
  };

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
            <option value="">Select supplier</option>
            {supplierList.length > 0 ? (
              supplierList.map((supplier) => (
                <option key={supplier._id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))
            ) : (
              <option disabled>No suppliers found</option>
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
              <TableCell>Supplier</TableCell>
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
              filteredData.map((purchase) =>
                editingRow === purchase._id ? (
                  <TableRow key={purchase._id}>
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
                  <TableRow key={purchase._id}>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.name}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{purchase.price}</TableCell>
                    <TableCell>
                      {(purchase.quantity * purchase.price).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                    </TableCell>
                    <TableCell>{purchase.paymentStatus}</TableCell>
                    <TableCell>{purchase.paymentDetails.paidAmount}</TableCell>
                    <TableCell>
                      {purchase.paymentDetails?.dueAmount ?? ""}
                    </TableCell>
                    <TableCell className="flex text-center p-2">
                      <Button
                        variant="outlined"
                        size="small"
                        className="p-0.5 w-2"
                        onClick={() => handleEdit(purchase)}
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
                        onClick={() => handleDelete(purchase._id)}
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

export default PurchaseQuery;
