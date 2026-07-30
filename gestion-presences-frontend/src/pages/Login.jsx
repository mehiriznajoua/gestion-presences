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
    <div className="min-h-screen flex bg-[#1A1A1A]">
      <div className="w-[38%] hidden md:flex flex-col justify-center px-16 relative">
        <div>
          <h1 className="text-white text-6xl font-bold mb-4 leading-tight">
            <span className="text-[#FF3B30]">DBM</span>
            <br />
            Présences
          </h1>
          <p className="text-white/60 text-lg max-w-sm mt-2">
            Gérez les présences, absences et retards de vos équipes en un seul endroit.
          </p>
        </div>
      </div>

      <div className="w-full md:w-[62%] flex items-center justify-center bg-[#F7F7F7]">
        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-lg shadow-sm w-[30rem]">
          <h1 className="mb-2 text-3xl font-bold">Connexion</h1>
          <p className="text-[#1A1A1A]/50 mb-8 text-base">Accédez à votre espace</p>

          {error && <p className="text-[#C0392B] mb-4 font-medium text-sm">{error}</p>}

          <label className="block text-sm font-semibold text-[#1A1A1A]/60 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#1A1A1A]/15 p-3.5 rounded-md mb-5 text-base focus:outline-none focus:border-[#E2231A]"
          />

          <label className="block text-sm font-semibold text-[#1A1A1A]/60 mb-2">Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full border border-[#1A1A1A]/15 p-3.5 rounded-md mb-8 text-base focus:outline-none focus:border-[#E2231A]"
          />

          <button type="submit" className="btn-accent w-full p-4 rounded-md text-base font-semibold">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login