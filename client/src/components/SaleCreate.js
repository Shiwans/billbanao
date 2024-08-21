import { useState } from "react";
import axios from 'axios';

function SaleCreate({onSubmit}){
    const [name,setName]  = useState("");
    const [quantity,setQuantity] = useState();
    const [price,setPrice] = useState();
    const [jama,setJama] = useState();
    const handleSubmit=(e)=>{
        e.preventDefault();
        onSubmit(name,quantity,price,jama);
            // axios.post("http://localhost:4000/sales",{name,quantity,price,jama}).then(response=>{
            //     console.log('added successfully')
            // })
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
        <div>
            {/* <input className="bg-gray-200" type="date" name="Date"></input> */}
            <form onSubmit={handleSubmit} className="ml-8">
                <label>Customer name:</label>
                <input type="text" placeholder="shiwans" onChange={handleNameChange} required autoFocus></input>
                <label>quantity:</label>
                <input type="number" placeholder="quantity" onChange={handleQuantity}required></input>
                <label>price:</label>
                <input type="number" placeholder="price" onChange={handlePrice} required></input>
                <label>Jama:</label>
                <input type="number" placeholder="jama" onChange={handleJama} ></input>
                <input type="submit" value="Submit" className="text-white bg-gray-500 m-2 p-1 rounded-lg"></input>
                <input type="Reset" value="Reset" className="text-white bg-gray-500 m-2 p-1 rounded-lg"></input>
            </form>
        </div>
    );
}

export default SaleCreate;