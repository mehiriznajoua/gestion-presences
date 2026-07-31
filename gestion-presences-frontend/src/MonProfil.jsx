import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './api/axiosConfig';

function MonProfil() {
  const navigate = useNavigate()
  const [employe, setEmploye] = useState(null)
  const [presences, setPresences] = useState([])

  const email = localStorage.getItem('email')

  useEffect(() => {
    if (!email) {
      navigate('/login')
      return
    }

    api.get(`/employes/email/${email}`)
      .then((res) => {
        setEmploye(res.data)
        return api.get(`/presences/employe/${res.data.id}`)
      })
      .then((res) => setPresences(res.data))
      .catch(() => navigate('/login'))
  }, [email, navigate])

  if (!employe) return <p className="p-8 text-lg font-bold">Chargement...</p>

  const badgeColor = {
    PRESENT: 'bg-[#2E7D5B]/10 text-[#2E7D5B]',
    ABSENT: 'bg-[#C0392B]/10 text-[#C0392B]',
    RETARD: 'bg-[#C9821A]/10 text-[#C9821A]',
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      <div className="bg-[#252525] px-8 py-4 flex justify-between items-center -m-8 mb-8">
        <h1 className="flex items-center gap-1 leading-[1.1]" style={{ fontFamily: 'Inter, sans-serif', fontStretch: 'expanded' }}>
          <span className="text-[#FF3B30] font-black text-[32px]">DBM</span>
          <span className="text-[#F7F7F7] font-black text-[32px]">Présences</span>
        </h1>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-[#FF3B30] text-white px-4 py-2 rounded-md text-sm font-black">
          Déconnexion
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#252525]/5 mb-6">
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }}>
          Mon Profil
        </h1>
        <div className="mt-4 space-y-2">
          <p className="text-[#252525]/60 text-base font-bold">
            {employe.prenom} {employe.nom} <span className="text-[#252525]/40 font-black mx-1">—</span> {employe.poste}
          </p>
          <p className="text-[#252525]/60 text-base font-bold">{employe.email}</p>
          <p className="text-[#252525]/60 text-base font-bold">{employe.telephone}</p>
        </div>
      </div>

      <h2 className="text-xl font-black mb-4 text-[#252525]">Mon Historique de Présence</h2>
      <div className="w-full bg-white rounded-xl shadow-sm border border-[#252525]/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#252525]/5">
              <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Date</th>
              <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Statut</th>
              <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Arrivée</th>
              <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Départ</th>
            </tr>
          </thead>
          <tbody>
            {presences.map((p) => (
              <tr key={p.id} className="border-t border-[#2525]/5">
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
  )
}

export default MonProfil