// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { toast, Slide } from "react-toastify";

// const Supplier = () => {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [upi, setUpi] = useState("");
//   const [totalAmount, setTotalAmount] = useState("");
//   const [totalPaid, setTotalPaid] = useState("");
//   const [totalDue, setTotalDue] = useState("");
//   const [supplier, setSupplier] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSupplier, setCurrentSupplier] = useState(null);

//   useEffect(() => {
//     const due = totalAmount - totalPaid;
//     setTotalDue(due);
//   }, [totalAmount, totalPaid]);

//   useEffect(() => {
//     const fetchSupp = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/supplier", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });
//         const data = await response.json();
//         setSupplier(data.data.reverse());
//       } catch (error) {
//         console.error("Unable to fetch supplier", error);
//         toast.error("Unable to fetch supplier!", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Slide,
//         });
//       }
//     };
//     fetchSupp();
//   }, []);

//   // Validation function
//   const validateForm = () => {
//     if (!name) {
//       toast.error("Name is required", {
//         position: "top-right",
//         autoClose: 1000,
//       });
//       return false;
//     }
//     if (!phone || !/^[0-9]{10}$/.test(phone)) {
//       toast.error("Phone number is invalid (must be 10 digits)", {
//         position: "top-right",
//         autoClose: 1000,
//       });
//       return false;
//     }
//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       toast.error("Invalid email address", {
//         position: "top-right",
//         autoClose: 1000,
//       });
//       return false;
//     }
//     if (!upi) {
//       toast.error("UPI is required", {
//         position: "top-right",
//         autoClose: 1000,
//       });
//       return false;
//     }
//     if (totalAmount <= 0) {
//       toast.error("Total amount must be greater than 0", {
//         position: "top-right",
//         autoClose: 1000,
//       });
//       return false;
//     }
//     if (totalPaid < 0) {
//       toast.error("Total paid cannot be negative", {
//         position: "top-right",
//         autoClose: 1000,
//       });
//       return false;
//     }
//     return true;
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:4000/supplier/delete/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );
//       if (response.ok) {
//         setSupplier((prevSupplier) =>
//           prevSupplier.filter((supplier) => supplier._id !== id)
//         );
//         toast.success("Supplier deleted successfully!", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Slide,
//         });
//       } else {
//         toast.error("Error deleting supplier!", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Slide,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Unable to delete supplier!", {
//         position: "top-right",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//         transition: Slide,
//       });
//     }
//   };

//   const handleUpdate = (supplier) => {
//     setIsEditing(true);
//     setCurrentSupplier(supplier);
//     // const { phone = "", email = "", upi = "" } = supplier.contactInfo || {};
//     setName(supplier.name);
//     setPhone(supplier.contactInfo.phone);
//     setEmail(supplier.contactInfo.email);
//     setUpi(supplier.contactInfo.upi);
//     setTotalAmount(supplier.totalAmount);
//     setTotalPaid(supplier.totalPaid);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if the form is valid
//     if (!validateForm()) return;
  
//     // Check if supplier already exists by name (client-side check)
//     const supplierExists = supplier.some(supp => supp.name.toLowerCase() === name.toLowerCase());
    
//     if (supplierExists) {
//       toast.error("Supplier with this name already exists", {
//         position: "top-right",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//         transition: Slide,
//       });
//       return;
//     }
//     const method = isEditing ? "PUT" : "POST";
//     const url = isEditing
//       ? `http://localhost:4000/supplier/update/${currentSupplier._id}`
//       : "http://localhost:4000/supplier";

