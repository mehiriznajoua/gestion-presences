import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function Login() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/auth/login', { email, motDePasse })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', response.data.role)
      navigate('/dashboard')
    } catch (err) {
      setError('Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-[#1A1A1A]/10 w-96">
        <h1 className="mb-1">
          <span className="text-[#E2231A]">DB</span><span className="text-[#1A1A1A]">M</span>
        </h1>
        <p className="text-[#1A1A1A]/60 mb-6 font-medium">Connexion</p>

        {error && <p className="text-[#C0392B] mb-4 font-medium">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#1A1A1A]/15 p-2.5 rounded-md mb-4 focus:outline-none focus:border-[#E2231A]"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full border border-[#1A1A1A]/15 p-2.5 rounded-md mb-4 focus:outline-none focus:border-[#E2231A]"
        />
        <button type="submit" className="btn-accent w-full p-2.5 rounded-md">
          Se connecter
        </button>
      </form>
    </div>
  )
}

export default Login