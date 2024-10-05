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
import UpdatePurchase from "../components/UpdatePurchase";
import PurchaseQuery from "../components/PurchaseQuery";

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
  const [supplierList, setSupplierList] = useState([]); //for listing dropdown
  const [recentPurchase, setRecentPurchase] = useState([]); //for listing last 10 purchase in table
  const [showPopup, setShowPopup] = useState(false); //for quering certain date's data
const [supplierId,setSupplierId] = useState("")
const [type,setType] = useState("")
const [quantityError, setQuantityError] = useState("");
const [priceError, setPriceError] = useState("");

  const token = localStorage.getItem("token");
  const fetchPurchase = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/purchase/10", {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();

      console.log("recent sales from purchase.js",data)
      setRecentPurchase(data.data);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  },[token]);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch("http://localhost:4000/supplier", {
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
        console.error("Unable to fetch supplier list", error);
        setSupplierList([]);
      }
    };
    fetchSupplier();

    fetchPurchase();
  }, [showPopup, token,fetchPurchase]);

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
    console.log('supplierType is:',type ,'supplierId is: ',supplierId)
    const response = await fetch("http://localhost:4000/purchase", {
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
        supplierId,

      }),
      credentials: "include",
    });

    await fetchPurchase();
    if (response.ok) {
      toast.success("purchase has been added!", {
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
      toast.error("Error saving purchase!", {
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
    <UpdatePurchase onClose={handleClose} actionBar={actionBar}>
      <h1>Update Purchase data</h1>
      <PurchaseQuery />
    </UpdatePurchase>
  );

  return (
    <div className={classes.noScroll}>
      <div className="flex justify-between mt-2">
        <Typography variant="h4" gutterBottom>
          Purchase
        </Typography>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleClick}
          >
            Change Purchase data
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
              label="Supplier Name"
              value={name}
              // onChange={(e) => setName(e.target.value)}
              onChange={(e) => {
                setName(e.target.value);
                // Find the selected customer ID based on the selected name
                const selectedSupplier = supplierList.find(supplier => supplier.name === e.target.value);
                setSupplierId(selectedSupplier ? selectedSupplier._id : "");
                setType(selectedSupplier ? selectedSupplier.type : "");
              }}
              fullWidth
              required
            >
              <MenuItem value="" disabled>
                Select Supplier
              </MenuItem>
              {supplierList.length > 0 ? (
                supplierList.map((supplier) => (
                  <MenuItem key={supplier._id} value={supplier.name}>
                    {supplier.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No suppliers found</MenuItem>
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
              error={Boolean(quantityError)}
              helperText={quantityError}
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
              error={Boolean(priceError)}
              helperText={priceError}
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
        Recent Purchases
      </Typography>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {recentPurchase.length > 0 ? (
              recentPurchase.map((purchase, index) => (
                <TableRow key={index} className={classes.tableRowHover}>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.name}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>{purchase.price}</TableCell>
                  <TableCell>
                    {(purchase.quantity * purchase.price)
                      .toFixed(2)
                      .toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "INR",
                      })}
                  </TableCell>
                  <TableCell>{purchase.paymentStatus}</TableCell>
                  <TableCell>{purchase.paymentDetails.paidAmount}</TableCell>
                  <TableCell>{purchase.paymentDetails.dueAmount}</TableCell>
                  {/* <TableCell>{purchase.paymentStatus === "paid" ? (purchase.quantity * purchase.price).toFixed(2) : purchase.paidAmount}</TableCell> */}
                  {/* <TableCell>{purchase.paymentStatus === "unpaid" ? (purchase.quantity * purchase.price).toFixed(2) : purchase.dueAmount}</TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Purchases found
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
