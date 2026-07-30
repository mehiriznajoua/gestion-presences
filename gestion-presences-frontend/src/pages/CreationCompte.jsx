import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function CreationCompte() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/auth/register', { email, motDePasse })
      setMessage('Compte créé avec succès')
      setEmail('')
      setMotDePasse('')
    } catch (err) {
      setError('Erreur lors de la création (email déjà utilisé ?)')
    }
  }

  const inputClass = "w-full border border-[#252525]/15 p-2 rounded-md text-sm font-bold focus:outline-none focus:border-[#E2231A] bg-white transition-colors mb-3"

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

      <div className="p-8 flex justify-center items-start min-h-[calc(100vh-88px)]">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-[#252525]/5 w-full h-fit">
            
            <button
              type="button"
              onClick={() => navigate('/employes')}
              className="mb-4 text-[#1A1A1A]/60 text-sm font-black hover:text-[#E2231A] transition-colors border-b border-transparent hover:border-[#E2231A] pb-0.5"
            >
              ← Retour
            </button>

            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }} className="mb-4">
              Créer un compte
            </h1>

            {message && <p className="text-[#2E7D5B] font-black text-sm mb-3 bg-[#2E7D5B]/5 p-2 rounded border border-[#2E7D5B]/10">{message}</p>}
            {error && <p className="text-[#C0392B] font-black text-sm mb-3 bg-[#C0392B]/5 p-2 rounded border border-[#C0392B]/10">{error}</p>}

            <input
              type="email"
              placeholder="Email (identique à la fiche employé)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe temporaire"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className={inputClass}
              required
            />

            <button 
              type="submit" 
              className="bg-[#FF3B30] hover:bg-[#E2231A] text-white w-full py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5 mt-1"
            >
              Créer le compte
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreationCompte