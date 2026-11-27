import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosConfig'

function Employes() {
  const [employes, setEmployes] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  useEffect(() => {
    if (role !== 'ADMIN' && role !== 'RH') {
      navigate('/profil')
      return
    }
    api.get('/employes')
      .then((res) => setEmployes(res.data))
      .catch(() => setError('Impossible de charger la liste des employés'))
      .finally(() => setLoading(false))
  }, [role, navigate])

  const filtered = employes.filter((emp) =>
    `${emp.nom} ${emp.prenom} ${emp.poste}`.toLowerCase().includes(search.toLowerCase())
  )

  const openEmploye = (id) => navigate(`/employes/${id}`)

  return (
    <div className="min-h-screen bg-[#F7F7F7]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="p-4 sm:p-8">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525' }}>
            Employés
          </h1>
          <div className="flex gap-3">
            <Link
              to="/employes/nouveau"
              className="bg-[#FF3B30] hover:bg-[#E2231A] text-white px-5 py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5"
            >
              + Ajouter un employé
            </Link>
            <Link
              to="/comptes/nouveau"
              className="border-2 border-[#252525]/15 text-[#252525] font-black px-5 py-2 rounded-md text-sm hover:bg-[#F7F7F7] hover:border-[#252525]/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              + Créer un compte
            </Link>
          </div>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, prénom ou poste..."
          className="w-full sm:w-80 border border-[#252525]/15 p-2 rounded-md mb-4 text-sm font-bold bg-white focus:outline-none focus:border-[#E2231A]"
        />

        {error && <p className="mb-4 text-sm text-[#C0392B] font-medium">{error}</p>}

        <div className="w-full bg-white rounded-xl shadow-sm border border-[#252525]/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252525]/5">
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Nom</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Prénom</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Poste</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Type</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => openEmploye(emp.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') openEmploye(emp.id) }}
                  tabIndex={0}
                  className="border-t border-[#252525]/5 cursor-pointer hover:bg-[#F7F7F7] focus:outline-none focus:bg-[#F7F7F7] focus:ring-2 focus:ring-inset focus:ring-[#E2231A]/40 transition-colors"
                >
                  <td className="p-3 font-bold text-[#252525]">{emp.nom}</td>
                  <td className="p-3 font-bold text-[#252525]">{emp.prenom}</td>
                  <td className="p-3 font-bold text-[#252525]">{emp.poste}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${emp.type === 'STAGIAIRE' ? 'bg-[#E2231A]/10 text-[#E2231A]' : 'bg-[#252525]/10 text-[#252525]'}`}>
                      {emp.type}
                    </span>
                  </td>
                  <td className="p-3">
                    {emp.actif ? (
                      <span className="text-[#2E7D5B] font-black">Actif</span>
                    ) : (
                      <span className="text-[#C0392B] font-black">Inactif</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-[#252525]/50 font-bold">
                    Aucun employé trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Employes