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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <button type="button" onClick={() => navigate('/employes')} className="text-blue-600 mb-4">
          ← Retour
        </button>
        <h1 className="text-2xl font-bold mb-6">Créer un compte employé</h1>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <p className="text-sm text-gray-500 mb-3">
          Utilise le même email que celui de la fiche employé, pour que le pointage fonctionne.
        </p>

        <input
          type="email"
          placeholder="Email (identique à la fiche employé)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe temporaire"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Créer le compte
        </button>
      </form>
    </div>
  )
}

export default CreationCompte