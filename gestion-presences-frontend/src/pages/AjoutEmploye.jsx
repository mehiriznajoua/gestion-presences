import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Briefcase, Building, Users } from 'lucide-react'
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

  const inputClass = "w-full border border-[#252525]/15 p-2 rounded-md text-sm font-bold focus:outline-none focus:border-[#E2231A] bg-white transition-colors"

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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-[#252525]/5 w-full max-w-4xl mt-2">
          
          <button
            type="button"
            onClick={() => navigate('/employes')}
            className="mb-4 text-[#252525]/60 text-sm font-black hover:text-[#E2231A] transition-colors border-b border-transparent hover:border-[#E2231A] pb-0.5"
          >
            ← Retour
          </button>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }} className="mb-4">
            Ajouter un employé
          </h1>

          {error && <p className="text-[#C0392B] font-black text-sm mb-4">{error}</p>}

          <div className="grid md:grid-cols-2 gap-3">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px]" />
              <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} className={`${inputClass} pl-9`} required />
            </div>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px]" />
              <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} className={`${inputClass} pl-9`} required />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px]" />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={`${inputClass} pl-9`} required />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px]" />
              <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className={`${inputClass} pl-9`} />
            </div>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px]" />
              <input name="poste" placeholder="Poste" value={form.poste} onChange={handleChange} className={`${inputClass} pl-9`} />
            </div>
            <div className="relative">
              <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px]" />
              <input name="departement" placeholder="Département" value={form.departement} onChange={handleChange} className={`${inputClass} pl-9`} />
            </div>

            <div className="relative">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px]" />
              <select name="type" value={form.type} onChange={handleChange} className={`${inputClass} pl-9 appearance-none`}>
                <option value="EMPLOYE">Employé</option>
                <option value="STAGIAIRE">Stagiaire</option>
              </select>
            </div>

            <label className="flex items-center gap-3 border border-[#252525]/15 rounded-md px-3 py-2 cursor-pointer select-none bg-white transition-colors hover:border-[#1A1A1A]/30">
              <input
                type="checkbox"
                checked={form.actif}
                onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                className="w-4 h-4 accent-[#FF3B30]"
              />
              <span className="text-[#252525] text-sm font-black">Compte actif</span>
            </label>

            <div>
              <label className="block text-[#252525]/60 font-black text-xs uppercase tracking-wider mb-1">Date d'embauche</label>
              <input name="dateEmbauche" type="date" value={form.dateEmbauche} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className="block text-[#252525]/60 font-black text-xs uppercase tracking-wider mb-1">Date de fin (optionnel)</label>
              <input name="dateFinContrat" type="date" value={form.dateFinContrat} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <button 
            type="submit" 
            className="bg-[#FF3B30] hover:bg-[#E2231A] text-white w-full py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5 mt-6"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  )
}

export default AjoutEmploye