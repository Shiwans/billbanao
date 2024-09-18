import React,{useState,useEffect} from "react";


const CustomerDropdown = () => {
  const [customerList, setCustomerList] = useState([]);
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
        setCustomerList(result.data);
      } catch (error) {
        console.error("unable to fetch customer list", error);
        setCustomerList([]);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
        <form>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Name:
            </label>
            <select
              required
              className=" px-2 py-1 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select Customer
              </option>
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
        </form>
      </div>
  );
};

export default CustomerDropdown;
