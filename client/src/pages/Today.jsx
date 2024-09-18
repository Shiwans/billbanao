import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
// import * as React from 'react';
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast, Slide } from "react-toastify";
import { Select } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Today = () => {
  const [name, setName] = useState("");
  const [kg, setKg] = useState();
  const [value, setValue] = useState();
  const [jama, setJama] = useState();
  const [payment, setPayment] = useState("");
  const [type, setType] = useState("");
  const [dueAmount, setDueAmount] = useState();
  const [salesData, setSalesData] = useState([]);
  const [list, setList] = useState([]);
  const [customerList, setCustomerList] = useState([])
  const [supplierList, setSupplierList] = useState([])

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1
    const day = today.getDate().toString().padStart(2, "0"); // Add leading zero if necessary
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getTodayDate()); // Automatically set to today's date
  // const date = "2024-09-15";

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
        const response2 = await fetch("http://localhost:4000/supplier", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        // Parse the JSON response
        const result = await response.json();
        setCustomerList(result.data)
        const result2 = await response2.json();
        const lists = result.data.concat(result2.data);
        console.log("list", lists);
        setList(lists);
        // console.log(customerList)
      } catch (error) {
        console.error("unable to fetch customer list", error);
        setList([]); // Fallback in case of error
      }
    };
    fetchCustomers();

    // const checkForSupplier = () => {
    //   // Filter salesData for suppliers and set it to the supplier list
    //   const supplierList = salesData.filter((user) => {
    //     // Assuming user has a flag or property that identifies them as a supplier
    //     return user.type === "supplier"; // Adjust this condition based on your data structure
    //   });
    
    //   setSupplierList(supplierList); // Update the state with the filtered suppliers
    // };

    // checkForSupplier()
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      const start = new Date(date).toISOString().split("T")[0]; // Start date
      const end = new Date(new Date(date).setDate(new Date(date).getDate() + 1)) // Next day
        .toISOString()
        .split("T")[0]; // End date

      const query = new URLSearchParams({ start, end }).toString();

      try {
        const response = await fetch(
          `http://localhost:4000/sales/day?${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSalesData(data); // Store the fetched data in state
        } else {
          console.error("Failed to fetch sales data");
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          customerName: name,
          quantity: Number(kg),
          price: Number(value),
          paymentStatus: payment,
          paymentDetails: {
            paidAmount: Number(jama),
            dueAmount: Number(dueAmount),
          },
        }),
        credentials: "include",
      });
      if (response.ok) {
        console.log("Sale saved successfully");
        // setSalesData((prevSales) => [
        //   ...prevSales,
        //   { customerName: name, quantity: kg, price: value, amount: jama }, // Add new sale to state
        // ]);
        setName("");
        setKg(0);
        setValue(0);
        setJama(0);
        setPayment("");
        setType("");
        setDueAmount(0);

        toast.success("Sale has been saved!", {
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
      } else {
        console.log("Error saving sales in db");
      }
    } catch (error) {
      console.error("Error saving sales", error);
    }
  };

  const checkP = () => {
    if (payment === "partial") {
      const amount = Number(kg) * Number(value);
      const due = amount - (jama || 0);
      // setDueAmount(due)
      return (
        <>
          <label
            htmlFor="jama"
            className="block text-gray-700 text-sm font-bold mb-1"
          >
            Partial Jama:
          </label>
          <input
            type="number"
            id="jama"
            name="amount given"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter jama"
            value={jama}
            onChange={(e) => {
              setJama(e.target.value);
            }}
          />
          <input
            type="number"
            id="jama"
            name="amount given"
            className="w-full px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter jama"
            value={due}
            disabled
            // onChange={(e) => {
            //   setDueAmount(e.target.value);
            // }}
          />
        </>
      );
    } else {
      return (
        <>
          <label
            htmlFor="jama"
            className="block text-gray-700 text-sm font-bold mb-1"
          >
            Jama:
          </label>
          <input
            type="number"
            id="jama"
            name="jama"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Enter jama"
          />
        </>
      );
    }
  };

  const handleNameChange = (e) => {
    const selectedName = e.target.value;
    setName(selectedName);

    const selectedCustomer = list.find(
      (cust) => cust.name === selectedName
    );
    console.log("payertype", selectedCustomer.type);
    if (selectedCustomer) {
      if (selectedCustomer.type == null) {
        setType("Select Payer type");
      } else {
        setType(selectedCustomer.type);
      }
    } else {
      setType("");
    }
  };

  console.log('supplier list',supplierList)
  return (
    <div>
      <Navbar />
      <div className="w-1/2 bg-slate-500 shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-0.5">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                Name:
              </label>
              {/* <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              /> */}
              <select
                onChange={handleNameChange}
                value={name}
                required
                className="w-full px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {list.length > 0 ? (
                  list.map((customer) => (
                    <option key={customer._id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No customers found</option>
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor="kg"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                KG/Jalli:
              </label>
              <input
                type="number"
                id="kg"
                name="kg"
                value={kg}
                className="w-full px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter weight in kg"
                onChange={(e) => {
                  setKg(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-0.5">
            <div>
              <label
                htmlFor="value"
                className="block text-gray-700 text-sm font-bold mb-1"
              >
                Value:
              </label>
              <input
                type="number"
                id="value"
                name="value"
                value={value}
                className="w-full px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
            <div className="mb-0.5">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Status:{" "}
              </label>
              <select
                className="w-full px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={payment}
                onChange={(e) => {
                  setPayment(e.target.value);
                }}
                required
              >
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>{checkP()}</div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Type:{" "}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled
                className="text-black">
                <option value="" selected>Select Payer Type</option>
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-75"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Customer Table should come first */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">qty.</StyledTableCell>
                <StyledTableCell align="right">kg</StyledTableCell>
                <StyledTableCell align="right">sum</StyledTableCell>
                <StyledTableCell align="right">Jama</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell align="right">{sale.quantity}</TableCell>
                  <TableCell align="right">{sale.price}</TableCell>
                  <TableCell align="right">
                    {sale.quantity * sale.price}
                  </TableCell>
                  <TableCell align="right">
                    {sale.paymentDetails.paidAmount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <br></br>
      <hr></hr> <br></br>
      {/* Supplier Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">qty.</TableCell>
              <TableCell align="right">kg</TableCell>
              <TableCell align="right">Sum</TableCell>
              <TableCell align="right">Jama</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell align="right">{sale.quantity}</TableCell>
                <TableCell align="right">{sale.price}</TableCell>
                <TableCell align="right">
                  {sale.quantity * sale.price}
                </TableCell>
                <TableCell align="right">
                  {sale.paymentDetails.paidAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Today;
