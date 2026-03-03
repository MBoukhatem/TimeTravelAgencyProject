import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Sparkles, RotateCcw, CalendarDays, Loader } from 'lucide-react'
import { destinations } from '../data/destinations'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

const questions = [
  {
    id: 'ambiance',
    question: 'Quelle ambiance vous fait rêver ?',
    options: [
      { value: 'culturelle', label: 'Culturelle & historique', icon: '🏛️', desc: 'Architecture, monuments, grands événements' },
      { value: 'sauvage', label: 'Sauvage & naturelle', icon: '🌿', desc: 'Nature brute, faune, aventure' },
      { value: 'artistique', label: 'Artistique & romantique', icon: '🎨', desc: 'Art, beauté, création, luxe' },
    ],
  },
  {
    id: 'style',
    question: 'Quel type de voyage vous correspond ?',
    options: [
      { value: 'decouverte', label: 'Découverte & contemplation', icon: '🔭', desc: 'Observer, apprendre, s\'immerger' },
      { value: 'adrénaline', label: 'Frissons & adrénaline', icon: '⚡', desc: 'Sensations fortes, expériences uniques' },
      { value: 'luxe', label: 'Luxe & raffinement', icon: '✨', desc: 'Confort, gastronomie, prestige' },
    ],
  },
  {
    id: 'compagnie',
    question: 'Avec qui voyagez-vous ?',
    options: [
      { value: 'solo', label: 'En solo', icon: '🧭', desc: 'Liberté totale, introspection' },
      { value: 'couple', label: 'En couple', icon: '💫', desc: 'Romance, moments partagés' },
      { value: 'groupe', label: 'En famille ou groupe', icon: '👥', desc: 'Souvenirs collectifs, convivialité' },
    ],
  },
  {
    id: 'priorité',
    question: 'Quelle expérience rêvez-vous de vivre ?',
    options: [
      { value: 'histoire', label: 'Rencontrer l\'Histoire', icon: '⏳', desc: 'Côtoyer des personnages légendaires' },
      { value: 'nature', label: 'Observer l\'extraordinaire', icon: '🦕', desc: 'Voir ce que personne d\'autre n\'a vu' },
      { value: 'creation', label: 'Vivre l\'art en train de naître', icon: '🖼️', desc: 'Être témoin d\'une œuvre immortelle' },
    ],
  },
]

// Fallback logic if Groq unavailable
function getFallbackRecommendation(answers) {
  const scores = { 'paris-1889': 0, cretace: 0, 'florence-1504': 0 }
  if (answers.ambiance === 'culturelle') scores['paris-1889'] += 3
  if (answers.ambiance === 'sauvage') scores.cretace += 3
  if (answers.ambiance === 'artistique') scores['florence-1504'] += 3
  if (answers.style === 'adrénaline') scores.cretace += 2
  if (answers.style === 'luxe') scores['florence-1504'] += 2
  if (answers.style === 'decouverte') scores['paris-1889'] += 2
  if (answers.priorité === 'histoire') scores['paris-1889'] += 3
  if (answers.priorité === 'nature') scores.cretace += 3
  if (answers.priorité === 'creation') scores['florence-1504'] += 3
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  const dest = destinations.find(d => d.slug === best)
  return {
    slug: best,
    pitch: `D'après vos réponses, **${dest.title}** est la destination idéale pour vous. ${dest.description} Une expérience inoubliable vous attend à **${dest.price.toLocaleString('fr-FR')}₳ Chronos**.`,
  }
}

async function getGroqRecommendation(answers) {
  const answersText = Object.entries(answers)
    .map(([q, a]) => {
      const question = questions.find(qu => qu.id === q)
      const option = question?.options.find(o => o.value === a)
      return `${question?.question} → ${option?.label}`
    })
    .join('\n')

  const prompt = `Un client de TimeTravel Agency a répondu à un quiz de recommandation. Voici ses réponses :
${answersText}

Les 3 destinations disponibles sont :
- Paris 1889 (slug: paris-1889) : L'Âge d'Or Parisien, 4 500₳ Chronos — Culture, Histoire, Architecture
- Crétacé -66M (slug: cretace) : L'Aube des Géants, 6 200₳ Chronos — Aventure, Nature, Faune
- Florence 1504 (slug: florence-1504) : Cœur de la Renaissance, 5 100₳ Chronos — Art, Romantisme, Luxe

Réponds UNIQUEMENT au format JSON suivant, sans aucun texte avant ou après :
{"slug": "<slug de la destination recommandée>", "pitch": "<2-3 phrases en français, ton passionné et personnalisé, expliquant pourquoi cette destination correspond parfaitement au profil du client. Mentionne le titre et le prix.>"}`

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.6,
    }),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data = await res.json()
  const raw = data.choices[0].message.content.trim()
  // Extract JSON even if model added surrounding text
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Invalid JSON response')
  return JSON.parse(match[0])
}

// ---------- Sub-components ----------

