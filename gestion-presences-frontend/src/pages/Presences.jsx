import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'

function Presences() {
  const [presences, setPresences] = useState([])
  const [filtreStatut, setFiltreStatut] = useState('TOUS')

  useEffect(() => {
    api.get('/presences').then((res) => setPresences(res.data))
  }, [])

  const presencesFiltrees =
    filtreStatut === 'TOUS'
      ? presences
      : presences.filter((p) => p.statut === filtreStatut)

  const badgeColor = {
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    RETARD: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Présences</h1>

      <div className="flex gap-2 mb-4">
        {['TOUS', 'PRESENT', 'ABSENT', 'RETARD'].map((statut) => (
          <button
            key={statut}
            onClick={() => setFiltreStatut(statut)}
            className={`px-4 py-2 rounded ${
              filtreStatut === statut ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            {statut}
          </button>
        ))}
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Employé</th>
            <th className="p-3">Date</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Arrivée</th>
            <th className="p-3">Départ</th>
          </tr>
        </thead>
        <tbody>
          {presencesFiltrees.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.employe?.prenom} {p.employe?.nom}</td>
              <td className="p-3">{p.date}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${badgeColor[p.statut]}`}>
                  {p.statut}
                </span>
              </td>
              <td className="p-3">{p.heureArrivee ?? '--'}</td>
              <td className="p-3">{p.heureDepart ?? '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Presences