//     try {
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           contactInfo: {
//             phone: Number(phone),
//             email,
//             upi,
//           },
//           totalAmount: Number(totalAmount),
//           totalPaid: Number(totalPaid),
//           totalDue: Number(totalDue),
//         }),
//         credentials: "include",
//       });

//       if (response.ok) {
//         const newSupplier = await response.json();
//         toast.success(
//           isEditing
//             ? "Supplier updated successfully"
//             : "Supplier added successfully",
//           {
//             position: "top-right",
//             autoClose: 1000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "dark",
//             transition: Slide,
//           }
//         );

//         if (isEditing) {
//           setSupplier((prevSupplier) =>
//             prevSupplier.map((supplier) =>
//               supplier._id === currentSupplier._id ? newSupplier : supplier
//             )
//           );
//         } else {
//           setSupplier((prevSupplier) => [newSupplier, ...prevSupplier]);
//         }

//         // Reset form
//         setName("");
//         setPhone("");
//         setEmail("");
//         setUpi("");
//         setTotalAmount("");
//         setTotalPaid("");
//         setIsEditing(false);
//         setCurrentSupplier(null);
//       } else {
//         toast.error("Error saving supplier!", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Slide,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Unable to save supplier!", {
//         position: "top-right",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//         transition: Slide,
//       });
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Add Supplier
//       </Typography>
//       <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 required
//                 id="name"
//                 name="name"
//                 label="Name"
//                 fullWidth
//                 variant="outlined"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 required
//                 id="phone"
//                 name="phone"
//                 label="Phone"
//                 fullWidth
//                 variant="outlined"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 type="tel"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 required
//                 id="email"
//                 name="email"
//                 label="Email"
//                 fullWidth
//                 variant="outlined"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 required
//                 id="upi"
//                 name="upi"
//                 label="UPI"
//                 fullWidth
//                 variant="outlined"
//                 value={upi}
//                 onChange={(e) => setUpi(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 id="totalAmount"
//                 name="totalAmount"
//                 label="Total Amount"
//                 value={totalAmount}
//                 fullWidth
//                 type="number"
//                 variant="outlined"
//                 onChange={(e) => setTotalAmount(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 variant="outlined"
//                 name="totalPaid"
//                 label="Total Paid"
//                 fullWidth
//                 value={totalPaid}
//                 onChange={(e) => setTotalPaid(e.target.value)}
//                 type="number"
//                 InputProps={{ inputProps: { min: 0, step: 0.01 } }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button type="submit" variant="contained" color="primary">
//                 {isEditing ? "Update Supplier" : "Add Supplier"}
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>UPI</TableCell>
//               <TableCell>Total Amount</TableCell>
//               <TableCell>Total Paid</TableCell>
//               <TableCell>Total Due</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {supplier.map((row) => (
//               <TableRow key={row._id}>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.contactInfo ? row.contactInfo.phone : 'N/A'}</TableCell>
//                 <TableCell>{row.contactInfo ? row.contactInfo.upi : 'N/A'}</TableCell>
//                 <TableCell>{row.totalAmount}</TableCell>
//                 <TableCell>{row.totalPaid}</TableCell>
//                 <TableCell>{row.totalDue}</TableCell>
//                 <TableCell>
//                   <Button variant="outlined" size="small" onClick={() => handleUpdate(row)}>Edit</Button>
//                   <Button variant="outlined" size="small" color="error" sx={{ ml: 1 }} onClick={() => handleDelete(row._id)} >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default Supplier;



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

  useEffect(() => {
    const due = totalAmount - totalPaid;
    setTotalDue(due);
  }, [totalAmount, totalPaid]);

  useEffect(() => {
    const fetchSupp = async () => {
      try {
        const response = await fetch("http://localhost:4000/supplier",{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        console.log(data); // Log the structure of data
        if (Array.isArray(data.data)) {
          setSupplier(data.data);
        } else {
          console.error("Expected an array, got:", data.data);
        }
      } catch (error) {
        console.error("Unable to fetch supplier", error);
        toast.error("Unable to fetch supplier!", { position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide, });
      }
    };
    fetchSupp();
  }, []);

  // const validateForm = () => {
  //   if (!name) {
  //     toast.error("Name is required", { position: "top-right", autoClose: 1000 });
  //     return false;
  //   }
  //   // if (!phone || !/^[0-9]{10}$/.test(phone)) {
  //   //   toast.error("Phone number is invalid (must be 10 digits)", { position: "top-right", autoClose: 1000 });
  //   //   return false;
  //   // }
  //   if (!email || !/\S+@\S+\.\S+/.test(email)) {
  //     toast.error("Invalid email address", { position: "top-right", autoClose: 1000 });
  //     return false;
  //   }
  //   if (!upi) {
  //     toast.error("UPI is required", { position: "top-right", autoClose: 1000 });
  //     return false;
  //   }
  //   if (totalAmount <= 0) {
  //     toast.error("Total amount must be greater than 0", { position: "top-right", autoClose: 1000 });
  //     return false;
  //   }
  //   if (totalPaid < 0) {
  //     toast.error("Total paid cannot be negative", { position: "top-right", autoClose: 1000 });
  //     return false;
  //   }
  //   return true;
  // };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/supplier/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        setSupplier((prevSupplier) => prevSupplier.filter((supplier) => supplier._id !== id));
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
        toast.error("Error deleting supplier!", { position: "top-right", autoClose: 1000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete supplier!", { position: "top-right", autoClose: 1000 });
    }
  };

  const handleUpdate = (supplier) => {
    setIsEditing(true);
    setCurrentSupplier(supplier);
    setName(supplier.name);
    setPhone(supplier.contactInfo.phone);
    setEmail(supplier.contactInfo.email);
    setUpi(supplier.contactInfo.upi);
    setTotalAmount(supplier.totalAmount);
    setTotalPaid(supplier.totalPaid);
  };
  const handlePost = async () => {
    const response = await fetch("http://localhost:4000/supplier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        contactInfo: {
          phone,
          email,
          upi,
        },
        totalAmount,
        totalPaid,
        totalDue,
      }),
      credentials: "include",
    });
  
    if (response.ok) {
      const newSupplier = await response.json();
      toast.success("Supplier added successfully", { position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide, });
      setSupplier((prevSupplier) => [newSupplier, ...prevSupplier]); // Add the new supplier to the front of the list
      return true;
    } else {
      toast.error("Error saving supplier!", { position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide, });
      return false;
    }
  };
  

  const handlePut = async () => {
    const response = await fetch(`http://localhost:4000/supplier/update/${currentSupplier._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        contactInfo: {
          phone,
          email,
          upi,
        },
        totalAmount,
        totalPaid,
        totalDue,
      }),
      credentials: "include",
    });
  
    if (response.ok) {
      const updatedSupplier = await response.json();
      toast.success("Supplier updated successfully", {position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide });
      setSupplier((prevSupplier) =>
        prevSupplier.map((supp) => (supp._id === currentSupplier._id ? updatedSupplier : supp))
      );
      return true;
    } else {
      toast.error("Error updating supplier!", { position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide, });
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    // // Check if the name already exists among other suppliers
    // const supplierExists = supplier.some(
    //     supp => supp.name.toLowerCase() === name.toLowerCase() && supp._id !== currentSupplier?._id
    // );

    // if (supplierExists) {
    //     toast.error("Supplier with this name already exists", { position: "top-right", autoClose: 1000 });
    //     return;
    // }

    if (isEditing) {
        const success = await handlePut();
        if (success) resetForm();
    } else {
        const success = await handlePost();
        if (success) resetForm();
    }
};

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setUpi("");
    setTotalAmount("");
    setTotalPaid("");
    setIsEditing(false);
    setCurrentSupplier(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Supplier
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
                type="number"
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
              <TableCell>Email</TableCell>
              <TableCell>UPI</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Total Paid</TableCell>
              <TableCell>Total Due</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplier.map((supp) => (
              <TableRow key={supp._id}>
                <TableCell>{supp.name}</TableCell>
                <TableCell>{supp.contactInfo?.phone || "N/A"}</TableCell>
                {/* <p>Phone: {supplier.contactInfo?.phone || 'N/A'}</p> */}
                <TableCell>{supp.contactInfo.email}</TableCell>
                <TableCell>{supp.contactInfo.upi}</TableCell>
                <TableCell>{supp.totalAmount}</TableCell>
                <TableCell>{supp.totalPaid}</TableCell>
                <TableCell>{supp.totalDue}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUpdate(supp)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete(supp._id)} color="secondary">Delete</Button>
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
