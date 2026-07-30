import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employes from './pages/Employes'
import EmployeDetail from './pages/EmployeDetail'
import AjoutEmploye from './pages/AjoutEmploye'
import Presences from './pages/Presences'
import Pointage from './pages/Pointage'
import CreationCompte from './pages/CreationCompte'

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/'

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employes" element={<Employes />} />
        <Route path="/employes/nouveau" element={<AjoutEmploye />} />
        <Route path="/employes/:id" element={<EmployeDetail />} />
        <Route path="/presences" element={<Presences />} />
        <Route path="/pointage" element={<Pointage />} />
        <Route path="/comptes/nouveau" element={<CreationCompte />} />
      </Routes>
    </>
  )
}

export default App