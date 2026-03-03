import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Users, CheckCircle, Loader } from 'lucide-react'

export default function ReservationModal({ destination, onClose }) {
  const [form, setForm] = useState({ date: '', travelers: 1, name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!destination) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  const inputClass = "w-full bg-dark-700 border border-white/10 focus:border-gold-500/50 rounded-sm px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-dark-800 border border-gold-500/20 rounded-sm w-full max-w-md overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-28 overflow-hidden">
            <img src={destination.image} alt={destination.era} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-800" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-4">
              <div className="text-xs text-gold-400 tracking-widest uppercase">{destination.era}</div>
              <div className="font-serif text-lg text-white">{destination.title}</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-white mb-2">Réservation confirmée !</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Un conseiller temporel vous contactera sous 24h à l'adresse <strong className="text-gold-400">{form.email}</strong> pour finaliser votre voyage.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold text-sm tracking-wider uppercase rounded-sm transition-colors"
                  >
                    Fermer
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-lg text-gold-400 mb-5 text-center">Formulaire de réservation</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 tracking-widest uppercase mb-2">Votre nom</label>
                      <input
                        required
                        type="text"
                        placeholder="Jean Dupont"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 tracking-widest uppercase mb-2">Email</label>
                      <input
                        required
                        type="email"
                        placeholder="jean@mail.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 tracking-widest uppercase mb-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Date de départ
                    </label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className={inputClass}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 tracking-widest uppercase mb-2">
                      <Users className="w-3 h-3 inline mr-1" />
                      Nombre de voyageurs
                    </label>
                    <select
                      value={form.travelers}
                      onChange={e => setForm(f => ({ ...f, travelers: parseInt(e.target.value) }))}
                      className={inputClass}
                      style={{ colorScheme: 'dark' }}
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} voyageur{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price summary */}
                  <div className="mt-4 p-4 bg-dark-700 rounded-sm border border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Prix par personne</span>
                      <span className="text-white">{destination.price.toLocaleString('fr-FR')}₳</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">× {form.travelers} voyageur{form.travelers > 1 ? 's' : ''}</span>
                      <span className="text-white">{(destination.price * form.travelers).toLocaleString('fr-FR')}₳</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold mt-3 pt-3 border-t border-white/10">
                      <span className="text-gold-400">Total</span>
                      <span className="text-gold-400">{(destination.price * form.travelers).toLocaleString('fr-FR')}₳ Chronos</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-dark-900 font-semibold tracking-wider uppercase text-sm rounded-sm transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <><Loader className="w-4 h-4 animate-spin" /> Confirmation...</>
                    ) : (
                      'Confirmer ma réservation'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
