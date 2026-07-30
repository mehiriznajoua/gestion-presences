import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/dashboard" className="font-medium hover:text-blue-600">Dashboard</Link>
        {(role === 'ADMIN' || role === 'RH') && (
          <Link to="/employes" className="font-medium hover:text-blue-600">Employés</Link>
        )}
        <Link to="/pointage" className="font-medium hover:text-blue-600">Pointage</Link>
      </div>
      <button onClick={handleLogout} className="text-red-600 font-medium">
        Déconnexion
      </button>
    </nav>
  )
}

export default Navbar