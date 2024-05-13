import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Home from './Home'
import Navbar from './Navbar'
import Inputfield from './Inputfield'

const Dashboard = () => {
    const [count, setCount] = useState(0)
  return (
    <>
    
    <Navbar/>
    <Home/>
    
    
    </>
  )
}

export default Dashboard