import { useState } from 'react'
import api from '../api/axiosConfig'

function Pointage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleArrivee = async () => {
    setError(''); setMessage('')
    try {
      const res = await api.post('/presences/pointer-arrivee')
      setMessage(`Arrivée enregistrée à ${res.data.heureArrivee}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du pointage')
    }
  }

  const handleDepart = async () => {
    setError(''); setMessage('')
    try {
      const res = await api.post('/presences/pointer-depart')
      setMessage(`Départ enregistré à ${res.data.heureDepart}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du pointage')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-[#1A1A1A]/10 w-96 text-center">
        <h1 className="mb-6">Pointage</h1>

        {message && <p className="text-[#2E7D5B] font-medium mb-4">{message}</p>}
        {error && <p className="text-[#C0392B] font-medium mb-4">{error}</p>}

        <button
          onClick={handleArrivee}
          className="w-full bg-[#2E7D5B] text-white font-semibold p-3 rounded-md mb-3 hover:bg-[#256349]"
        >
          Je suis arrivé(e)
        </button>

        <button
          onClick={handleDepart}
          className="w-full btn-accent p-3 rounded-md"
        >
          Je pars
        </button>
      </div>
    </div>
  )
}

export default Pointage