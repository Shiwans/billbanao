import React, {useState,useEffect} from 'react'
import Buttons from '../components/buttons'
import { toast,Slide } from 'react-toastify';
import TextExample from '../components/card'

const Customer = () => {
  const [name, setName] = useState("")
  const [phone,setPhone] = useState("")
  const [email,setEmail] = useState("")
  const [address,setAddress] = useState("")
  const [customer,setCustomer] = useState([])

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
        setCustomer(data.data); // Set directly, not appending to avoid duplicates
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

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      await fetch('http://localhost:4000/customer',{
        method:'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          name,
          contactInfo:{
            phone,email,address
          },
          type:"customer"
        }),
        credentials:"include",
      })
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
  
      setName("")
      setPhone("")
      setEmail("")
      setAddress("")

      const response = await fetch('http://localhost:4000/customer');
      const data = await response.json();
      setCustomer(data.data);
      
    } catch (error) {
      console.log(error)
      toast.error('Unagle to add customer!', {
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
  }
  return (
    <div>
      <h1>Customers</h1>
      <ul>
        <li>Add customer at bottom</li>
        <li>form with party name,phone no,opening balance,who are they customer or supplier</li>
        <li>after user selecting customer it shows customer details and total money you get or give</li>
        <li>and some transaction in that</li>
      </ul>
      <Buttons />
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label>Name:</label>
            <input
              className="text-black"
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
              className="text-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>
          <div>
            <label>email:</label>
            <input
              type="email"
              className="text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              placeholder="address"
              className="text-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      {customer.map((cstm) => (
             <TextExample key={cstm._id} customer={cstm} />
          ))} 
      {/* <TextExample name={"shiwans"}/> */}
    </div>
  )
}

export default Customer