import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'

function Presences() {
  const [presences, setPresences] = useState([])
  const [filtreStatut, setFiltreStatut] = useState('TOUS')
  const [filtreDate, setFiltreDate] = useState('')

  useEffect(() => {
    api.get('/presences').then((res) => setPresences(res.data))
  }, [])

  const presencesFiltrees = presences
    .filter((p) => filtreStatut === 'TOUS' || p.statut === filtreStatut)
    .filter((p) => !filtreDate || p.date === filtreDate)

  const badgeColor = {
    PRESENT: 'bg-[#2E7D5B]/10 text-[#2E7D5B]',
    ABSENT: 'bg-[#C0392B]/10 text-[#C0392B]',
    RETARD: 'bg-[#C9821A]/10 text-[#C9821A]',
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-10">
      <h1 className="mb-6">Présences</h1>

      <div className="flex gap-2 mb-5 items-center flex-wrap">
        {['TOUS', 'PRESENT', 'ABSENT', 'RETARD'].map((statut) => (
          <button
            key={statut}
            onClick={() => setFiltreStatut(statut)}
            className={`px-4 py-2 rounded-md text-base font-semibold transition-colors ${
              filtreStatut === statut ? 'btn-accent' : 'bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]'
            }`}
          >
            {statut}
          </button>
        ))}

        <input
          type="date"
          value={filtreDate}
          onChange={(e) => setFiltreDate(e.target.value)}
          className="border border-[#1A1A1A]/15 rounded-md px-3 py-2 text-base ml-2"
        />
        {filtreDate && (
          <button onClick={() => setFiltreDate('')} className="text-[#1A1A1A]/50 text-sm underline">
            Effacer la date
          </button>
        )}
      </div>

      <table className="w-full bg-white rounded-lg shadow-sm border border-[#1A1A1A]/10 overflow-hidden">
        <thead>
          <tr className="bg-[#F7F7F7] text-left">
            <th className="p-4">Employé</th>
            <th className="p-4">Date</th>
            <th className="p-4">Statut</th>
            <th className="p-4">Arrivée</th>
            <th className="p-4">Départ</th>
          </tr>
        </thead>
        <tbody>
          {presencesFiltrees.map((p) => (
            <tr key={p.id} className="border-t border-[#1A1A1A]/10">
              <td className="p-4">{p.employe?.prenom} {p.employe?.nom}</td>
              <td className="p-4">{p.date}</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-full text-sm font-semibold ${badgeColor[p.statut]}`}>
                  {p.statut}
                </span>
              </td>
              <td className="p-4">{p.heureArrivee ?? '--'}</td>
              <td className="p-4">{p.heureDepart ?? '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Presences