import React, { useState, useEffect, useCallback } from "react";
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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { toast, Slide } from "react-toastify";
import UpdatePay from "../components/UpdatePay";
import PayQuery from "../components/DateQuery";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    color: "white",
    padding: "20px",
    borderRadius: "8px",
  },
  textField: {
    "& .MuiInputBase-input": {
      color: "white", // Input color
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#91b9ff", // Focused Label color
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white", // Default border color
      },
      "&:hover fieldset": {
        borderColor: "#325fad", // Hover border color
      },
      "&.Mui-focused fieldset": {
        borderColor: "#407fed", // Focused border color
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

const Payment = () => {
  const classes = useStyles();

  const [payerType, setPayerType] = useState("");
  const [method, setMethod] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [recentPayments, setRecentPayments] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentType, setPaymentType] = useState("received"); 
  const [customergId,setCustomerId] = useState("")
  const [suppliergId,setSupplierId] = useState("")
  const [amount, setAmount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const [customerResponse, supplierResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/customer`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/supplier`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }),
        ]);

        const customerData = await customerResponse.json();
        const supplierData = await supplierResponse.json();

        setCustomerList([
          ...customerData.data.map((cust) => ({
            ...cust,
            payerType: "customer",
          })),
          ...supplierData.data.map((supp) => ({
            ...supp,
            payerType: "supplier",
          })),
        ]);
      } catch (error) {
        console.error("Unable to fetch customer/supplier list", error);
        setCustomerList([]); 
      }
    };

    fetchCustomers();

    fetch10Pay();
  }, [token]);

  // useEffect(() => {
  // const fetch10Pay = async () => {
  //   try {
  //     const response = await fetch("http://localhost:4000/payment/10", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,

  //       },
  //       credentials: "include",
  //     });
  //     const result = await response.json();
  //     setRecentPayments(result);

  //   } catch (error) {
  //     console.error("Error fetching payment data:", error);
  //   }
  // }
  //   fetch10Pay();
  // }, [showPopup,token])
  const fetch10Pay = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payment/10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const result = await response.json();
      setRecentPayments(result);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  }, [token, showPopup, recentPayments]);

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleNameChange = (e) => {
    const selectedName = e.target.value;
    setName(selectedName);

    const selectedCustomer = customerList.find(
      (cust) => cust.name === selectedName
    );
    if (selectedCustomer) {
      setPayerType(selectedCustomer.payerType);
      if (selectedCustomer.payerType === "customer") {
        setCustomerId(selectedCustomer._id); 
        setSupplierId(""); 
      } else if (selectedCustomer.payerType === "supplier") {
        setSupplierId(selectedCustomer._id); 
        setCustomerId(""); 
      }
    
      console.log("Customer or Supplier selected:", selectedCustomer.payerType, selectedCustomer._id);
    } else {
      setPayerType("");
      setCustomerId("");
      setSupplierId("");
    }
  
  };

  const updateSupplierDueAmount = async (supplierId, amount) => {
  // const updateSupplierDueAmount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/supplier/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming you need authorization
        },
        body: JSON.stringify({
          paymentAmount: parseInt(amount), // The new due amount to update
          supplierId:suppliergId
        }),
      });
  
      if (response.ok) {
        toast.success("Supplier due amount updated!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Slide,
        });
      } else {
        toast.error("Failed to update supplier due amount!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Slide,
        });
      }
    } catch (error) {
      toast.error("Error updating supplier due amount!", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Slide,
      });
    }
  };
  

  const updateCustomerDueAmount = async (customerId, amount) => {
    // const updateSupplierDueAmount = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customer/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you need authorization
          },
          body: JSON.stringify({
            paymentAmount: parseInt(amount), // The new due amount to update
            customerId:customergId
          }),
        });
    
        if (response.ok) {
          toast.success("Supplier due amount updated!", {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Slide,
          });
        } else {
          toast.error("Failed to update supplier due amount!", {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Slide,
          });
        }
      } catch (error) {
        toast.error("Error updating supplier due amount!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Slide,
        });
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payerType,
          method,
          payerName: name,
          amount: parseInt(amount, 10),
          paymentDate: date,
          paymentType
        }),
        credentials: "include",
      });
      await fetch10Pay();
      if (response.ok) {
        toast.success("Payment has been added!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Slide,
        });

        if(payerType){
          const sendReq = await payerType ==="customer" ?  updateCustomerDueAmount(customergId,amount):updateSupplierDueAmount(suppliergId, amount);
          console.log('sendReq',sendReq)
        }

        // Reset form fields after successful submission
        setPayerType("");
        setMethod("");
        setName("");
        setAmount("");
        setDate("");
      } else {
        toast.error("Failed to save payment!", {
          position: "top-right",
          autoClose: 1000,
          theme: "dark",
          transition: Slide,
        });
      }
    } catch (error) {
      toast.error("Error connecting to server!", {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  const actionBar = (
    <div>
      <Button variant="contained" color="primary" onClick={handleClose}>
        Close
      </Button>
    </div>
  );

  let modal = (
    <UpdatePay onClose={handleClose} actionBar={actionBar}>
      <h1>Update Payment data</h1>
      <PayQuery />
    </UpdatePay>
  );

  return (
    <div className={classes.noScroll}>
      <div className="flex justify-between mt-2">
        <Typography variant="h4" gutterBottom>
          Payment
        </Typography>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleClick}
          >
            Change Payment data
          </Button>
          {showPopup && modal}
        </Grid>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormLabel component="legend">Payment Type</FormLabel>
            <RadioGroup
              row
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <FormControlLabel
                value="received"
                control={<Radio />}
                label="Received"
              />
              <FormControlLabel value="paid" control={<Radio />} label="Paid" />
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Payer Type"
              className={classes.textField}
              value={payerType}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              className={classes.textField}
              label="Customer Name"
              value={name}
              onChange={handleNameChange}
              fullWidth
              required
            >
              <MenuItem value="">Select Customer/Supplier</MenuItem>
              {customerList.length > 0 ? (
                customerList.map((customer) => (
                  <MenuItem key={customer._id} value={customer.name}>
                    {customer.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No customers/suppliers found</MenuItem>
              )}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Amount"
              className={classes.textField}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
              min="1"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              className={classes.textField}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Payment Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              fullWidth
              className={classes.textField}
              required
              select
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit Payment
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Recent Payments Table */}
      <div className="my-8">
        <Typography variant="h5" gutterBottom>
          Recent Payments
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>PaymentType</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {recentPayments.length >0? ( */}

              {recentPayments.map((payment, index) => (
                <TableRow key={index} className={classes.tableRowHover}>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>{payment.paymentType}</TableCell>
                  <TableCell>{payment.payerType}</TableCell>
                  <TableCell>{payment.payerName}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                </TableRow>
              ))}
              {/* // : ( */}
              {/* //   <TableRow> */}
              {/* //     <TableCell colSpan={5} align="center"> */}
              {/* //       No recent payments found */}
              {/* //     </TableCell> */}
              {/* //   </TableRow> */}
              {/* // )} */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Payment;


