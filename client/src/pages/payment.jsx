// import React, { useState, useEffect } from "react";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";

// const Payment = () => {
//   const [payerType, setPayerType] = useState("");
//   const [method, setMethod] = useState("");
//   const [name, setName] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [date, setDate] = useState("");
//   const [customerList, setCustomerList] = useState([]);

//   // Fetch customers and suppliers when the component mounts
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/customer", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         const response2 = await fetch("http://localhost:4000/supplier", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         // Parse the JSON response
//         const result = await response.json();
//         const result2 = await response2.json();

//         // Combine customer and supplier lists
//         const list = result.data.concat(result2.data);
//         setCustomerList(list);

//       } catch (error) {
//         console.error("Unable to fetch customer/supplier list", error);
//         setCustomerList([]); // Fallback in case of error
//       }
//     };

//     fetchCustomers();
//   }, []);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:4000/payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           payerType,
//           method,
//           payerName:name,
//           amount: Number(amount), // Ensure amount is sent as a number
//           paymentDate:date,
//         }),
//         credentials: "include",
//       });

//       // Check if the request was successful
//       if (response.ok) {
//         // Clear form fields after successful submission
//         setPayerType("");
//         setMethod("");
//         setName("");
//         setAmount(0);
//         setDate("");
//         console.log("Payment data saved successfully");
//       } else {
//         console.error("Failed to save payment data:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error occurred while saving payment:", error);
//     }
//   };

//   // Handle customer name selection
//   const handleNameChange = (e) => {
//     const selectedName = e.target.value;
//     setName(selectedName);

//     const selectedCustomer = customerList.find(
//       (cust) => cust.name === selectedName
//     );

//     if (selectedCustomer) {
//       setPayerType(selectedCustomer.type || "Select Payer type");
//     } else {
//       setPayerType("");
//     }
//   };

//   return (
//     <div>
//       <h1>Payment</h1>
//       <ul>
//         <li>It could be on the right side or a popup to fill data</li>
//       </ul>

//       <Form onSubmit={handleSubmit}>
//         {/* PayerType: Automatically set based on selected customer */}
//         <Form.Group>
//           <Form.Label>Payer Type</Form.Label>
//           <Form.Control
//             as="select"
//             value={payerType}
//             onChange={(e) => setPayerType(e.target.value)}
//             disabled
//           >
//             <option value="">Select Payer Type</option>
//             <option value="customer">Customer</option>
//             <option value="supplier">Supplier</option>
//           </Form.Control>
//         </Form.Group>

//         {/* Customer/Supplier Name Selection */}
//         <Form.Group>
//           <Form.Label>Select Name</Form.Label>
//           <Form.Select as="select" value={name} onChange={handleNameChange}>
//             <option>Select name</option>
//             {customerList.map((cstm) => (
//               <option key={cstm._id} value={cstm.name}>
//                 {cstm.name}
//               </option>
//             ))}
//           </Form.Select>
//         </Form.Group>

//         {/* Amount and Date Fields */}
//         <Form.Group className="mb-3" controlId="formBasicAmount">
//           <Form.Label>Amount</Form.Label>
//           <Form.Control
//             type="number"
//             placeholder="amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="formBasicDate">
//           <Form.Label>Date</Form.Label>
//           <Form.Control
//             type="date"
//             placeholder="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </Form.Group>

//         {/* Payment Method */}
//         <Form.Group>
//           <Form.Label>Payment Method</Form.Label>
//           <Form.Select
//             aria-label="Default select example"
//             value={method}
//             onChange={(e) => setMethod(e.target.value)}
//           >
//             <option value="">Select method</option>
//             <option value="online">Online</option>
//             <option value="cash">Cash</option>
//             <option value="cheque">Cheque</option>
//           </Form.Select>
//         </Form.Group>

//         {/* Submit Button */}
//         <br />
//         <Button type="submit">Submit form</Button>
//       </Form>
//     </div>
//   );
// };

// export default Payment;

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
    // Dark background for contrast
       color: "white", // White text for visibility
       padding: "20px",
       borderRadius: "8px",
     },
     textField: {
       "& .MuiInputBase-input": {
         color: "white", // Input text color
       },
       "& .MuiInputLabel-root": {
         color: "white", // Label text color
       },
       "& .MuiInputLabel-root.Mui-focused": {
         color: "blue", // Label color when focused
       },
       "& .MuiOutlinedInput-root": {
         "& fieldset": {
           borderColor: "white", // Border color
         },
         "&:hover fieldset": {
           borderColor: "blue", // Border color on hover
         },
         "&.Mui-focused fieldset": {
           borderColor: "blue", // Border color when focused
         },
       },
     },
     tableRowHover: {
       "&:hover": {
         backgroundColor: "#f5f5f5", // Light gray hover effect
       },
     },
     noScroll: {
       overflowY: "hidden", // Remove scrollbar
       height: "100vh", // Full viewport height
     },
   }));

const Payment = () => {
  const classes = useStyles();

  const [payerType, setPayerType] = useState("");
  const [method, setMethod] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    // Simulate recent payments data (replace with actual backend data)
    const fetchRecentPayments = () => {
      const payments = [
        { name: "Shiwans", date: "2024-09-20", amountPaid: 10000, type: "Online" },
        { name: "Sashi", date: "2024-09-19", amountPaid: 15000, type: "Cash" },
        { name: "Samarth", date: "2024-09-18", amountPaid: 2000, type: "Cheque" },
        { name: "Virendar", date: "2024-09-17", amountPaid: 5000, type: "Online" },
        { name: "Santosh", date: "2024-09-16", amountPaid: 7000, type: "Cash" },
      ];
      setRecentPayments(payments);
    };

    fetchRecentPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className={classes.noScroll}>
      <Typography variant="h4" gutterBottom>Payment</Typography>
      
      {/* Payment Form */}
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Payer Type"
              className={classes.textField}

              value={payerType}
              onChange={(e) => setPayerType(e.target.value)}
              fullWidth
              required
              select
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="supplier">Supplier</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Select Name"
              value={name}
              className={classes.textField}

              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              select
            >
              <MenuItem value="" disabled>Select name</MenuItem>
              {["Shiwans", "Sashi", "Samarth", "Virendar", "Santosh"].map((customer) => (
                <MenuItem key={customer} value={customer}>
                  {customer}
                </MenuItem>
              ))}
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
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Recent Payments Table */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>Recent Payments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount Paid (₹)</TableCell>
              <TableCell>Payment Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentPayments.map((payment, index) => (
              <TableRow key={index} className={classes.tableRowHover}>
                <TableCell>{payment.name}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.amountPaid}</TableCell>
                <TableCell>{payment.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Payment;
