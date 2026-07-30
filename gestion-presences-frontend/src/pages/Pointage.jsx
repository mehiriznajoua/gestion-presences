import { useState } from 'react'
import api from '../api/axiosConfig'

function Pointage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleArrivee = async () => {
    setError('')
    setMessage('')
    try {
      const res = await api.post('/presences/pointer-arrivee')
      setMessage(`Arrivée enregistrée à ${res.data.heureArrivee}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du pointage')
    }
  }

  const handleDepart = async () => {
    setError('')
    setMessage('')
    try {
      const res = await api.post('/presences/pointer-depart')
      setMessage(`Départ enregistré à ${res.data.heureDepart}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du pointage')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Pointage</h1>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleArrivee}
          className="w-full bg-green-600 text-white p-3 rounded mb-3"
        >
          Je suis arrivé(e)
        </button>

        <button
          onClick={handleDepart}
          className="w-full bg-orange-500 text-white p-3 rounded"
        >
          Je pars
        </button>
      </div>
    </div>
  )
}

export default Pointage