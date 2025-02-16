import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import  Home from './pages/home/home'
import Cart from './pages/cart/cart'
import Placeorder from './pages/placeorder/placeorder'
import Footer from './components/footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Myorders from './pages/myorders/Myorders'
import Verify from './pages/verify/Verify'

const App = () => {

  const[showLogin,setShowLogin]=useState(false)

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<Placeorder/>}/>
          <Route path ='/Verify' element={<Verify/>}/>
          <Route path='/Myorders' element={<Myorders/>}/>
        </Routes>
      
    </div>
    <Footer/>
    </>
    
  )
}

export default App
