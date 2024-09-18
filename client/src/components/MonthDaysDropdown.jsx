import React, { useState } from "react";
import CustomerDropdown from "./customerDropdown";

const MonthDaysDropdown = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("")
  const [salesData, setSalesData] = useState([]); // Store fetched sales data
  const [list,setList] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:4000/sales?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSalesData(data); // Store the fetched data in state
      if(name){
        const filterList = salesData.filter((sale)=>sale.customerName === name)
        // console.log('filterlist',filterList)
        setList(filterList)
      }else{
        // console.log(salesData)
        setList(data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
        <div onChange={(e)=>{setName(e.target.value)}}>
            {<CustomerDropdown />}
        </div>
        <div >
        <label className="block text-gray-700 text-sm font-bold mb-1">
        startDate:-{" "}
      </label>
      <input
        className="text-black"
        type="date"
        onChange={(e) => {
          setStartDate(e.target.value);
        }}
      />

      <label className="block text-gray-700 text-sm font-bold mb-1">
        endDate:-{" "}
      </label>
      <input
        className="text-black"
        type="date"
        onChange={(e) => {
          setEndDate(e.target.value);
        }}
      />
        </div>
      
      <br></br>
      <button onClick={handleSubmit} className="bg-sky-700 m-2 p-2 rounded-xl	">
        Submit
      </button>
      {list.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {list.map((sale) => (
              <tr key={sale._id}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{sale.customerName}</td>
                <td>{sale.quantity}</td>
                <td>{sale.price}</td>
                <td>{sale.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MonthDaysDropdown;
