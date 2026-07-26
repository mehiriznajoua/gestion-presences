import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'

function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data))
  }, [])

  if (!stats) return <p className="p-8">Chargement...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Présents</p>
          <p className="text-3xl font-bold">{stats.presents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Absents</p>
          <p className="text-3xl font-bold">{stats.absents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Retards</p>
          <p className="text-3xl font-bold">{stats.retards}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Employés actifs</p>
          <p className="text-3xl font-bold">{stats.totalEmployesActifs}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard