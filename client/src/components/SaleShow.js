import SaleEdit from "./SaleEdit";
import {useState} from 'react';

function SaleShow({cust, editSale, deleteSale}){
    const [showEdit, setShowEdit] =useState(false);

    const handleEditClick = () =>{
        setShowEdit(true);
    }

    const handleDelete = () =>{
        
        deleteSale(cust.id)
    }

    const handleEdit = (id,name,quantity,price,jama)=>{
        setShowEdit(!showEdit)
        console.info(`uname:${name},quantity:${quantity},${price},${jama}`)
        editSale(id,name,quantity,price,jama)
    }
    if(showEdit){
        return <SaleEdit cust={cust} onSub={handleEdit}/>
    }
    return(
        <tr>
            <td>{cust.name}</td>
            <td>{cust.quantity}</td>
            <td>{cust.price}</td>
            <td>{cust.quantity*cust.price}</td>
            <td>{cust.jama}</td>
            <td>
                <button onClick={handleEditClick}>edit</button>
                <button onClick={handleDelete}>delete</button>
            </td>
          </tr>
    
    )
}

export default SaleShow;