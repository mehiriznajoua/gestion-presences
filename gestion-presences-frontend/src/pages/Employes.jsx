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
    <div className="min-h-screen bg-[#F7F7F7] p-10">
      <div className="flex justify-between items-center mb-6">
        <h1>Employés</h1>
        <div className="flex gap-3">
          <Link to="/employes/nouveau" className="btn-accent px-5 py-2.5 rounded-md text-base">
            + Ajouter un employé
          </Link>
          <Link to="/comptes/nouveau" className="border border-[#1A1A1A]/15 text-[#1A1A1A] font-semibold px-5 py-2.5 rounded-md text-base hover:bg-white">
            + Créer un compte
          </Link>
        </div>
      </div>

      <table className="w-full bg-white rounded-lg shadow-sm border border-[#1A1A1A]/10 overflow-hidden">
        <thead>
          <tr className="bg-[#F7F7F7] text-left">
            <th className="p-4">Nom</th>
            <th className="p-4">Prénom</th>
            <th className="p-4">Poste</th>
            <th className="p-4">Type</th>
            <th className="p-4">Statut</th>
          </tr>
        </thead>
        <tbody>
          {employes.map((emp) => (
            <tr
              key={emp.id}
              onClick={() => navigate(`/employes/${emp.id}`)}
              className="border-t border-[#1A1A1A]/10 cursor-pointer hover:bg-[#F7F7F7] transition-colors"
            >
              <td className="p-4">{emp.nom}</td>
              <td className="p-4">{emp.prenom}</td>
              <td className="p-4">{emp.poste}</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-full text-sm font-semibold ${emp.type === 'STAGIAIRE' ? 'bg-[#E2231A]/10 text-[#E2231A]' : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'}`}>
                  {emp.type}
                </span>
              </td>
              <td className="p-4">
                {emp.actif ? (
                  <span className="text-[#2E7D5B] font-semibold">Actif</span>
                ) : (
                  <span className="text-[#C0392B] font-semibold">Inactif</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Employes