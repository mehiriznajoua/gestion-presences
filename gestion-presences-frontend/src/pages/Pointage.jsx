import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, LogIn, LogOut, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../api/axiosConfig'

function Pointage() {
  const navigate = useNavigate()
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

      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-88px)]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#252525]/5 w-full max-w-md text-center">
          
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-[#252525]/60 text-sm font-black hover:text-[#E2231A] transition-colors border-b border-transparent hover:border-[#E2231A] pb-0.5 block w-fit mx-auto"
          >
            ← Retour au tableau de bord
          </button>

          <div className="flex items-center justify-center gap-3 mb-6">
            <Clock size={32} className="text-[#252525] stroke-[2.5px]" />
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }}>
              Pointage
            </h1>
          </div>

          {message && (
            <div className="flex items-center justify-center gap-2 text-[#2E7D5B] font-black text-sm bg-[#2E7D5B]/10 p-3 rounded border border-[#2E7D5B]/10 mb-5">
              <CheckCircle size={16} className="stroke-[3px]" />
              {message}
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center gap-2 text-[#C0392B] font-black text-sm bg-[#C0392B]/10 p-3 rounded border border-[#C0392B]/10 mb-5">
              <AlertCircle size={16} className="stroke-[3px]" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleArrivee}
              className="w-full flex items-center justify-center gap-3 bg-[#FF3B30] hover:bg-[#E2231A] text-white py-3 rounded-md text-base font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5"
            >
              <LogIn size={20} className="stroke-[3px]" />
              Je suis arrivé(e)
            </button>

            <button
              onClick={handleDepart}
              className="w-full flex items-center justify-center gap-3 border-2 border-[#252525] text-[#252525] font-black py-3 rounded-md text-base hover:bg-[#F7F7F7] hover:border-[#333333] transition-all duration-200 hover:-translate-y-0.5"
            >
              <LogOut size={20} className="stroke-[3px]" />
              Je pars
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pointage