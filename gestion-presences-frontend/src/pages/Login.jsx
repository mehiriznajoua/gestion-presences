import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
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
      <div className="w-[45%] hidden md:flex flex-col justify-start pt-20 px-20 relative">
        <div className="max-w-2xl">
          <h1 className="font-bold leading-[1.1]" style={{ fontSize: '85px' }}>
            <span className="text-[#FF3B30] block" style={{ fontFamily: 'Milker, sans-serif', fontWeight: '900' }}>
              DBM
            </span>
            <span className="text-[#F7F7F7] block -mt-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '800', fontSize: '85px' }}>
              Présences
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-lg mt-3 leading-relaxed font-semibold">
            Gérez les présences, absences et retards de vos équipes en un seul endroit.
          </p>
        </div>
      </div>

      <div className="w-full md:w-[55%] flex items-center justify-center bg-[#F7F7F7]">
        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-lg shadow-sm w-[30rem]">
          <h1 className="mb-1 text-4xl font-bold">Connexion</h1>
          <p className="text-[#1A1A1A]/60 mb-8 text-lg font-medium">Accédez à votre espace</p>

          {error && <p className="text-[#C0392B] mb-4 font-medium text-sm">{error}</p>}

          <label className="block text-sm font-semibold text-[#1A1A1A]/60 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#1A1A1A]/15 pl-11 pr-4 py-3.5 rounded-md text-base focus:outline-none focus:border-[#E2231A] focus:ring-2 focus:ring-[#FF3B30]/20 bg-[#FAFAFA]"
            />
          </div>

          <label className="block text-sm font-semibold text-[#1A1A1A]/60 mt-5 mb-2">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 w-5 h-5" />
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full border border-[#1A1A1A]/15 pl-11 pr-4 py-3.5 rounded-md text-base focus:outline-none focus:border-[#E2231A] focus:ring-2 focus:ring-[#FF3B30]/20 bg-[#FAFAFA]"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#FF3B30] hover:bg-[#E2231A] text-white p-4 rounded-md text-base font-semibold mt-8 transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login