import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Briefcase, Building, Users, ChevronDown } from 'lucide-react'
import api from '../api/axiosConfig'

const FIELDS = [
  { name: 'nom', label: 'Nom', icon: User, required: true },
  { name: 'prenom', label: 'Prénom', icon: User, required: true },
  { name: 'email', label: 'Email', icon: Mail, type: 'email', required: true },
  { name: 'telephone', label: 'Téléphone', icon: Phone, type: 'tel', pattern: '[0-9+ ]{8,15}', title: '8 à 15 chiffres' },
  { name: 'poste', label: 'Poste', icon: Briefcase },
  { name: 'departement', label: 'Département', icon: Building },
]

function AjoutEmploye() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', poste: '',
    departement: '', type: 'EMPLOYE', dateEmbauche: '', dateFinContrat: '', actif: true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role !== 'ADMIN' && role !== 'RH') navigate('/profil')
  }, [role, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.dateFinContrat && form.dateFinContrat < form.dateEmbauche) {
      setError("La date de fin doit être postérieure à la date d'embauche")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        dateFinContrat: form.dateFinContrat || null,
      }
      await api.post('/employes', payload)
      navigate('/employes')
    } catch (err) {
      setError(
        err.response?.status === 403
          ? "Vous n'avez pas le droit de créer un employé"
          : err.response?.data?.message || 'Erreur lors de la création (email déjà utilisé ?)'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-[#252525]/15 p-2 rounded-md text-sm font-bold focus:outline-none focus:border-[#E2231A] bg-white transition-colors"
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-[#252525]/40 stroke-[2.5px] pointer-events-none"
  const labelClass = "block text-[#252525]/60 font-black text-xs uppercase tracking-wider mb-1"

  return (
    <div className="min-h-screen bg-[#F7F7F7]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="p-4 sm:p-8 flex justify-center items-start">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-[#252525]/5 w-full max-w-4xl">

          <button
            type="button"
            onClick={() => navigate('/employes')}
            className="mb-4 text-[#252525]/60 text-sm font-black hover:text-[#E2231A] transition-colors border-b border-transparent hover:border-[#E2231A] pb-0.5"
          >
            ← Retour
          </button>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525' }} className="mb-4">
            Ajouter un employé
          </h1>

          {error && <p className="text-[#C0392B] font-black text-sm mb-4">{error}</p>}

          <div className="grid md:grid-cols-2 gap-4">
            {FIELDS.map(({ name, label, icon: Icon, ...rest }) => (
              <div key={name}>
                <label htmlFor={name} className={labelClass}>
                  {label}{rest.required && ' *'}
                </label>
                <div className="relative">
                  <Icon size={16} className={iconClass} />
                  <input
                    id={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    {...rest}
                  />
                </div>
              </div>
            ))}

            <div>
              <label htmlFor="type" className={labelClass}>Type</label>
              <div className="relative">
                <Users size={16} className={iconClass} />
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={`${inputClass} pl-9 pr-9 appearance-none`}
                >
                  <option value="EMPLOYE">Employé</option>
                  <option value="STAGIAIRE">Stagiaire</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#252525]/40 pointer-events-none" />
              </div>
            </div>

            <div>
              <span className={labelClass}>Statut</span>
              <label className="flex items-center gap-3 border border-[#252525]/15 rounded-md px-3 py-2 cursor-pointer select-none bg-white transition-colors hover:border-[#252525]/30">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                  className="w-4 h-4 accent-[#FF3B30]"
                />
                <span className="text-[#252525] text-sm font-black">Employé actif</span>
              </label>
            </div>

            <div>
              <label htmlFor="dateEmbauche" className={labelClass}>Date d'embauche *</label>
              <input
                id="dateEmbauche"
                name="dateEmbauche"
                type="date"
                value={form.dateEmbauche}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="dateFinContrat" className={labelClass}>Date de fin (optionnel)</label>
              <input
                id="dateFinContrat"
                name="dateFinContrat"
                type="date"
                min={form.dateEmbauche || undefined}
                value={form.dateFinContrat}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF3B30] hover:bg-[#E2231A] text-white w-full py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5 mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AjoutEmploye