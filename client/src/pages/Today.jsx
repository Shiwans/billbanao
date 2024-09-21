import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast, Slide } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.text.primary,
  },
}));

const Today = () => {
  const [name, setName] = useState("");
  const [kg, setKg] = useState("");
  const [value, setValue] = useState("");
  const [jama, setJama] = useState("");
  const [payment, setPayment] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [list, setList] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [supplierSales, setSupplierSales] = useState([]);
  const [type, setType] = useState("customer");
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchCustomersAndSuppliers = async () => {
      try {
        const customerResponse = await fetch("http://localhost:4000/customer"); // Adjust as per backend
        const supplierResponse = await fetch("http://localhost:4000/supplier");

        const customerResult = await customerResponse.json();
        const supplierResult = await supplierResponse.json();

        setList([...customerResult.data, ...supplierResult.data]);
      } catch (error) {
        console.error("Error fetching data", error);
        setList([]);
      }
    };
    fetchCustomersAndSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const endpoint = type === "customer" ? "http://localhost:4000/sales/customer" : "http://localhost:4000/sales/supplier";
    
    try {
      const response = await fetch("http://localhost:4000/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today, // Make sure you're sending the date as the backend expects
          customerName: name,
          quantity: Number(kg),
          price: Number(value),
          paymentStatus: payment,
          paymentDetails: {
            paidAmount: Number(jama),
            dueAmount: Number(dueAmount),
          },
        }),
      });

      if (response.ok) {
        setName("");
        setKg("");
        setValue("");
        setJama("");
        setPayment("");
        setDueAmount("");

        toast.success("Sale has been saved!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Slide,
        });

        fetchSalesData(); // Fetch updated data after submission
      } else {
        console.error("Error saving sale");
      }
    } catch (error) {
      console.error("Error saving sale", error);
    }
  };

  const fetchSalesData = async () => {
    try {
      // const resp = await fetch(`http://localhost:4000/sales/day?${date}`); // Make sure backend route matches

      
      // const customerData = await customerResponse.json();
      // const supplierData = await supplierResponse.json();

      // setCustomerSales(customerData.data);
      // setSupplierSales(supplierData.data);
    } catch (error) {
      console.error("Error fetching sales data", error);
    }
  };


  return (
    <div className="p-6 bg-white">
      <div className="w-full md:w-1/2 mx-auto shadow-lg rounded-lg p-6 mt-4 border border-gray-300">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">Name:</label>
              <select
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Customer/Supplier</option>
                {list.length > 0 ? (
                  list.map((item) => (
                    <option key={item._id} value={item.name}>{item.name}</option>
                  ))
                ) : (
                  <option disabled>No customers/suppliers found</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">KG/Jalli:</label>
              <input
                type="number"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md"
                placeholder="Enter weight in kg"
              />
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">Value:</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md"
                placeholder="Enter value per kg"
              />
            </div>
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">Payment Status:</label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md"
              >
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="due">Due</option>
              </select>
            </div>
          </div>
  
          <div className="mt-4">
            <input
              type="date"
              value={today}
              disabled
              className="w-full px-3 py-2 border border-gray-400 rounded-md mb-4 text-gray-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
  
      <div className="mt-10 w-full text-black">
        <h3 className="text-lg font-bold mb-4">Page Summary</h3>
        <div className="flex justify-between items-center mb-4">
          <p>Today's Purchases</p>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md">Print</button>
        </div>
  
        <h4 className="font-bold mt-6">Supplier Purchases</h4>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Supplier Name</StyledTableCell>
                <StyledTableCell>Qty</StyledTableCell>
                <StyledTableCell align="right">Price</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">Paid</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplierSales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale.supplierName}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell align="right">{sale.price}</TableCell>
                  <TableCell align="right">{sale.quantity * sale.price}</TableCell>
                  <TableCell align="right">{sale.paymentDetails.paidAmount}</TableCell>
                  <TableCell align="right">
                    <button className="bg-red-500 text-black px-2 py-1 rounded-md">Delete</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <h4 className="font-bold mt-6">Customer Sales</h4>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Customer Name</StyledTableCell>
                <StyledTableCell>Qty</StyledTableCell>
                <StyledTableCell align="right">Price</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">Paid</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerSales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell align="right">{sale.price}</TableCell>
                  <TableCell align="right">{sale.quantity * sale.price}</TableCell>
                  <TableCell align="right">{sale.paymentDetails.paidAmount}</TableCell>
                  <TableCell align="right">
                    <button className="bg-red-500 text-black px-2 py-1 rounded-md">Delete</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
  
};

export default Today;
