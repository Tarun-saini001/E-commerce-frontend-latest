
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import About from './Pages/About'
import ContactUs from './Pages/ContactUs'
import Register from './Pages/Register'
import Login from './Pages/Login'

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
        </Routes>
      </div>
    </>
  )
}

export default App
