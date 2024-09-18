import React, { useState, useEffect } from "react";
import Buttons from "../components/buttons";

const Sale = () => {
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paidAmount, setPaidAmount] = useState();
  const [dueAmount, setDueAmount] = useState();
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerList, setCustomerList] = useState([]); // Initialize as an empty array

  // Fetch customer list from the backend
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
        console.log('result from sale',result)
        // Ensure the result is an array, if not, set an empty array.
          setCustomerList(result.data);
      } catch (error) {
        console.error("Unable to fetch customer list", error);
        setCustomerList([]); // Fallback in case of error
      }
    };

    fetchCustomers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();// Use date-fns to format the date correctly
    
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
        paymentStatus,
        paymentDetails: {
          paidAmount: Number(paidAmount),
          dueAmount: Number(dueAmount),
        },
        // type:
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
    setQuantity(0);
    setPrice(0);
    setPaymentStatus("");
    setPaidAmount(0);
    setDueAmount(0);
  };

  // Conditionally render payment details input fields if payment status is partial
  function partialCall() {
    if (paymentStatus === 'partial') {
      return (
        <div>
          <label>Payment Details</label>
          <input
            placeholder="Paid Amount"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Due Amount"
            value={dueAmount}
            onChange={(e) => setDueAmount(e.target.value)}
            required
          />
        </div>
      );
    }
  }

  return (
    <div>
      <h1>Sale</h1>
      <ul>
        <li>Just like customer, where we can see other users' data and transactions</li>
        <li>With sales, we can see quantity, price, sales, etc.</li>
      </ul>
      <Buttons />
      
      {/* Sale Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date: <span className="required">*</span></label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Customer Name: <span className="required">*</span></label>
          <select onChange={(e) => setCustomerName(e.target.value)} value={customerName} required>
            <option value="" disabled>Select Customer</option>
            {customerList.length > 0 ? (
              customerList.map((customer) => (
                <option key={customer._id} value={customer.name}>
                  {customer.name}
                </option>
              ))
            ) : (
              <option disabled>No customers found</option>
            )}
          </select>
        </div>

        <div>
          <label>Quantity: <span className="required">*</span></label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Price: <span className="required">*</span></label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Payment Status: </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            required
          >
            <option value="">Select Payment Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {partialCall()}

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Sale;
