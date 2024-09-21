//write cases when paid,partial and unpaid are selected
import React, { useState, useEffect } from "react";
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
  Paper 
} from "@mui/material"; 
import { makeStyles } from "@mui/styles";

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
      color: '#91b9ff', // Label color when focused
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
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

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
        console.error("Unable to fetch customer list", error);
        setCustomerList([]);
      }
    };
    fetchCustomers();

    // Simulate recent sales data (replace with actual backend data)
    const fetchRecentSales = () => {
      const randomSales = [...Array(10)].map((_, index) => ({
        date: "2024-09-20",
        customerName: `Customer ${index + 1}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        price: (Math.random() * 100).toFixed(2),
        totalAmount: 0,
        paymentStatus: ["Paid", "Partial", "Unpaid"][Math.floor(Math.random() * 3)],
        paidAmount: (Math.random() * 50).toFixed(2),
        dueAmount: (Math.random() * 50).toFixed(2),
      }));
      setRecentSales(randomSales);
    };

    fetchRecentSales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = quantity * price;

    // Adjust due and paid amount based on payment status
    if (paymentStatus === "paid") {
      setPaidAmount(total);
      setDueAmount(0);
    } else if (paymentStatus === "partial") {
      setDueAmount(total - paidAmount);
    } else if (paymentStatus === "unpaid") {
      setDueAmount(total);
      setPaidAmount(0);
    }

    const response = await fetch("http://localhost:4000/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        customerName,
        quantity: Number(quantity),
        price: Number(price),
        totalAmount: total,
        paymentStatus,
        paymentDetails: {
          paidAmount: Number(paidAmount),
          dueAmount: Number(dueAmount),
        },
      }),
      credentials: "include",
    });

    if (response.ok) {
      setMessage("Sale data submitted successfully!");
    } else {
      setMessage("Failed to submit sale data.");
    }

    // Clear form
    setDate("");
    setCustomerName("");
    setQuantity("");
    setPrice("");
    setPaymentStatus("");
    setPaidAmount("");
    setDueAmount("");
  };

  const renderPaymentDetails = () => (
    paymentStatus === "partial" && (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Paid Amount"
            type="number"
            className={classes.textField}
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Due Amount"
            className={classes.textField}
            type="number"
            value={dueAmount}
            onChange={(e) => setDueAmount(e.target.value)}
            fullWidth
            required
          />
        </Grid>
      </Grid>
    )
  );

  return (
    <div className={classes.noScroll}>
      <Typography variant="h4" gutterBottom>Sale</Typography>
      
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              className={classes.textField}
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="" disabled>Select Customer</MenuItem>
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

      {/* Message Display */}
      {message && <Typography color="secondary" style={{ marginTop: "10px" }}>{message}</Typography>}

      {/* Recent Sales Table */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>Recent Sales</Typography>
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
            {recentSales.map((sale, index) => (
              <TableRow key={index} className={classes.tableRowHover}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.price}</TableCell>
                <TableCell>{(sale.quantity * sale.price).toFixed(2)}</TableCell>
                <TableCell>{sale.paymentStatus}</TableCell>
                <TableCell>{sale.paymentStatus === "paid" ? (sale.quantity * sale.price).toFixed(2) : sale.paidAmount}</TableCell>
                <TableCell>{sale.paymentStatus === "unpaid" ? (sale.quantity * sale.price).toFixed(2) : sale.dueAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sale;
