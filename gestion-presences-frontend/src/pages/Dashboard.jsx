import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  UserCheck, 
  Clock, 
  User,
  Briefcase,
  GraduationCap,
  Users,
  LogOut
} from 'lucide-react'
import api from '../api/axiosConfig'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data))
  }, [])

  if (!stats) return <p className="p-8 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>Chargement...</p>

  const cards = [
    { label: 'Présents aujourd\'hui', value: stats.presents, color: '#2E7D5B', icon: UserCheck },
    { label: 'Absents aujourd\'hui', value: stats.absents, color: '#C0392B', icon: User },
    { label: 'Retards aujourd\'hui', value: stats.retards, color: '#C9821A', icon: Clock },
    { label: 'Employés actifs', value: stats.totalEmployesActifs, color: '#252525', icon: Users },
  ]

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

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
        <div className="mb-4">
          <p className="text-[#252525]/50 text-sm font-bold capitalize">{today}</p>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }}>
            Tableau de bord
          </h1>
        </div>

        <div className="grid grid-cols-4 gap-5 mb-6">
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
                <p className="font-black" style={{ color: c.color, fontSize: '40px', fontStretch: 'expanded' }}>{c.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-5 mb-6">
          <div className="bg-gradient-to-br from-[#FFF5F5] to-white p-5 rounded-xl shadow-sm border border-[#FF3B30]/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-lg bg-[#FF3B30]/10">
                <GraduationCap size={16} className="text-[#FF3B30]" />
              </div>
              <p className="text-[#252525]/60 font-bold text-sm">Stagiaires</p>
            </div>
            <p className="font-black" style={{ color: '#FF3B30', fontSize: '40px', fontStretch: 'expanded' }}>{stats.totalStagiaires}</p>
          </div>
          <div className="bg-gradient-to-br from-[#F5F5F7] to-white p-5 rounded-xl shadow-sm border border-[#252525]/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-lg bg-[#252525]/5">
                <Briefcase size={16} className="text-[#252525]" />
              </div>
              <p className="text-[#252525]/60 font-bold text-sm">Employés permanents</p>
            </div>
            <p className="font-black" style={{ color: '#252525', fontSize: '40px', fontStretch: 'expanded' }}>{stats.totalEmployesPermanents}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#252525]/5">
          <p className="text-[#252525]/60 font-bold text-sm mb-3">Accès rapide</p>
          <div className="flex gap-3">
            {userRole !== 'EMPLOYE' && (
              <a 
                href="/employes" 
                className="bg-[#FF3B30] hover:bg-[#E2231A] text-white px-5 py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5"
              >
                Voir les employés
              </a>
            )}
            <a 
              href="/pointage" 
              className="border-2 border-[#252525]/15 text-[#252525] font-black px-5 py-2 rounded-md text-sm hover:bg-[#F7F7F7] hover:border-[#252525]/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              Pointer ma présence
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard