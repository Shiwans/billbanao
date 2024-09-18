import React from 'react'
import Buttons from "../components/buttons"

const Expense = () => {
  return (
    <div>
        <h1>Expense</h1>
        <ul>
            <li>list expenses like daily wages</li>
            <li>transporting</li>
            <li>miscellineous</li>
        </ul>
        <Buttons />
    </div>
  )
}

export default Expense