function ProgressBar({ current, total }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full bg-gold-400"
            initial={{ width: 0 }}
            animate={{ width: i < current ? '100%' : '0%' }}
            transition={{ duration: 0.4 }}
          />
        </div>
      ))}
    </div>
  )
}

function QuestionStep({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (value) => {
    setSelected(value)
    setTimeout(() => onAnswer(value), 350)
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="text-xs text-gold-400 tracking-[0.25em] uppercase mb-2">
        Question {index + 1} / {total}
      </div>
      <h3 className="font-serif text-xl text-white mb-6">{question.question}</h3>
      <div className="flex flex-col gap-3">
        {question.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`group flex items-center gap-4 p-4 rounded-sm border text-left transition-all duration-200 ${
              selected === opt.value
                ? 'bg-gold-500/20 border-gold-400 scale-[1.02]'
                : 'bg-white/3 border-white/10 hover:bg-white/6 hover:border-gold-500/30'
            }`}
          >
            <span className="text-2xl flex-shrink-0">{opt.icon}</span>
            <div>
              <div className={`text-sm font-semibold ${selected === opt.value ? 'text-gold-400' : 'text-gray-200'}`}>
                {opt.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
            </div>
            {selected === opt.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center flex-shrink-0"
              >
                <span className="text-dark-900 text-xs font-bold">✓</span>
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function LoadingStep() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 gap-5"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-gold-500/20 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-gold-400" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-t-2 border-gold-400"
        />
      </div>
      <div className="text-center">
        <p className="text-gold-400 font-serif text-lg">CHRONOS analyse votre profil…</p>
        <p className="text-gray-500 text-sm mt-1">L'IA détermine votre destination idéale</p>
      </div>
    </motion.div>
  )
}

function ResultStep({ result, onReserve, onRetry, onClose }) {
  const dest = destinations.find(d => d.slug === result.slug) || destinations[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Destination visual */}
      <div className="relative h-40 rounded-sm overflow-hidden mb-6">
        <img
          src={dest.image}
          alt={dest.era}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/40 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <div className="text-xs text-gold-400 tracking-widest uppercase">{dest.era}</div>
          <div className="font-serif text-xl text-white">{dest.title}</div>
        </div>
        <div className="absolute top-3 right-3 text-3xl">{dest.icon}</div>

        {/* Recommendation badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gold-500/90 px-2.5 py-1 rounded-sm">
          <Sparkles className="w-3 h-3 text-dark-900" />
          <span className="text-xs font-bold text-dark-900 tracking-wider">RECOMMANDÉ POUR VOUS</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dest.tags.map(tag => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-gray-400">
            {tag}
          </span>
        ))}
      </div>

      {/* AI pitch */}
      <div className="bg-dark-700 border border-gold-500/15 rounded-sm p-4 mb-6">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
          <p
            className="text-sm text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: result.pitch.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-400">$1</strong>')
            }}
          />
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-gray-600 tracking-widest uppercase">Prix par personne</div>
          <div className="text-2xl font-serif font-bold" style={{ color: dest.color }}>
            {dest.price.toLocaleString('fr-FR')}
            <span className="text-sm font-normal text-gray-400 ml-1">{dest.currency}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-3 border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200 text-sm rounded-sm transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refaire
        </button>
        <button
          onClick={() => { onClose(); onReserve(dest) }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold text-sm tracking-wider uppercase rounded-sm transition-colors"
        >
          <CalendarDays className="w-4 h-4" />
          Réserver ce voyage
        </button>
      </div>
    </motion.div>
  )
}

// ---------- Main modal ----------

export default function QuizModal({ onClose, onReserve }) {
  const [step, setStep] = useState(0) // 0-3 = questions, 4 = loading, 5 = result
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const handleAnswer = async (value) => {
    const questionId = questions[step].id
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setStep(questions.length) // loading
      try {
        const rec = GROQ_API_KEY
          ? await getGroqRecommendation(newAnswers)
          : getFallbackRecommendation(newAnswers)
        setResult(rec)
      } catch {
        setResult(getFallbackRecommendation(newAnswers))
      }
      setStep(questions.length + 1) // result
    }
  }

  const handleRetry = () => {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  const isResult = step === questions.length + 1
  const isLoading = step === questions.length

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-dark-800 border border-gold-500/20 rounded-sm w-full max-w-md shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="font-serif text-sm text-gold-400 tracking-wider">
                {isResult ? 'Votre destination idéale' : 'Quiz de recommandation'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-600 hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {!isLoading && !isResult && (
              <ProgressBar current={step} total={questions.length} />
            )}

            <AnimatePresence mode="wait">
              {isLoading && <LoadingStep key="loading" />}

              {isResult && result && (
                <ResultStep
                  key="result"
                  result={result}
                  onReserve={onReserve}
                  onRetry={handleRetry}
                  onClose={onClose}
                />
              )}

              {!isLoading && !isResult && (
                <QuestionStep
                  key={step}
                  question={questions[step]}
                  index={step}
                  total={questions.length}
                  onAnswer={handleAnswer}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
