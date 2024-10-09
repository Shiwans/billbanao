//write cases when paid,partial and unpaid are selected
import React, { useState, useEffect,useCallback } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { toast, Slide } from "react-toastify";
import UpdateSale from "../components/UpdateSale";
import DateQuery from "../components/DateQuery";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    color: "white",
    padding: "20px",
    borderRadius: "8px",
  },
  textField: {
    "& .MuiInputBase-input": {
      color: "white", //Input
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#91b9ff", // Label color when focused
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "#325fad",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#407fed",
      },
    },
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  noScroll: {
    overflowY: "hidden",
    height: "100vh",
  },
}));

const Sale = () => {
  const classes = useStyles();

  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); //paid,partial,unpaid
  const [paidAmount, setPaidAmount] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [customerList, setCustomerList] = useState([]); //for listing dropdown
  const [recentSales, setRecentSales] = useState([]); //for listing last 10 sales in table
  const [showPopup, setShowPopup] = useState(false); //for quering certain date's data
const [customerId,setCustomerId] = useState("")
const [type,setType] = useState("")
const [quantityError, setQuantityError] = useState("");
const [priceError, setPriceError] = useState("");

  const token = localStorage.getItem("token");
  const fetchSales = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sales/10`, {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();

      console.log("recent sales from sale.js",data)
      setRecentSales(data.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  },[token]);
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
        console.error("Unable to fetch customer list", error);
        setCustomerList([]);
      }
    };
    fetchCustomers();

    fetchSales();
  }, [showPopup, token,fetchSales]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantity <= 0) {
      setQuantityError("Quantity must be greater than zero.");
      return;
    }
  
    if (price <= 0) {
      setPriceError("Price must be greater than zero.");
      return;
    }

    const total = parseInt(quantity) * parseInt(price);
    let updatedPaidAmount = paidAmount;
    let updatedDueAmount = dueAmount;

    if (paymentStatus === "paid") {
      updatedPaidAmount = total;
      updatedDueAmount = 0;
    } else if (paymentStatus === "partial") {
      updatedPaidAmount = paidAmount;
      updatedDueAmount = parseInt(total) - parseInt(paidAmount);
    } else if (paymentStatus === "unpaid") {
      updatedPaidAmount = 0;
      updatedDueAmount = total;
    }
    console.log('customerType is:',type ,'customerid is: ',customerId)
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: new Date(date),
        name,
        quantity: parseInt(quantity),
        price: parseInt(price),
        totalAmount,
        paymentStatus,
        paymentDetails: {
          paidAmount: parseInt(updatedPaidAmount),
          dueAmount: parseInt(updatedDueAmount),
        },
        type,
        customerId,

      }),
      credentials: "include",
    });

    await fetchSales();
    if (response.ok) {
      toast.success("Sale has been added!", {
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
      toast.error("Error saving Sale!", {
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

    // Clear form
    setDate("");
    setName("");
    setQuantity("");
    setPrice("");
    setPaymentStatus("");
    setPaidAmount("");
    setDueAmount("");
    setTotalAmount("");
    setQuantityError("")
    setPriceError("")
  };

  const renderPaymentDetails = () =>
    paymentStatus === "partial" && (
      <Grid container spacing={2} className="m-1">
        <Grid item xs={6}>
          <TextField
            label="Paid Amount"
            type="number"
            className={classes.textField}
            value={paidAmount}
            onChange={(e) => {
              const paidAmounts = parseInt(e.target.value)
              setPaidAmount(paidAmounts)
            setDueAmount((quantity * price) -paidAmounts ); // Update due amount immediately
            }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} >
          <TextField
            label="Due Amount"
            className={classes.textField}
            type="number"
            value={dueAmount}
            // onChange={(e) => {setPaidAmount(e.target.value)}}
            fullWidth
            required
            disabled
          />
        </Grid>
      </Grid>
    );

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };
  const actionBar = (
    <div>
      <Button variant="contained" color="primary" onClick={handleClose}>
        Close
      </Button>
    </div>
  );
  let modal = (
    <UpdateSale onClose={handleClose} actionBar={actionBar}>
      <h1>Update Sale data</h1>
      <DateQuery />
    </UpdateSale>
  );

  return (
    <div className={classes.noScroll}>
      <div className="flex justify-between mt-2">
        <Typography variant="h4" gutterBottom>
          Sale
        </Typography>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleClick}
          >
            Change Sale data
          </Button>
          {showPopup && modal}
        </Grid>
      </div>

      {/* Sale Form */}
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              className={classes.textField}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              className={classes.textField}
              label="Customer Name"
              value={name}
              // onChange={(e) => setName(e.target.value)}
              onChange={(e) => {
                setName(e.target.value);
                // Find the selected customer ID based on the selected name
                const selectedCustomer = customerList.find(customer => customer.name === e.target.value);
                setCustomerId(selectedCustomer ? selectedCustomer._id : "");
                setType(selectedCustomer ? selectedCustomer.type : "");
              }}
              fullWidth
              required
            >
              <MenuItem value="" disabled>
                Select Customer
              </MenuItem>
              {customerList.length > 0 ? (
                customerList.map((customer) => (
                  <MenuItem key={customer._id} value={customer.name}>
                    {customer.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No customers found</MenuItem>
              )}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              className={classes.textField}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              required
              error={Boolean(quantityError)} // Set error state
              helperText={quantityError} // Display error message
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              type="number"
              className={classes.textField}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
              error={Boolean(priceError)} // Set error state
              helperText={priceError} // Display error message
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Payment Status"
              value={paymentStatus}
              className={classes.textField}
              onChange={(e) => setPaymentStatus(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Payment Status</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </TextField>
          </Grid>

          {renderPaymentDetails()}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Recent Sales Table */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>
        Recent Sales
      </Typography>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {recentSales.length > 0 ? (
              recentSales.map((sale, index) => (
                <TableRow key={index} className={classes.tableRowHover}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{sale.price}</TableCell>
                  <TableCell>
                    {(sale.quantity * sale.price)
                      .toFixed(2)
                      .toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                  </TableCell>
                  <TableCell>{sale.paymentStatus}</TableCell>
                  <TableCell>{sale.paymentDetails.paidAmount}</TableCell>
                  <TableCell>{sale.paymentDetails.dueAmount}</TableCell>
                  {/* <TableCell>{sale.paymentStatus === "paid" ? (sale.quantity * sale.price).toFixed(2) : sale.paidAmount}</TableCell> */}
                  {/* <TableCell>{sale.paymentStatus === "unpaid" ? (sale.quantity * sale.price).toFixed(2) : sale.dueAmount}</TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Sales found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sale;
