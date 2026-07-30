import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function AjoutEmploye() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', poste: '',
    departement: '', type: 'EMPLOYE', dateEmbauche: '', dateFinContrat: '', actif: true,
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
      const payload = { ...form, dateFinContrat: form.dateFinContrat || null }
      await api.post('/employes', payload)
      navigate('/employes')
    } catch (err) {
      setError('Erreur lors de la création')
    }
  }

  const inputClass = "w-full border border-[#1A1A1A]/15 p-2.5 rounded-md mb-3 focus:outline-none focus:border-[#E2231A]"

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-10 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-[#1A1A1A]/10 w-full max-w-lg h-fit">
        <h1 className="mb-6">Ajouter un employé</h1>
        {error && <p className="text-[#C0392B] font-medium mb-4">{error}</p>}

        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} className={inputClass} required />
        <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} className={inputClass} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} required />
        <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className={inputClass} />
        <input name="poste" placeholder="Poste" value={form.poste} onChange={handleChange} className={inputClass} />
        <input name="departement" placeholder="Département" value={form.departement} onChange={handleChange} className={inputClass} />

        <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
          <option value="EMPLOYE">Employé</option>
          <option value="STAGIAIRE">Stagiaire</option>
        </select>

        <label className="block text-sm font-semibold text-[#1A1A1A]/60 mb-1">Date d'embauche</label>
        <input name="dateEmbauche" type="date" value={form.dateEmbauche} onChange={handleChange} className={inputClass} required />

        <label className="block text-sm font-semibold text-[#1A1A1A]/60 mb-1">Date de fin de contrat (optionnel)</label>
        <input name="dateFinContrat" type="date" value={form.dateFinContrat} onChange={handleChange} className={inputClass} />

        <button type="submit" className="btn-accent w-full p-3 rounded-md text-base mt-2">
          Créer
        </button>
      </form>
    </div>
  )
}

export default AjoutEmploye