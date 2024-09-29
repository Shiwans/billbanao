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

const Supplier = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [upi, setUpi] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [totalDue, setTotalDue] = useState("");
  const [supplier, setSupplier] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [editingSupplierId, seteditingSupplierId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const due = parseInt(totalAmount) - parseInt(totalPaid);
    setTotalDue(due);
  }, [totalAmount, totalPaid]);

  useEffect(() => {
    const fetchSupp = async () => {
      try {
        const response = await fetch("http://localhost:4000/supplier", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        const data = await response.json();
        // console.log(data); // Log the structure of data
        if (Array.isArray(data.data)) {
          setSupplier(data.data);
        } else {
          console.error("Expected an array, got:", data.data);
        }
      } catch (error) {
        console.error("Unable to fetch supplier", error);
        toast.error("Unable to fetch supplier!", {
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
    fetchSupp();
  }, []);

  const validateForm = () => {
    if (!name) {
      toast.error("Name is required", { position: "top-right", autoClose: 1000 });
      return false;
    }
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      toast.error("Phone number is invalid (must be 10 digits)", { position: "top-right", autoClose: 1000 });
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address", { position: "top-right", autoClose: 1000 });
      return false;
    }
    if (!upi) {
      toast.error("UPI is required", { position: "top-right", autoClose: 1000 });
      return false;
    }
    if (totalAmount <= 0) {
      toast.error("Total amount must be greater than 0", { position: "top-right", autoClose: 1000 });
      return false;
    }
    if (totalPaid < 0) {
      toast.error("Total paid cannot be negative", { position: "top-right", autoClose: 1000 });
      return false;
    }
    return true;
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/supplier/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
      });
      if (response.ok) {
        setSupplier((prevSupplier) =>
          prevSupplier.filter((supplier) => supplier._id !== id)
        );
        toast.success("Supplier deleted successfully!", {
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
        toast.error("Error deleting supplier!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete supplier!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    // // // Check if the name already exists among other suppliers
    const supplierExists = supplier.some(
        supp => supp.name.toLowerCase() === name.toLowerCase() && supp._id !== currentSupplier?._id
    );

    if (supplierExists) {
        toast.error("Supplier with this name already exists", { position: "top-right", autoClose: 1000 });
        return;
    }
    try {
      const method = editingSupplierId ? "PUT" : "POST";
      const url = editingSupplierId
        ? `http://localhost:4000/supplier/${editingSupplierId}`
        : "http://localhost:4000/supplier";
      // const response = await fetch(`http://localhost:4000/supplier/${currentSupplier._id}`, {
      await fetch(url, {
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
          type: "supplier",
        }),
        credentials: "include",
      });

      toast.success("Supplier updated successfully", {
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

      resetForm();

      const response = await fetch("http://localhost:4000/supplier",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials:true
      });
      const data = await response.json();
      setSupplier(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error updating supplier!", {
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
  seteditingSupplierId(customer._id);
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
  seteditingSupplierId(null);
};

return (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h4" gutterBottom>
      {editingSupplierId ? "Edit Supplier" : "Add Supplier"}
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
              required
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
              label="UPI"
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
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              name="totalPaid"
              label="Total Paid"
              fullWidth
              value={totalPaid}
              onChange={(e) => setTotalPaid(e.target.value)}
              type="number"
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Update Supplier" : "Add Supplier"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            {/* <TableCell>Email</TableCell> */}
            <TableCell>UPI</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Total Paid</TableCell>
            <TableCell>Total Due</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {supplier.map((cstm) => (
            <TableRow key={cstm._id}>
              <TableCell>{cstm.name}</TableCell>
              <TableCell>{cstm.contactInfo.phone}</TableCell>
              {/* <TableCell>{cstm.contactInfo.email}</TableCell> */}
              <TableCell>{cstm.contactInfo.upi}</TableCell>

              <TableCell>
                {cstm.totalAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </TableCell>
              <TableCell>
                {cstm.totalPaid.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
              </TableCell>
              <TableCell>
                {cstm.totalDue.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                })}
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
  </Container>
);
};

export default Supplier;
