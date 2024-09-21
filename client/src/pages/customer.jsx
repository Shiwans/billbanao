import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { toast, Slide } from 'react-toastify';
// import TextExample from '../components/card';

const Customer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [customer, setCustomer] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [totalDue, setTotalDue] = useState("");
  
  useEffect(() => {
    const fetchCust = async () => {
      try {
        const response = await fetch('http://localhost:4000/customer', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setCustomer(data.data);
      } catch (error) {
        console.error('Unable to fetch customers', error);
        toast.error('Unable to fetch customers!', {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:4000/customer', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          contactInfo: {
            phone, email, address
          },totalJama: parseFloat(totalAmount) - parseFloat(totalDue),
          totalAmount: parseFloat(totalAmount),
          totalDue: parseFloat(totalDue),
          type: "customer"
        }),
        credentials: "include",
      });
      toast.success('Customer has been added!', {
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

      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setTotalAmount("");
      setTotalDue("");

      const response = await fetch('http://localhost:4000/customer');
      const data = await response.json();
      setCustomer(data.data);

    } catch (error) {
      console.error(error);
      toast.error('Unable to add customer!', {
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
      <Typography variant="h4" gutterBottom>Customerihog Details</Typography>
      
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
                id="phone"
                name="phone"
                label="Phone"
                fullWidth
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputProps={{ minLength: 10, maxLength: 10 }}
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
                id="address"
                name="address"
                label="Upi"
                fullWidth
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                 InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                 />
              </Grid>
               {/* id="totalDue" */}
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 name="totalDue"
                 label="Total Due"
                 fullWidth
                 value={totalDue}
                 onChange={(e) => setTotalDue(e.target.value)}
                 type="number"
                 InputProps={{ inputProps: { min: 0, step: 0.01 } }}
               />
             </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit">Submit</Button>
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
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Total Jama</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Total Due</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.map((cstm) => (
                <TableRow key={cstm._id}>
                  <TableCell>{cstm.name}</TableCell>
                  <TableCell>{cstm.contactInfo.phone}</TableCell>
                  <TableCell>{cstm.contactInfo.email}</TableCell>
                  <TableCell>{cstm.contactInfo.address}</TableCell>
                  <TableCell>{cstm.totalJama}</TableCell>
                  <TableCell>{cstm.totalAmount}</TableCell>
                  <TableCell>{cstm.totalDue}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small">Edit</Button>
                    <Button variant="outlined" size="small" color="error" sx={{ ml: 1 }}>Delete</Button>
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