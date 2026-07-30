import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosConfig'

function Employes() {
  const [employes, setEmployes] = useState([])
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  useEffect(() => {
    if (role !== 'ADMIN' && role !== 'RH') {
      navigate('/dashboard')
      return
    }
    api.get('/employes').then((res) => setEmployes(res.data))
  }, [role, navigate])

  return (
    <div className="min-h-screen bg-[#F7F7F7]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-[#252525] px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="flex items-center gap-1 leading-[1.1]" style={{ fontFamily: 'Inter, sans-serif', fontStretch: 'expanded' }}>
            <span className="text-[#FF3B30] font-black text-[32px]">
              DBM
            </span>
            <span className="text-[#F7F7F7] font-black text-[32px]">
              Présences
            </span>
          </h1>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }}>
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
              className="border-2 border-[#252525]/15 text-[#252525] font-black px-5 py-2 rounded-md text-sm hover:bg-[#F7F7F7] hover:border-[#1A1A1A]/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              + Créer un compte
            </Link>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl shadow-sm border border-[#252525]/5 overflow-hidden">
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
              {employes.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employes/${emp.id}`)}
                  className="border-t border-[#252525]/5 cursor-pointer hover:bg-[#F7F7F7] transition-colors"
                >
                  <td className="p-3 font-bold text-[#252525]">{emp.nom}</td>
                  <td className="p-3 font-bold text-[#252525]">{emp.prenom}</td>
                  <td className="p-3 font-bold text-[#252525]">{emp.poste}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${emp.type === 'STAGIAIRE' ? 'bg-[#E2231A]/10 text-[#E2231A]' : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'}`}>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Employes