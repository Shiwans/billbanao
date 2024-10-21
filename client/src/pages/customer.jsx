import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast, Slide } from "react-toastify";
// import TextExample from '../components/card';

const Customer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [upi, setUpi] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [totalDue, setTotalDue] = useState("");
  const [customer, setCustomer] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const due = parseInt(totalAmount) - parseInt(totalPaid);
    setTotalDue(due);
  }, [totalAmount, totalPaid]);

  useEffect(() => {
    const fetchCust = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customer`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
          credentials: "include",
        });
        const data = await response.json();
        setCustomer(data.data);
      } catch (error) {
        console.error("Unable to fetch customers", error);
        toast.error("Unable to fetch customers!", {
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
    fetchCust();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCustomerId
        ? `${process.env.REACT_APP_BACKEND_URL}/customer/${editingCustomerId}`
        : `${process.env.REACT_APP_BACKEND_URL}/customer`;
      const method = editingCustomerId ? "PUT" : "POST";
  
      // Fetch request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          contactInfo: {
            phone,
            email,
            upi,
          },
          totalAmount: parseInt(totalAmount),
          totalPaid: parseInt(totalPaid),
          totalDue: parseInt(totalDue),
          type: "customer",
        }),
        credentials: "include",
      });
  
      // Debugging response details
      const data = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", data);
  
      // Check response status
      if (response.ok) {
        toast.success(
          editingCustomerId
            ? "Customer has been updated!"
            : "Customer has been added!",
          {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
          }
        );
        
        resetForm();
  
        const fetchResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customer`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const fetchData = await fetchResponse.json();
        setCustomer(fetchData.data);
      } else {
        // Show error message with response data
        toast.error(`Error saving customer! ${data.message || 'Please try again.'}`, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error occurred while saving customer:", error);
      toast.error("Unable to save customer!", {
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
  
  

  const handleEdit = (customer) => {
    setEditingCustomerId(customer._id);
    setName(customer.name);
    setPhone(customer.contactInfo.phone);
    setEmail(customer.contactInfo.email);
    setUpi(customer.contactInfo.upi);
    setTotalAmount(customer.totalAmount);
    setTotalPaid(customer.totalPaid);
    setTotalDue(customer.totalDue);
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setUpi("");
    setTotalAmount("");
    setTotalPaid("");
    setTotalDue("");
    setEditingCustomerId(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customer/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        setCustomer((prevCust) =>
          prevCust.filter((customer) => customer._id !== id)
        );
        toast.success("Customer deleted successfully!", {
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
        toast.error("Error deleting customer!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("unable to delete customer!", {
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* <Typography variant="h4" gutterBottom>Add Customer</Typography> */}
      <Typography variant="h4" gutterBottom>
        {editingCustomerId ? "Edit Customer" : "Add Customer"}
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                type="number"
                id="phone"
                name="phone"
                label="Phone"
                fullWidth
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
                error={phone.length !== 10 && phone.length > 0} 
                helperText={phone.length !== 10 && phone.length > 0 ? "Phone number must be exactly 10 digits." : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="upi"
                name="upi"
                label="Upi"
                fullWidth
                variant="outlined"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="totalAmount"
                name="totalAmount"
                label="Total Amount"
                value={totalAmount}
                fullWidth
                type="number"
                variant="outlined"
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </Grid>
            {/* id="totalDue" */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                name="totalpaid"
                label="Total paid"
                fullWidth
                value={totalPaid}
                onChange={(e) => setTotalPaid(e.target.value)}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              {/* <Button variant="contained" color="primary" fullWidth type="submit">Submit</Button> */}
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {editingCustomerId ? "Update Customer" : "Add Customer"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Upi</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Total Paid</TableCell>
                <TableCell>Total Due</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.map((cstm) => (
                <TableRow key={cstm._id}>
                  <TableCell>{cstm.name}</TableCell>
                  <TableCell>{cstm.contactInfo.phone}</TableCell>
                  <TableCell>{cstm.contactInfo.upi}</TableCell>
                  <TableCell>
                    {cstm.totalAmount !== null && cstm.totalAmount !== undefined
                      ? cstm.totalAmount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "INR",
                        })
                      : "N/A"}{" "}
                    {/* Replace 'N/A' with your preferred fallback value */}
                  </TableCell>
                  <TableCell>
                    {cstm.totalPaid !== null && cstm.totalPaid !== undefined
                      ? cstm.totalPaid.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })
                      : "N/A"}{" "}
                    {/* Replace 'N/A' with your preferred fallback value */}
                  </TableCell>
                  <TableCell>
                    {cstm.totalDue !== null && cstm.totalDue !== undefined
                      ? cstm.totalDue.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "INR",
                        })
                      : "N/A"}{" "}
                    {/* Replace 'N/A' with your preferred fallback value */}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(cstm)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        handleDelete(cstm._id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Customer;
