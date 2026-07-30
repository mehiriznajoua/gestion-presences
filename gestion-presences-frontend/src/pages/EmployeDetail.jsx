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

  if (!employe) return <p className="p-8 text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Chargement...</p>

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

  const inputClass = "border border-[#252525]/15 p-2 rounded-md mb-3 w-full focus:outline-none focus:border-[#E2231A] text-sm font-bold bg-white"

  const badgeColor = {
    PRESENT: 'bg-[#2E7D5B]/10 text-[#2E7D5B]',
    ABSENT: 'bg-[#C0392B]/10 text-[#C0392B]',
    RETARD: 'bg-[#C9821A]/10 text-[#C9821A]',
  }

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

      <div className="p-8">
        <button 
          onClick={() => navigate('/employes')} 
          className="mb-4 text-[#252525]/60 text-sm font-black hover:text-[#E2231A] transition-colors border-b border-transparent hover:border-[#E2231A] pb-0.5"
        >
          ← Retour
        </button>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#252525]/5 mb-6">
          {editing ? (
            <div>
              <input name="nom" value={form.nom} onChange={handleChange} className={inputClass} placeholder="Nom" />
              <input name="prenom" value={form.prenom} onChange={handleChange} className={inputClass} placeholder="Prénom" />
              <input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Email" />
              <input name="telephone" value={form.telephone} onChange={handleChange} className={inputClass} placeholder="Téléphone" />
              <input name="poste" value={form.poste} onChange={handleChange} className={inputClass} placeholder="Poste" />
              <input name="departement" value={form.departement} onChange={handleChange} className={inputClass} placeholder="Département" />
              
              <label className="flex items-center gap-2 mb-4 text-sm font-black text-[#252525]">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                  className="accent-[#FF3B30] w-4 h-4"
                />
                Actif
              </label>

              <div className="flex gap-3">
                <button onClick={handleSave} className="bg-[#FF3B30] hover:bg-[#E2231A] text-white px-5 py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5">
                  Enregistrer
                </button>
                <button onClick={() => setEditing(false)} className="border-2 border-[#252525]/15 text-[#252525] font-black px-5 py-2 rounded-md text-sm hover:bg-[#F7F7F7] hover:border-[#1A1A1A]/30 transition-all duration-200">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525', fontStretch: 'expanded' }}>
                {employe.prenom} {employe.nom}
              </h1>
              <div className="mt-2 space-y-1">
                <p className="text-[#252525]/60 text-base font-bold">{employe.poste} <span className="text-[#252525]/40 font-black mx-1">—</span> {employe.departement}</p>
                <p className="text-[#252525]/60 text-base font-bold">{employe.email}</p>
                <p className="text-[#252525]/60 text-base font-bold">{employe.telephone}</p>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setEditing(true)} className="bg-[#FF3B30] hover:bg-[#E2231A] text-white px-5 py-2 rounded-md text-sm font-black transition-all duration-200 hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5">
                  Modifier
                </button>
                <button onClick={handleDelete} className="border-2 border-[#C0392B]/30 text-[#C0392B] font-black px-5 py-2 rounded-md text-sm hover:bg-[#C0392B]/5 hover:border-[#C0392B] transition-all duration-200">
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#252525]/5 border-t-4" style={{ borderTopColor: '#2E7D5B' }}>
            <p className="text-[#252525]/60 text-sm font-black mb-1">Présent</p>
            <p className="font-black" style={{ color: '#2E7D5B', fontSize: '40px', fontStretch: 'expanded' }}>{totalPresent}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#252525]/5 border-t-4" style={{ borderTopColor: '#C0392B' }}>
            <p className="text-[#252525]/60 text-sm font-black mb-1">Absent</p>
            <p className="font-black" style={{ color: '#C0392B', fontSize: '40px', fontStretch: 'expanded' }}>{totalAbsent}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#252525]/5 border-t-4" style={{ borderTopColor: '#C9821A' }}>
            <p className="text-[#252525]/60 text-sm font-black mb-1">Retard</p>
            <p className="font-black" style={{ color: '#C9821A', fontSize: '40px', fontStretch: 'expanded' }}>{totalRetard}</p>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl shadow-sm border border-[#252525]/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252525]/5">
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Date</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Statut</th>
                <th className="p-3 text-left text-[#252525/60 font-black text-xs uppercase tracking-wider">Arrivée</th>
                <th className="p-3 text-left text-[#252525]/60 font-black text-xs uppercase tracking-wider">Départ</th>
              </tr>
            </thead>
            <tbody>
              {presences.map((p) => (
                <tr key={p.id} className="border-t border-[##252525]/5">
                  <td className="p-3 font-bold text-[#252525]">{p.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${badgeColor[p.statut]}`}>
                      {p.statut}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[##252525]">{p.heureArrivee ?? '--'}</td>
                  <td className="p-3 font-bold text-[#252525]">{p.heureDepart ?? '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EmployeDetail