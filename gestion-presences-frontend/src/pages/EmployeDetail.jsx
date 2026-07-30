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

  if (!employe) return <p className="p-8">Chargement...</p>

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button onClick={() => navigate('/employes')} className="mb-4 text-blue-600">
        ← Retour
      </button>

      <div className="bg-white p-6 rounded shadow mb-6">
        {editing ? (
          <div>
            <input name="nom" value={form.nom} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input name="prenom" value={form.prenom} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input name="email" value={form.email} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input name="telephone" value={form.telephone} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input name="poste" value={form.poste} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input name="departement" value={form.departement} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={form.actif}
                onChange={(e) => setForm({ ...form, actif: e.target.checked })}
              />
              Actif
            </label>
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
                Enregistrer
              </button>
              <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">{employe.prenom} {employe.nom}</h1>
            <p className="text-gray-500">{employe.poste} — {employe.departement}</p>
            <p className="text-gray-500">{employe.email}</p>
            <p className="text-gray-500">{employe.telephone}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
                Modifier
              </button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Présent</p>
          <p className="text-3xl font-bold text-green-600">{totalPresent}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Absent</p>
          <p className="text-3xl font-bold text-red-600">{totalAbsent}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Retard</p>
          <p className="text-3xl font-bold text-orange-500">{totalRetard}</p>
        </div>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Date</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Arrivée</th>
            <th className="p-3">Départ</th>
          </tr>
        </thead>
        <tbody>
          {presences.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.date}</td>
              <td className="p-3">{p.statut}</td>
              <td className="p-3">{p.heureArrivee ?? '--'}</td>
              <td className="p-3">{p.heureDepart ?? '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeDetail