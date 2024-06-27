import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
function App() {

  return (
    <Router>
      <Routes>
        { /*  Las rutas de la app */}
        <Route path='/' element= {<Home />}/>
        <Route path='/Login' element= {<Login />}/>
        <Route path='/Register' element= {<Register />}/>
      </Routes>
    </Router>
  )
}

export default App
