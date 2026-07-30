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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Se connecter
        </button>
      </form>
    </div>
  )
}

export default Login