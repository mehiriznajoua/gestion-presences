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

  const inputClass = "w-full border border-[#1A1A1A]/15 p-3 rounded-md mb-4 focus:outline-none focus:border-[#E2231A]"

  return (
    <div className="h-screen overflow-hidden bg-[#F7F7F7] px-10 pt-6 pb-10 flex justify-center">
      <div className="w-full max-w-xl">

        {/* Decorative header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-full bg-[#E2231A]/10 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#E2231A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 8v4m2-2h-4" />
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-wide text-[#1A1A1A]/40 uppercase">
            Accès employé
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-[#1A1A1A]/10 w-full h-fit">
          <button
            type="button"
            onClick={() => navigate('/employes')}
            aria-label="Retour"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#E2231A]/10 hover:text-[#E2231A] hover:border-[#E2231A]/30 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="mb-2 text-2xl font-bold">Créer un compte employé</h1>

          {message && <p className="text-green-600 font-medium mb-4">{message}</p>}
          {error && <p className="text-[#C0392B] font-medium mb-4">{error}</p>}

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

          <button type="submit" className="btn-accent w-full p-3 rounded-md text-base mt-2">
            Créer le compte
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreationCompte