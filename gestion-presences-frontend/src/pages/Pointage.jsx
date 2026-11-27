import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, LogIn, LogOut, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../api/axiosConfig'

const formatHeure = (t) => (t ? t.slice(0, 5) : '--')
const todayStr = () => new Date().toLocaleDateString('en-CA')

const getErrorMessage = (err) => {
  if (!err.response) return 'Serveur injoignable, vérifiez votre connexion'
  const serverMsg = err.response.data?.message
  if (serverMsg) return serverMsg
  switch (err.response.status) {
    case 401: return 'Session expirée, veuillez vous reconnecter'
    case 403: return 'Pointage refusé : vous devez être sur le réseau de DBM Maroc'
    case 409: return 'Pointage déjà enregistré'
    default: return 'Erreur lors du pointage'
  }
}

function Pointage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const [today, setToday] = useState(null)          // présence du jour
  const [todayKnown, setTodayKnown] = useState(false)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')


  useEffect(() => {
    api.get('/presences/me')
      .then((res) => {
        setToday(res.data.find((p) => p.date === todayStr()) ?? null)
        setTodayKnown(true)
      })
      .catch(() => setTodayKnown(false))
      .finally(() => setReady(true))
  }, [])


  useEffect(() => {
    if (!message) return
    const id = setTimeout(() => setMessage(''), 6000)
    return () => clearTimeout(id)
  }, [message])

  const pointer = async (type) => {
    if (type === 'depart' && !window.confirm('Confirmer votre départ ?')) return

    setError('')
    setMessage('')
    setBusy(true)
    try {
      const res = await api.post(`/presences/pointer-${type}`)
      setToday(res.data)
      setTodayKnown(true)
      setMessage(
        type === 'arrivee'
          ? `Arrivée enregistrée à ${formatHeure(res.data.heureArrivee)}${res.data.statut === 'RETARD' ? ' (retard)' : ''}`
          : `Départ enregistré à ${formatHeure(res.data.heureDepart)}`
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const arrived = Boolean(today?.heureArrivee)
  const left = Boolean(today?.heureDepart)
  const disableArrivee = !ready || busy || (todayKnown && arrived)
  const disableDepart = !ready || busy || (todayKnown && (!arrived || left))

  const backTo = role === 'EMPLOYE' ? '/profil' : '/dashboard'
  const backLabel = role === 'EMPLOYE' ? '← Retour à mon profil' : '← Retour au tableau de bord'

  const baseBtn = "w-full flex items-center justify-center gap-3 py-3 rounded-md text-base font-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"

  return (
    <div className="min-h-screen bg-[#F7F7F7]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#252525]/5 w-full max-w-md text-center">

          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="mb-6 text-[#252525]/60 text-sm font-black hover:text-[#E2231A] transition-colors border-b border-transparent hover:border-[#E2231A] pb-0.5 block w-fit mx-auto"
          >
            {backLabel}
          </button>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock size={32} className="text-[#252525] stroke-[2.5px]" />
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900', fontSize: '36px', color: '#252525' }}>
              Pointage
            </h1>
          </div>

          {todayKnown && (
            <p className="mb-5 text-sm font-bold text-[#252525]/60">
              Aujourd'hui : arrivée {formatHeure(today?.heureArrivee)} · départ {formatHeure(today?.heureDepart)}
            </p>
          )}

          <div aria-live="polite">
            {message && (
              <div role="status" className="flex items-center justify-center gap-2 text-[#2E7D5B] font-black text-sm bg-[#2E7D5B]/10 p-3 rounded border border-[#2E7D5B]/10 mb-5">
                <CheckCircle size={16} className="stroke-[3px]" />
                {message}
              </div>
            )}
            {error && (
              <div role="alert" className="flex items-center justify-center gap-2 text-[#C0392B] font-black text-sm bg-[#C0392B]/10 p-3 rounded border border-[#C0392B]/10 mb-5">
                <AlertCircle size={16} className="stroke-[3px]" />
                {error}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => pointer('arrivee')}
              disabled={disableArrivee}
              className={`${baseBtn} bg-[#FF3B30] hover:bg-[#E2231A] text-white hover:shadow-lg hover:shadow-[#FF3B30]/30 hover:-translate-y-0.5`}
            >
              <LogIn size={20} className="stroke-[3px]" />
              {busy ? 'Enregistrement...' : 'Je suis arrivé(e)'}
            </button>

            <button
              type="button"
              onClick={() => pointer('depart')}
              disabled={disableDepart}
              className={`${baseBtn} border-2 border-[#252525] text-[#252525] hover:bg-[#F7F7F7] hover:-translate-y-0.5`}
            >
              <LogOut size={20} className="stroke-[3px]" />
              Je pars
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pointage