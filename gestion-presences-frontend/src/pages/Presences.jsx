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
        {/* Title */}
        <div className="mb-4">
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }}>
            Présences
          </h1>
        </div>

        <div className="flex gap-2 mb-5 items-center flex-wrap">
          {['TOUS', 'PRESENT', 'ABSENT', 'RETARD'].map((statut) => (
            <button
              key={statut}
              onClick={() => setFiltreStatut(statut)}
              className={`px-4 py-1.5 rounded-md text-sm font-black transition-all duration-200 ${
                filtreStatut === statut 
                  ? 'bg-[#FF3B30] text-white shadow-md hover:bg-[#E2231A]' 
                  : 'bg-white border border-[#252525]/15 text-[#252525] hover:bg-[#F7F7F7] hover:border-[#1A1A1A]/30'
              }`}
            >
              {statut}
            </button>
          ))}

          <input
            type="date"
            value={filtreDate}
            onChange={(e) => setFiltreDate(e.target.value)}
            className="border border-[#252525]/15 rounded-md px-2 py-1.5 text-sm font-semibold ml-2 bg-white"
          />
          {filtreDate && (
            <button 
              onClick={() => setFiltreDate('')} 
              className="text-[#C0392B] text-xs font-bold underline ml-1 hover:text-[#A3271B]"
            >
              Effacer
            </button>
          )}
        </div>

        <div className="w-full bg-white rounded-xl shadow-sm border border-[#252525]/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252525]/5">
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Employé</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Date</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Statut</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Arrivée</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Départ</th>
              </tr>
            </thead>
            <tbody>
              {presencesFiltrees.map((p) => (
                <tr key={p.id} className="border-t border-[#252525]/5">
                  <td className="p-3 font-bold text-[#252525]">{p.employe?.prenom} {p.employe?.nom}</td>
                  <td className="p-3 font-bold text-[#252525]">{p.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${badgeColor[p.statut]}`}>
                      {p.statut}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#252525]">{p.heureArrivee ?? '--'}</td>
                  <td className="p-3 font-bold text-[#252525]">{p.heureDepart ?? '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Presences