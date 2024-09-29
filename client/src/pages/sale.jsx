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
import { toast, Slide } from "react-toastify";
import UpdateSale from '../components/UpdateSale'
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
  const [paymentStatus, setPaymentStatus] = useState("");  //paid,partial,unpaid
  const [paidAmount, setPaidAmount] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [customerList, setCustomerList] = useState([]); //for listing dropdown
  const [recentSales, setRecentSales] = useState([]);
  const [showPopup,setShowPopup] = useState(false)

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:4000/customer", {
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

      const fetchSales = async () => {
        try {
          const response = await fetch("http://localhost:4000/sales/10", {
            method:"GET",
            headers:{
              "Content-Type":"application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });
          const data = await response.json();
  
          // Sort sales data by date (newest first)
          // const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setRecentSales(data);
          // setFilteredData(last10Sales); // Set it to filteredData if you're using filtering elsewhere
        } catch (error) {
          console.error("Error fetching sales data:", error);
        }
      };
  

    fetchSales();
    
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total =parseInt(quantity) * parseInt(price);
    let updatedPaidAmount = paidAmount;
    let updatedDueAmount = dueAmount;

    // Adjust due and paid amount based on payment status
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

    const response = await fetch("http://localhost:4000/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify({
        date:new Date(date),
        name,
        quantity: parseInt(quantity),
        price: parseInt(price),
        totalAmount,
        paymentStatus,
        paymentDetails: {
          paidAmount: parseInt(updatedPaidAmount),
          dueAmount: parseInt(updatedDueAmount),
        },
      }),
      credentials: "include",
    });

    if (response.ok) {
      toast.success('Sale has been added!', {
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
      toast.error('Error saving Sale!', {
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
            disabled
          />
        </Grid>
      </Grid>
    )
  );

  const handleClick = ()=>{
    setShowPopup(true)
  }

  const handleClose = () =>{
    setShowPopup(false)
  }
  const actionBar = <div>
    <Button variant="contained" color="primary" onClick={handleClose}>Save</Button>
  </div>
  let modal = <UpdateSale onClose={handleClose} actionBar={actionBar}>
    <h1>Update Sale data</h1>
    <DateQuery />

  </UpdateSale>

  return (
    <div className={classes.noScroll}>
      <div className="flex justify-between mt-2">
      <Typography variant="h4" gutterBottom>Sale</Typography>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" type="submit" onClick={handleClick}>
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              className={classes.textField}
              label="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                <TableCell>{sale.name}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.price}</TableCell>
                <TableCell>{(sale.quantity * sale.price).toFixed(2).toLocaleString('en-IN',{maximumFractionDigits: 2,style: 'currency',currency: 'INR'})}</TableCell>
                <TableCell>{sale.paymentStatus}</TableCell>
                <TableCell>{sale.paymentDetails.paidAmount}</TableCell>
                <TableCell>{sale.paymentDetails.dueAmount}</TableCell>
                {/* <TableCell>{sale.paymentStatus === "paid" ? (sale.quantity * sale.price).toFixed(2) : sale.paidAmount}</TableCell> */}
                {/* <TableCell>{sale.paymentStatus === "unpaid" ? (sale.quantity * sale.price).toFixed(2) : sale.dueAmount}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sale;
