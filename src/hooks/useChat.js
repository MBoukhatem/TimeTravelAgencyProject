import { useState, useCallback, useRef } from 'react'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `Tu es CHRONOS, l'assistant expert de TimeTravel Agency, une agence de voyage temporel de luxe.
Ton ton est professionnel, passionné et légèrement mystérieux. Tu t'exprimes en français, de façon concise (3-5 phrases max par réponse).

Tu connais parfaitement ces 3 destinations :

1. PARIS 1889 — "L'Âge d'Or Parisien"
   - Période : Exposition Universelle, inauguration de la Tour Eiffel
   - Tags : Culture, Histoire, Architecture
   - Prix : 4 500₳ Chronos
   - Points forts : visite privée du chantier Eiffel, dîner Belle Époque, rencontre avec Gustave Eiffel

2. CRÉTACÉ (-66 millions d'années) — "L'Aube des Géants"
   - Période : ère des dinosaures, nature primordiale
   - Tags : Aventure, Nature, Faune
   - Prix : 6 200₳ Chronos
   - Points forts : safari dinosaures sécurisé, forêts primordiales, guide spécialisé

3. FLORENCE 1504 — "Cœur de la Renaissance"
   - Période : Florence médicéenne, Michel-Ange crée le David
   - Tags : Art, Romantisme, Luxe
   - Prix : 5 100₳ Chronos
   - Points forts : atelier de Michel-Ange, Galerie des Offices, dîner avec les Médicis

Infos générales :
- La devise est le Chronos (₳), monnaie temporelle de l'agence
- Tous les voyages incluent : transport aller-retour, hébergement de luxe, guide personnel certifié
- Sécurité garantie par les capsules ISO-T9, assurance paradoxe temporel incluse
- 12 000+ voyages réalisés sans incident depuis 15 ans
- Pour réserver : cliquer sur "Réserver" sur la carte de la destination souhaitée

Si on te demande quelque chose hors de ton domaine, recentre poliment sur les voyages temporels.`

const PERSONA_INTRO = `Bienvenue chez TimeTravel Agency ! Je suis CHRONOS, votre assistant personnel en voyages temporels.
Comment puis-je vous aider à choisir votre prochaine aventure à travers le temps ?`

// Fallback keyword responses (used if Groq API is unavailable)
const botResponses = {
  default: [
    "Fascinante question ! En tant qu'expert des voyages temporels, je dirais que chaque époque possède sa magie unique. Puis-je vous en dire plus sur nos destinations ?",
    "Notre technologie de déplacement temporel est de la plus haute précision. Toutes nos excursions sont parfaitement sûres et supervisées par nos chrononautes certifiés.",
    "Je comprends votre curiosité ! Nos voyageurs reviennent toujours transformés par leurs expériences. Quelle période vous attire le plus ?",
  ],
  prix: `Voici nos tarifs actuels :\n\n🗼 Paris 1889 — L'Âge d'Or Parisien : **4 500₳ Chronos**\n🦕 Crétacé (-66M) — L'Aube des Géants : **6 200₳ Chronos**\n🎨 Florence 1504 — Cœur de la Renaissance : **5 100₳ Chronos**\n\nLes tarifs incluent : transport temporel aller-retour, hébergement de luxe dans l'époque et guide personnel certifié.`,
  destinations: `Nous proposons actuellement 3 destinations exceptionnelles :\n\n🗼 **Paris 1889** — Vivez l'inauguration de la Tour Eiffel lors de l'Exposition Universelle\n🦕 **Crétacé** — Observez les dinosaures dans leur habitat naturel il y a 66 millions d'années\n🎨 **Florence 1504** — Rencontrez Michel-Ange et les Médicis au cœur de la Renaissance\n\nLaquelle vous intéresse le plus ?`,
  paris: `Paris 1889 — *L'Âge d'Or Parisien* ✨\n\nUn voyage inoubliable au cœur de l'Exposition Universelle. Vous assisterez à l'inauguration de la Tour Eiffel par Gustave Eiffel lui-même. Le prix est de **4 500₳ Chronos** tout inclus.`,
  dinosaure: `Crétacé — *L'Aube des Géants* 🦕\n\nNotre expédition la plus adrénalinante ! 66 millions d'années de voyage pour observer les plus grands animaux ayant jamais existé. **6 200₳ Chronos** incluant un guide spécialisé en faune préhistorique.`,
  florence: `Florence 1504 — *Cœur de la Renaissance* 🎨\n\nLe summum du voyage culturel de luxe. Vous côtoierez Michel-Ange dans son atelier et assisterez à la création du David. **5 100₳ Chronos** incluant un séjour dans un palazzo médicéen.`,
  réserver: `Pour réserver votre voyage, cliquez sur le bouton **"Réserver"** de la destination qui vous intéresse.\n\nNotre processus est simple :\n1. Choisissez votre destination\n2. Sélectionnez vos dates de départ\n3. Indiquez le nombre de voyageurs\n4. Confirmez votre réservation\n\nUn conseiller temporel vous contactera sous 24h. ⏱️`,
  sécurité: `Votre sécurité est notre priorité absolue ! 🛡️\n\nNos voyages sont couverts par :\n• Capsules de protection temporelle certifiées ISO-T9\n• Guides chrononautes avec 10+ ans d'expérience\n• Assurance "Paradoxe temporel" complète\n\nDepuis 15 ans, nous avons réalisé +12 000 voyages sans incident.`,
  bonjour: `Bonjour ! Ravi de vous accueillir chez TimeTravel Agency ! 🌟\n\nJe suis CHRONOS, votre assistant en voyages temporels. Quelle époque vous fait rêver ?`,
}

