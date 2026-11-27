import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserCheck, Clock, User, Briefcase, GraduationCap, Users } from 'lucide-react'
import api from '../api/axiosConfig'

const REFRESH_MS = 30000 // rafraîchissement automatique : 30 secondes

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const userRole = localStorage.getItem('role')
  const canSeeStats = userRole === 'ADMIN' || userRole === 'RH'

  useEffect(() => {
    if (!canSeeStats) return // un employé n'appelle pas l'API des statistiques

    const loadStats = () =>
      api.get('/dashboard/stats')
        .then((res) => { setStats(res.data); setError('') })
        .catch(() => setError('Impossible de charger les statistiques'))

    loadStats()
    const id = setInterval(loadStats, REFRESH_MS)
    return () => clearInterval(id) // nettoyage quand on quitte la page
  }, [canSeeStats])

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const cards = stats ? [
    { label: "Présents aujourd'hui", value: stats.presents, color: '#2E7D5B', icon: UserCheck },
    { label: "Absents aujourd'hui", value: stats.absents, color: '#C0392B', icon: User },
    { label: "Retards aujourd'hui", value: stats.retards, color: '#C9821A', icon: Clock },
    { label: 'Employés actifs', value: stats.totalEmployesActifs, color: '#252525', icon: Users },
  ] : []

  const quickAccess = (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-[#252525]/5">
      <p className="text-[#252525]/60 font-bold text-sm mb-3">Accès rapide</p>
      <div className="flex flex-wrap gap-3">
        {canSeeStats && (
          <Link
            to="/employes"
            className="bg-[#FF3B30] hover:bg-[#E2231A] text-white px-5 py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5"
          >
            Voir les employés
          </Link>
        )}
        <Link
          to="/pointage"
          className="border-2 border-[#252525]/15 text-[#252525] font-black px-5 py-2 rounded-md text-sm hover:bg-[#F7F7F7] hover:border-[#252525]/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          Pointer ma présence
        </Link>
      </div>
    </div>
  )

  let content
  if (!canSeeStats) {
    content = quickAccess
  } else if (!stats) {
    content = error
      ? <p className="text-[#C0392B] font-medium">{error}</p>
      : <p className="text-lg">Chargement...</p>
  } else {
    content = (
      <>
        {error && (
          <p className="mb-4 text-sm text-[#C0392B] font-medium">
            {error} : les chiffres affichés peuvent ne pas être à jour.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {cards.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.label}
                className="bg-white p-5 rounded-xl shadow-sm border border-[#252525]/5 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#252525]/60 font-bold text-sm">{c.label}</p>
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: c.color + '15' }}>
                    <Icon size={16} style={{ color: c.color }} />
                  </div>
                </div>
                <p className="font-black" style={{ color: c.color, fontSize: '40px' }}>{c.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div className="bg-gradient-to-br from-[#FFF5F5] to-white p-5 rounded-xl shadow-sm border border-[#FF3B30]/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-lg bg-[#FF3B30]/10">
                <GraduationCap size={16} className="text-[#FF3B30]" />
              </div>
              <p className="text-[#252525]/60 font-bold text-sm">Stagiaires</p>
            </div>
            <p className="font-black" style={{ color: '#FF3B30', fontSize: '40px' }}>{stats.totalStagiaires}</p>
          </div>
          <div className="bg-gradient-to-br from-[#F5F5F7] to-white p-5 rounded-xl shadow-sm border border-[#252525]/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-lg bg-[#252525]/5">
                <Briefcase size={16} className="text-[#252525]" />
              </div>
              <p className="text-[#252525]/60 font-bold text-sm">Employés permanents</p>
            </div>
            <p className="font-black" style={{ color: '#252525', fontSize: '40px' }}>{stats.totalEmployesPermanents}</p>
          </div>
        </div>

        {quickAccess}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="p-4 sm:p-8">
        <div className="mb-4">
          <p className="text-[#252525]/50 text-sm font-bold capitalize">{today}</p>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525' }}>
            Tableau de bord
          </h1>
        </div>
        {content}
      </div>
    </div>
  )
}

export default Dashboard