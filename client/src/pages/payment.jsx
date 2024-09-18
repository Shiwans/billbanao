import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Buttons from "../components/buttons";
import Form from "react-bootstrap/Form";

const Payment = () => {
  const [payerType, setPayerType] = useState("");
  const [method, setMethod] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [customerList, setcustomerList] = useState([]);

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
        const response2 = await fetch("http://localhost:4000/supplier", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        // Parse the JSON response
        const result = await response.json();
        const result2 = await response2.json();
        const list = result.data.concat(result2.data);
        console.log("list", list);
        setcustomerList(list);
        // console.log(customerList)
      } catch (error) {
        console.error("unable to fetch customer list", error);
        setcustomerList([]); // Fallback in case of error
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:4000/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payerType,
        method,
        name,
        amount,
        date,
      }),
      credentials: "include",
    });

    setPayerType("");
    setMethod("");
    setName("");
    setAmount(0);
    setDate("");
  };

  const handleNameChange = (e) => {
    const selectedName = e.target.value;
    setName(selectedName);

    const selectedCustomer = customerList.find(
      (cust) => cust.name === selectedName
    );
    console.log("payertype", selectedCustomer.type);
    if (selectedCustomer) {
      if (selectedCustomer.type == null) {
        setPayerType("Select Payer type");
      } else {
        setPayerType(selectedCustomer.type);
      }
    } else {
      setPayerType("");
    }
  };

  return (
    <div>
      <h1>Payment</h1>
      <ul>
        <li>it could be on right side or a popup to fill data</li>
      </ul>
      <Buttons />

      <Form onSubmit={handleSubmit}>
        {/* PayerType: Automatically set based on selected customer */}
        <Form.Group>
          <Form.Label>Payer Type</Form.Label>
          <Form.Control
            as="select"
            value={payerType}
            onChange={(e) => setPayerType(e.target.value)}
            disabled
          >
            <option value="">Select Payer Type</option>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
          </Form.Control>
        </Form.Group>
        <Form.Select as="select" onChange={handleNameChange}>
          <option>Select name</option>
          {customerList.map((cstm) => (
            <option key={cstm._id} value={cstm.name}>
              {cstm.name}
            </option>
          ))}
        </Form.Select>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Amount: </Form.Label>
          <Form.Control
            type="number"
            placeholder="amount"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />

          <Form.Label>Date: </Form.Label>
          <Form.Control
            type="date"
            placeholder="date"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            setMethod(e.target.value);
          }}
        >
          <option>method</option>
          <option value="online">online</option>
          <option value="cash">cash</option>
          <option value="cheque">cheque</option>
        </Form.Select>
        <br />
        <Button type="submit">Submit form</Button>
      </Form>
    </div>
  );
};

export default Payment;
