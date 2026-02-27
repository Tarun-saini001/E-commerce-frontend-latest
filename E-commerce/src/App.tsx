
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'

function App() {

  return (
    <>
      <div>
        < Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Home />}/>
          <Route path='/verify-otp' element={<VerifyOtp />}/>
        </Routes>
      </div>
    </>
  )
}

export default App
