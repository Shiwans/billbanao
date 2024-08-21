import './App.css'
import SaleCreate from './components/SaleCreate';
import SaleShow from './components/SaleShow';
import {  useState } from 'react';
function App(){
  const [show,setShow] = useState(false)
  const [customers,setCustomers] = useState([]);
  const handleClick=()=>{
    setShow(!show)
  }

  const handleSubmit=(name,quantity,price,jama)=>{
    setShow(false);
    setCustomers([...customers,{id:Math.round(Math.random() * 9999),name:name,quantity:quantity,price:price,jama:jama}])
  }

  const editSales = (id,name,quantity,price,jama)=>{
    //edit sales
    const updatedSales=customers.map((customer)=>{
      if(customer.id === id){
        return {...customers,id,name,quantity,price,jama}
        }
    })
    setCustomers(updatedSales)
  }

  //delete  //FKT
  const deleteSale = (id)=>{
    const deleteS = customers.filter((customer)=>{
      if(customer.id !== id){
        return {...customers,customer}
      }
    })
    setCustomers(deleteS)
  }

  const rendereCustomer = customers.map((customer)=>{
    return <SaleShow cust={customer} editSale={editSales} deleteSale={deleteSale} />
  })

  let content = <div></div>;
  if (show) {
    content = <SaleCreate onSubmit={handleSubmit}/>;
  }

  return(
    <div className="h-screen w-3/4	mx-44 my-6" >
      <div className="flex justify-between m-8">
        <button className="bg-gray-300 rounded-lg w-18" onClick={handleClick}>Add customer</button>
        <input className="bg-gray-200" type="date" name="Date"></input>
      </div>
      <div>
        {content}
      </div>
      <table className="table">
      {/* border-collapse */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Jama</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rendereCustomer}
        </tbody>
      </table>
    </div>
  )
  
}

export default App;