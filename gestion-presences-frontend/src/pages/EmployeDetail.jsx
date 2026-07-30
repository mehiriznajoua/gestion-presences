import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function EmployeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employe, setEmploye] = useState(null)
  const [presences, setPresences] = useState([])

  useEffect(() => {
    api.get(`/employes/${id}`).then((res) => setEmploye(res.data))
    api.get(`/presences/employe/${id}`).then((res) => setPresences(res.data))
  }, [id])

  if (!employe) return <p className="p-8">Chargement...</p>

  const totalPresent = presences.filter((p) => p.statut === 'PRESENT').length
  const totalAbsent = presences.filter((p) => p.statut === 'ABSENT').length
  const totalRetard = presences.filter((p) => p.statut === 'RETARD').length

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button onClick={() => navigate('/employes')} className="mb-4 text-blue-600">
        ← Retour
      </button>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h1 className="text-2xl font-bold">{employe.prenom} {employe.nom}</h1>
        <p className="text-gray-500">{employe.poste} — {employe.departement}</p>
        <p className="text-gray-500">{employe.email}</p>
        <p className="text-gray-500">{employe.telephone}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Présent</p>
          <p className="text-3xl font-bold text-green-600">{totalPresent}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Absent</p>
          <p className="text-3xl font-bold text-red-600">{totalAbsent}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Retard</p>
          <p className="text-3xl font-bold text-orange-500">{totalRetard}</p>
        </div>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Date</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Arrivée</th>
            <th className="p-3">Départ</th>
          </tr>
        </thead>
        <tbody>
          {presences.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.date}</td>
              <td className="p-3">{p.statut}</td>
              <td className="p-3">{p.heureArrivee ?? '--'}</td>
              <td className="p-3">{p.heureDepart ?? '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeDetail