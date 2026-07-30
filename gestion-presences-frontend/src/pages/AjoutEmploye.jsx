import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function AjoutEmploye() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    departement: '',
    type: 'EMPLOYE',
    dateEmbauche: '',
    dateFinContrat: '',
    actif: true,
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        dateFinContrat: form.dateFinContrat || null,
      }
      await api.post('/employes', payload)
      navigate('/employes')
    } catch (err) {
      setError('Erreur lors de la création')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Ajouter un employé</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
        <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
        <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
        <input name="poste" placeholder="Poste" value={form.poste} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
        <input name="departement" placeholder="Département" value={form.departement} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

        <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded mb-3">
          <option value="EMPLOYE">Employé</option>
          <option value="STAGIAIRE">Stagiaire</option>
        </select>

        <label className="block text-sm text-gray-600 mb-1">Date d'embauche</label>
        <input name="dateEmbauche" type="date" value={form.dateEmbauche} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />

        <label className="block text-sm text-gray-600 mb-1">Date de fin de contrat (optionnel)</label>
        <input name="dateFinContrat" type="date" value={form.dateFinContrat} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded mt-2">
          Créer
        </button>
      </form>
    </div>
  )
}

export default AjoutEmploye