import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data))
  }, [])

  if (!stats) return <p className="p-8 text-lg">Chargement...</p>

  const cards = [
    { label: 'Présents aujourd\'hui', value: stats.presents, color: '#2E7D5B' },
    { label: 'Absents aujourd\'hui', value: stats.absents, color: '#C0392B' },
    { label: 'Retards aujourd\'hui', value: stats.retards, color: '#C9821A' },
    { label: 'Employés actifs', value: stats.totalEmployesActifs, color: '#1A1A1A' },
  ]

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-10">
      <div className="relative overflow-hidden rounded-lg mb-8 h-28 bg-[#1A1A1A]">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
          <line x1="0" y1="100" x2="120" y2="0" stroke="#E2231A" strokeWidth="14" />
          <line x1="40" y1="100" x2="160" y2="0" stroke="#FFFFFF" strokeWidth="4" opacity="0.15" />
          <line x1="90" y1="100" x2="210" y2="0" stroke="#E2231A" strokeWidth="6" opacity="0.5" />
          <line x1="260" y1="100" x2="400" y2="0" stroke="#FFFFFF" strokeWidth="3" opacity="0.1" />
          <line x1="320" y1="100" x2="440" y2="0" stroke="#E2231A" strokeWidth="10" opacity="0.3" />
        </svg>
        <div className="relative h-full flex items-center px-8">
          <span className="text-white font-bold text-2xl tracking-tight">
            <span className="text-[#E2231A]">DB</span>M <span className="font-medium text-white/70">Présences</span>
          </span>
        </div>
      </div>
      <div className="mb-8">
        <p className="text-[#1A1A1A]/50 text-lg font-medium capitalize">{today}</p>
        <h1 className="mt-1">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-6 rounded-lg shadow-sm border border-[#1A1A1A]/10 border-t-4" style={{ borderTopColor: c.color }}>
            <p className="text-[#1A1A1A]/60 font-semibold text-base mb-2">{c.label}</p>
            <p className="text-5xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#1A1A1A]/10">
          <p className="text-[#1A1A1A]/60 font-semibold text-base mb-2">Stagiaires</p>
          <p className="text-5xl font-bold text-[#E2231A]">{stats.totalStagiaires}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#1A1A1A]/10">
          <p className="text-[#1A1A1A]/60 font-semibold text-base mb-2">Employés permanents</p>
          <p className="text-5xl font-bold text-[#1A1A1A]">{stats.totalEmployesPermanents}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#1A1A1A]/10">
        <p className="text-[#1A1A1A]/60 font-semibold text-base mb-3">Accès rapide</p>
        <div className="flex gap-3">
          <a href="/employes" className="btn-accent px-5 py-2.5 rounded-md text-base">Voir les employés</a>
          <a href="/pointage" className="border border-[#1A1A1A]/15 text-[#1A1A1A] font-semibold px-5 py-2.5 rounded-md text-base hover:bg-[#F7F7F7]">Pointer ma présence</a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard