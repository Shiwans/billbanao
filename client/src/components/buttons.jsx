import React from 'react'

const buttons = () => {
  return (
    <div>
        <button className='bg-red-400 ml-4 p-3'><a href="/">dashboard</a></button>
        <button className='bg-red-400 ml-4 p-3'><a href="/customer">customer</a></button>
        <button className='bg-red-400 ml-4 p-3'><a href="/supplier">supplier</a></button>
        <button className='bg-red-400 ml-4 p-3'><a href="/expense">expense</a></button>
        <button className='bg-red-400 ml-4 p-3'><a href="/sale">sale</a></button>
        <button className='bg-red-400 ml-4 p-3'><a href="/payment">payment</a></button>
        <button className='bg-red-400 ml-4 p-3'><a href="/report">report</a></button>
        <button className='bg-red-400 ml-4 p-3'><a href="/data">data</a></button>
    </div>
  )
}

export default buttons