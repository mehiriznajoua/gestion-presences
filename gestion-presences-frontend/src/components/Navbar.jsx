import { Link, useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  const linkClass = (path) =>
    `text-base font-semibold transition-colors pb-1 border-b-2 ${
      location.pathname === path
        ? 'text-[#1A1A1A] border-[#E2231A]'
        : 'text-[#1A1A1A]/60 border-transparent hover:text-[#1A1A1A]'
    }`

  return (
    <nav className="bg-white border-b border-[#1A1A1A]/10 px-6 py-2.5 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <span className="font-bold text-lg tracking-tight">
        <span className="text-[#E2231A]">DB</span><span className="text-[#1A1A1A]">M</span> <span className="text-[#1A1A1A]">Présences</span>
        </span>
        <div className="flex gap-6">
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          {(role === 'ADMIN' || role === 'RH') && (
            <Link to="/employes" className={linkClass('/employes')}>Employés</Link>
          )}
          {(role === 'ADMIN' || role === 'RH') && (
            <Link to="/presences" className={linkClass('/presences')}>Présences</Link>
          )}
          <Link to="/pointage" className={linkClass('/pointage')}>Pointage</Link>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="btn-accent text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        Déconnexion
      </button>
    </nav>
  )
}

export default Navbar