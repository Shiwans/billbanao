import React, { useState } from "react";
import Buttons from "../components/buttons";

const Supplier = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

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
          address,
        },
      }),
      credentials: "include",
    });

    console.log("response from customers", response);

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
  };
  return (
    <div>
      <h1>Supplier</h1>
      <ul>
        <li>
          same as customer but in supplier it automatically selected to supplier
        </li>
      </ul>
      <Buttons />
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>phone:</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label>email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Supplier;
