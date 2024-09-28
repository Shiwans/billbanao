import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { toast, Slide } from "react-toastify";
import {
  Grid,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ButtonGroup,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

// Styled Table Cell
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
// const useStyles = makeStyles((theme) => ({
// //   formContainer: {
// //     color: "white",
// //     padding: "20px",
// //     borderRadius: "8px",
// //   },
// //   textField: {
// //     "& .MuiInputBase-input": {
// //       color: "white", //Input
// //     },
// //     "& .MuiInputLabel-root": {
// //       color: "white", // Label
// //     },
// //     "& .MuiInputLabel-root.Mui-focused": {
// //       color: '#91b9ff', // Label color when focused
// //     },
// //     "& .MuiOutlinedInput-root": {
// //       "& fieldset": {
// //         borderColor: "white",
// //       },
// //       "&:hover fieldset": {
// //         borderColor: "#325fad",
// //       },
// //       "&.Mui-focused fieldset": {
// //         borderColor: "#407fed",
// //       },
// //     },
// //   },
// //   tableRowHover: {
// //     "&:hover": {
// //       backgroundColor: "#f5f5f5",
// //     },
// //   },
// //   noScroll: {
// //     overflowY: "hidden",
// //     height: "100vh",
// //   },
// // }));
// Styled Table Row for hover effect
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Today = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [value, setValue] = useState("");
  const [payment, setPayment] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  // const [list, setList] = useState([]);
  const [customers, setCustomer] = useState([]);
  const [suppliers, setSupplier] = useState([]);
  const [allSales, setAllSales] = useState([]); // Initialize as an empty array
  const [activeTab, setActiveTab] = useState("customer");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        let query = {
          start: today,
          end: today + 1,
        };
        const response = await fetch(
          `http://localhost:4000/sales/day?${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        ); // Make sure backend route matches
        const result = await response.json();
        setAllSales(result);
      } catch (error) {
        console.error("Error fetching sales data", error);
        setAllSales([]);
      }
    };
    fetchSalesData();
  }, []);

  useEffect(() => {
    const fetchCustomersAndSuppliers = async () => {
      try {
        const customerResponse = await fetch("http://localhost:4000/customer");
        const supplierResponse = await fetch("http://localhost:4000/supplier");

        const customerResult = await customerResponse.json();
        const supplierResult = await supplierResponse.json();

        setCustomer(customerResult);
        setSupplier(supplierResult);
        // setList([...customerResult.data, ...supplierResult.data]);
      } catch (error) {
        console.error("Error fetching data", error);
        setCustomer([]);
        setSupplier([]);
        // setAllSales([]); // Ensure this is set to an empty array on error
      }
    };
    fetchCustomersAndSuppliers();
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = parseInt(quantity) * parseInt(value);

    let updatedPaidAmount = paidAmount;
    let updatedDueAmount = dueAmount;

    if (payment === "paid") {
      updatedPaidAmount = total;
      updatedDueAmount = 0;
    } else if (payment === "partial") {
      updatedPaidAmount = paidAmount;
      updatedDueAmount = total - paidAmount;
    } else if (payment === "unpaid") {
      updatedPaidAmount = 0;
      updatedDueAmount = total;
    }

    try {
      const response = await fetch("http://localhost:4000/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          name,
          quantity: Number(quantity),
          price: Number(value),
          paymentStatus: payment,
          paymentDetails: {
            paidAmount: Number(updatedPaidAmount),
            dueAmount: Number(updatedDueAmount),
          },
        }),
      });

      if (response.ok) {
        setName("");
        setQuantity("");
        setValue("");
        setPaidAmount("");
        setPayment("");
        setDueAmount("");
        toast.success("Transaction has been saved!", {
          position: "top-right",
          autoClose: 1000,
          transition: Slide,
        });
        // Re-fetch sales to include the new entry
        // const salesResponse = await fetch("http://localhost:4000/sales");
        // const salesResult = await salesResponse.json();
        // setAllSales(salesResult.data);
      } else {
        console.error("Error saving transaction");
      }
    } catch (error) {
      console.error("Error saving transaction", error);
    }
  };

  // Calculate totals for page summary
  // Calculate totals for page summary
  console.log("allSales:", allSales); // Check the value of allSales
  const totalSales = Array.isArray(allSales)
    ? allSales.reduce((acc, sale) => acc +sale.amount, 0)
    : 0;
  const totalPaid = Array.isArray(allSales)
    ? allSales.reduce((acc, sale) => acc + sale.paymentDetails.paidAmount, 0)
    : 0;
  const totalDue = Array.isArray(allSales)
    ? allSales.reduce((acc, sale) => acc + sale.paymentDetails.dueAmount, 0)
    : 0;

  // const filteredSales = allSales.filter((sale) =>
  //   activeTab === "customer"
  //     ? sale.name.includes("Customer")
  //     : sale.name.includes("Supplier")
  // );
  const filteredSales = allSales.filter((sale) =>
    activeTab === "customer"
      ? sale.type && sale.type.includes("customer")  // Check if sale.type is defined
      : sale.type && sale.type.includes("supplier")  // Check if sale.type is defined
  );

  const renderPaymentDetails = () =>
    payment === "partial" && (
      <div>
        <label className="block text-gray-800 text-sm font-semibold mb-2">
          Partial Payment
        </label>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Paid Amount"
              type="number"
              // className={classes.textField}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Due Amount"
              // className={classes.textField}
              type="number"
              value={dueAmount}
              onChange={(e) => setDueAmount(e.target.value)}
              fullWidth
              required
              disabled
            />
          </Grid>
        </Grid>
      </div>
    );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/sales/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        setAllSales((prevCust) => prevCust.filter((sales) => sales._id !== id));
        toast.success("Sale deleted successfully!", {
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
        toast.error("Error deleting Sale!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("unable to delete Sale!", {
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

  return (
    <div className="p-6 bg-white">
      <ButtonGroup fullWidth>
        <Button
          onClick={() => handleTabSwitch("customer")}
          variant={activeTab === "customer" ? "contained" : "outlined"}
        >
          Customer
        </Button>
        <Button
          onClick={() => handleTabSwitch("supplier")}
          variant={activeTab === "supplier" ? "contained" : "outlined"}
        >
          Supplier
        </Button>
      </ButtonGroup>

      <div className="w-full md:w-1/2 mx-auto shadow-lg rounded-lg p-6 mt-4 border border-gray-300 bg-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">
                Name:
              </label>
              <select
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select {activeTab === "customer" ? "Customer" : "Supplier"}
                </option>
                {activeTab === "customer" ? (
                  customers.length > 0 ? (
                    customers.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No customers found</option>
                  )
                ) : suppliers.length > 0 ? (
                  suppliers.map((iten) => (
                    <option key={iten._id} value={iten.name}>
                      {iten.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No suppliers found</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">
                Quantity
              </label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                variant="outlined"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                variant="outlined"
                placeholder="Enter value"
              />
            </div>
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-2">
                Payment Status
              </label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
            {renderPaymentDetails()}

            <div className="mt-4">
              <input
                type="date"
                value={today}
                disabled
                className="w-full px-3 py-2 border border-gray-400 rounded-md mb-4 text-gray-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 w-full text-black bg-gray-100 p-4 rounded-lg shadow-md">
        <h1 className="text-lg font-bold mb-2">Page Summary</h1>
        <div className="flex flex-wrap gap-4	mb-4 text-center items-center">
          <div className="info-item">
            <strong>Total Sales:</strong>{" "}
            {totalDue.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </div>
          <div className="info-item">
            <strong>Total amount:</strong>{" "}
            {totalDue.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </div>
          <div className="info-item">
            <strong className="info">Total paid:</strong>{" "}
            {totalDue.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </div>
          <div className="info-item">
            <strong>Profit:</strong>{" "}
            {totalDue.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </div>
        </div>
      </div>

      {/* //table from here/ */}
      <div className="mt-10 w-full text-black">
        <h3 className="text-lg font-bold mb-2">
          {activeTab === "customer"
            ? "Todays Customer Sales"
            : "Todays Supplier Sales"}
        </h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Value</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Paid</StyledTableCell>
                <StyledTableCell>Due</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.map((sale) => (
                <StyledTableRow key={sale._id}>
                  <StyledTableCell>{sale.customerName}</StyledTableCell>
                  <StyledTableCell>{sale.quantity}</StyledTableCell>
                  <StyledTableCell align="right">{sale.value}</StyledTableCell>
                  <StyledTableCell>
                    {(sale.quantity * sale.price).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </StyledTableCell>
                  <StyledTableCell>
                    {sale.paymentDetails.paidAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </StyledTableCell>
                  <StyledTableCell>
                    {sale.paymentDetails.dueAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </StyledTableCell>
                  {/* <StyledTableCell>{sale.date}</StyledTableCell> */}
                  <TableCell align="right">
                    <button
                      className="text-black px-2 py-1 rounded-md border-2 border-rose-500 text-red-700"
                      onClick={() => {
                        handleDelete(sale._id);
                      }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Today;
