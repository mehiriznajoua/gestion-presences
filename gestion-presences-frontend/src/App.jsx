import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employes from './pages/Employes'
import EmployeDetail from './pages/EmployeDetail'
import Pointage from './pages/Pointage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employes" element={<Employes />} />
        <Route path="/employes/:id" element={<EmployeDetail />} />
        <Route path="/pointage" element={<Pointage />} />
      </Routes>
    </>
  )
}

export default App