function getKeywordResponse(message) {
  const lower = message.toLowerCase()
  if (/bonjour|salut|hello|bonsoir|hey/.test(lower)) return botResponses.bonjour
  if (/prix|tarif|coût|combien|cher/.test(lower)) return botResponses.prix
  if (/destination|voyage|où|epoque|période/.test(lower) && !/paris|florence|crétacé|dinosaure/.test(lower)) return botResponses.destinations
  if (/paris|eiffel|1889|exposition/.test(lower)) return botResponses.paris
  if (/dinosaure|crétacé|préhistoire|jurassique/.test(lower)) return botResponses.dinosaure
  if (/florence|renaissance|michel-ange|michel ange|david|medici|médicis|1504/.test(lower)) return botResponses.florence
  if (/réserver|réservation|book|acheter/.test(lower)) return botResponses.réserver
  if (/sécurité|sécurisé|danger|risque|safe/.test(lower)) return botResponses.sécurité
  const defaults = botResponses.default
  return defaults[Math.floor(Math.random() * defaults.length)]
}

async function callGroq(history) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      max_tokens: 300,
      temperature: 0.75,
    }),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

export function useChat() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: PERSONA_INTRO, timestamp: new Date() }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const historyRef = useRef([]) // conversation history in OpenAI format

  const sendMessage = useCallback(async (text) => {
    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    historyRef.current = [...historyRef.current, { role: 'user', content: text }]

    let responseText
    try {
      if (GROQ_API_KEY) {
        responseText = await callGroq(historyRef.current)
        historyRef.current = [...historyRef.current, { role: 'assistant', content: responseText }]
      } else {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 600))
        responseText = getKeywordResponse(text)
      }
    } catch (err) {
      console.warn('Groq indisponible, fallback mots-clés:', err.message)
      await new Promise(r => setTimeout(r, 800))
      responseText = getKeywordResponse(text)
    }

    setIsTyping(false)
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'bot',
      text: responseText,
      timestamp: new Date(),
    }])
  }, [])

  const clearChat = useCallback(() => {
    historyRef.current = []
    setMessages([{ id: 1, role: 'bot', text: PERSONA_INTRO, timestamp: new Date() }])
  }, [])

  return { messages, isTyping, sendMessage, clearChat }
}
