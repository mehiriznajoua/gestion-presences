import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Employés</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Nom</th>
            <th className="p-3">Prénom</th>
            <th className="p-3">Poste</th>
            <th className="p-3">Type</th>
            <th className="p-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {employes.map((emp) => (
            <tr
              key={emp.id}
              onClick={() => navigate(`/employes/${emp.id}`)}
              className="border-t cursor-pointer hover:bg-gray-50"
            >
              <td className="p-3">{emp.nom}</td>
              <td className="p-3">{emp.prenom}</td>
              <td className="p-3">{emp.poste}</td>
              <td className="p-3">{emp.type}</td>
              <td className="p-3">
                {emp.actif ? (
                  <span className="text-green-600">Actif</span>
                ) : (
                  <span className="text-red-600">Inactif</span>
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