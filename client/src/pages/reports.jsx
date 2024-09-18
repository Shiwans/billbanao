import React from 'react'
import Buttons from "../components/buttons"

const Reports = () => {
  return (
    <div>
        <h1>Reports</h1>
        <ul>
            <li>transaction report</li>
            <li>sales report</li>
            <li>purchase report</li>
            <li>cashbook report optional</li>
            <li>sales day-wise report</li>
            <li>purchase day-wise report</li>
        </ul>
        <Buttons />
    </div>
  )
}

export default Reports