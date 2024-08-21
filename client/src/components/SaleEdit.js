import { useState } from "react";
function SaleEdit({cust, onSub}){
    const [name,setName]  = useState(cust.name);
    const [quantity,setQuantity] = useState(cust.quantity);
    const [price,setPrice] = useState(cust.price);
    const [jama,setJama] = useState(cust.jama);

    const handleSubmit = (e) =>{
        e.preventDefault();
        onSub(cust.id,name,quantity,price,jama);
    }


    const handleNameChange = (e)=>{
        setName(e.target.value)
        // console.log({name})
    }
    const handleQuantity = (e)=>{
        setQuantity(e.target.value)
    }
    const handleJama = (e)=>{
        setJama(e.target.value)
    }
    const handlePrice = (e)=>{
        setPrice(e.target.value)
    }


    return(
      <tr>
        <td><input type="text" value={name} onChange={handleNameChange}></input></td>
        <td> <input type="number" value={quantity} onChange={handleQuantity}></input></td>
        <td><input type="number" value={price} onChange={handlePrice} ></input></td>
        <td>{quantity*price}</td>
        <td><input type="number" value={jama} onChange={handleJama}></input></td>
        <td>
            <button onClick={handleSubmit}>save</button>
        </td>
      </tr>
    )
}
export default SaleEdit;