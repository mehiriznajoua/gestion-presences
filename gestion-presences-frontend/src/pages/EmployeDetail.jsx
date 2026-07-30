import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function EmployeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employe, setEmploye] = useState(null)
  const [presences, setPresences] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)

  useEffect(() => {
    api.get(`/employes/${id}`).then((res) => {
      setEmploye(res.data)
      setForm(res.data)
    })
    api.get(`/presences/employe/${id}`).then((res) => setPresences(res.data))
  }, [id])

  if (!employe) return <p className="p-10 text-lg">Chargement...</p>

  const totalPresent = presences.filter((p) => p.statut === 'PRESENT').length
  const totalAbsent = presences.filter((p) => p.statut === 'ABSENT').length
  const totalRetard = presences.filter((p) => p.statut === 'RETARD').length

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSave = async () => {
    try {
      await api.put(`/employes/${id}`, form)
      setEmploye(form)
      setEditing(false)
    } catch (err) {
      alert('Erreur lors de la modification')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet employé ?')) return
    try {
      await api.delete(`/employes/${id}`)
      navigate('/employes')
    } catch (err) {
      alert('Erreur lors de la suppression')
    }
  }

  const inputClass = "border border-[#1A1A1A]/15 p-2.5 rounded-md mb-3 w-full focus:outline-none focus:border-[#E2231A]"

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-10">
      <button onClick={() => navigate('/employes')} className="mb-4 text-[#E2231A] font-semibold">
        ← Retour
      </button>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#1A1A1A]/10 mb-6">
        {editing ? (
          <div>
            <input name="nom" value={form.nom} onChange={handleChange} className={inputClass} placeholder="Nom" />
            <input name="prenom" value={form.prenom} onChange={handleChange} className={inputClass} placeholder="Prénom" />
            <input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Email" />
            <input name="telephone" value={form.telephone} onChange={handleChange} className={inputClass} placeholder="Téléphone" />
            <input name="poste" value={form.poste} onChange={handleChange} className={inputClass} placeholder="Poste" />
            <input name="departement" value={form.departement} onChange={handleChange} className={inputClass} placeholder="Département" />
            <label className="flex items-center gap-2 mb-4 font-medium">
              <input
                type="checkbox"
                checked={form.actif}
                onChange={(e) => setForm({ ...form, actif: e.target.checked })}
              />
              Actif
            </label>
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-accent px-5 py-2.5 rounded-md text-base">
                Enregistrer
              </button>
              <button onClick={() => setEditing(false)} className="border border-[#1A1A1A]/15 text-[#1A1A1A] font-semibold px-5 py-2.5 rounded-md text-base">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1>{employe.prenom} {employe.nom}</h1>
            <p className="text-[#1A1A1A]/60 text-base mt-1">{employe.poste} — {employe.departement}</p>
            <p className="text-[#1A1A1A]/60 text-base">{employe.email}</p>
            <p className="text-[#1A1A1A]/60 text-base">{employe.telephone}</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(true)} className="btn-accent px-5 py-2.5 rounded-md text-base">
                Modifier
              </button>
              <button onClick={handleDelete} className="border border-[#C0392B]/30 text-[#C0392B] font-semibold px-5 py-2.5 rounded-md text-base hover:bg-[#C0392B]/5">
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-[#1A1A1A]/10 border-t-4" style={{ borderTopColor: '#2E7D5B' }}>
          <p className="text-[#1A1A1A]/60 font-semibold text-base mb-1">Présent</p>
          <p className="text-4xl font-bold text-[#2E7D5B]">{totalPresent}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-[#1A1A1A]/10 border-t-4" style={{ borderTopColor: '#C0392B' }}>
          <p className="text-[#1A1A1A]/60 font-semibold text-base mb-1">Absent</p>
          <p className="text-4xl font-bold text-[#C0392B]">{totalAbsent}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-[#1A1A1A]/10 border-t-4" style={{ borderTopColor: '#C9821A' }}>
          <p className="text-[#1A1A1A]/60 font-semibold text-base mb-1">Retard</p>
          <p className="text-4xl font-bold text-[#C9821A]">{totalRetard}</p>
        </div>
      </div>

      <table className="w-full bg-white rounded-lg shadow-sm border border-[#1A1A1A]/10 overflow-hidden">
        <thead>
          <tr className="bg-[#F7F7F7] text-left">
            <th className="p-4">Date</th>
            <th className="p-4">Statut</th>
            <th className="p-4">Arrivée</th>
            <th className="p-4">Départ</th>
          </tr>
        </thead>
        <tbody>
          {presences.map((p) => (
            <tr key={p.id} className="border-t border-[#1A1A1A]/10">
              <td className="p-4">{p.date}</td>
              <td className="p-4">{p.statut}</td>
              <td className="p-4">{p.heureArrivee ?? '--'}</td>
              <td className="p-4">{p.heureDepart ?? '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeDetail