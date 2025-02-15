import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import  Home from './pages/home/home'
import Cart from './pages/cart/cart'
import Placeorder from './pages/placeorder/placeorder'
import Footer from './components/footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'

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
          <Route path='/placeholder' element={<Placeorder/>}/>
        </Routes>
      
    </div>
    <Footer/>
    </>
    
  )
}

export default App
