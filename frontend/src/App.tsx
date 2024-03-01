import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import CameraApp from './components/CameraApp'
import CameraQR from './components/CameraQR'
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element= {<Home />}/>
        <Route path='/Login' element= {<Login />}/>
        <Route path='/Register' element= {<Register />}/>
        <Route path='/camera' element= {<CameraQR />}/>
        <Route path="/camera/mobileApp/:token" element={<CameraApp />}/>


      </Routes>
    </Router>
  )
}

export default App
