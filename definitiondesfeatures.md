# Définition des Fonctionnalités — TimeTravel Agency

## 1. Page d'accueil

### 1.1 Hero Section

**Objectif :** Créer une première impression immersive et mémorable dès l'arrivée sur le site.

**Fonctionnalités implémentées :**
- **Fond animé** — Image spatiale haute résolution avec opacité réduite, superposée d'un dégradé sombre vers le bas. Deux orbes lumineux animées (or et violet) pulsent en boucle via Framer Motion pour créer un effet de profondeur.
- **Champ d'étoiles** — 120 particules étoilées générées aléatoirement, animées en scintillement indépendant (`StarField.jsx`). Positionné en fond fixe sur toute la page.
- **Headline animée** — Le titre "Voyagez à travers le temps." apparaît en fade-in progressif avec un léger mouvement vertical (Framer Motion, `duration: 0.9s`, `delay: 0.2s`). Le sous-titre et les éléments secondaires s'enchaînent en cascade (delays échelonnés : 0.2 → 0.5 → 0.8 → 1.0s).
- **Badge d'accroche** — Bandeau pill animé affichant "L'agence de voyage temporel de luxe" avec icônes Sparkles.
- **Indicateur de scroll** — Chevron animé en bas de section invitant l'utilisateur à descendre.

**Présentation de l'agence :**
- Sous-headline expliquant la proposition de valeur : _"Trois destinations. Trois époques. Une seule certitude : vous ne serez plus jamais le même."_
- Ligne de destinations texte : `Paris 1889 · Crétacé -66M · Florence 1504`
- **Bloc de statistiques** animé en fade-in : 12 000+ voyages réalisés, 15 ans d'expérience, 100% retours garantis.

**CTA vers les destinations :**
- Bouton principal **"Choisir une époque"** — fond gold, effet de brillance au hover (pseudo-élément animé), scroll smooth vers `#destinations`.
- Bouton secondaire **"Parler à CHRONOS"** — outline transparent, scroll smooth vers le widget chatbot.

---

### 1.2 Header / Navigation

**Objectif :** Permettre une navigation fluide et renforcer l'identité visuelle de la marque.

**Fonctionnalités :**
- **Logo** — Icône horloge animée (rotation 180° au hover) + nom de marque "TimeTravel Agency" en typographie Cinzel (serif).
- **Liens de navigation** — Accueil, Destinations, Chat — avec underline animée au hover.
- **Bouton Réserver** — Accentué, border gold, dans la nav desktop.
- **Effet de scroll** — Le header passe de `transparent` à `bg-glass-dark` (backdrop-blur + border gold) après 40px de scroll.
- **Menu burger responsive** — Affiché uniquement sur mobile, avec animation d'ouverture/fermeture (Framer Motion `AnimatePresence`).

---

## 2. Galerie des Destinations

### 2.1 Cards Interactives

**Objectif :** Présenter les 3 époques de façon visuelle, informative et engageante, avec une incitation claire à la réservation.

**Les 3 destinations (`src/data/destinations.js`) :**

| Destination | Titre | Prix |
|-------------|-------|------|
| Paris 1889 | L'Âge d'Or Parisien | 4 500₳ Chronos |
| Crétacé (-66M) | L'Aube des Géants | 6 200₳ Chronos |
| Florence 1504 | Cœur de la Renaissance | 5 100₳ Chronos |

**Fonctionnalités de chaque card (`DestinationCard.jsx`) :**
- **Visuel image** — Photo PNG fournie par l'équipe, chargée en `lazy loading` (`loading="lazy"`, `decoding="async"`).
- **Vidéo en background au hover** — Chaque destination possède une vidéo MP4 dédiée (`/videos/paris1889.mp4`, etc.). La vidéo est chargée à la demande uniquement au **premier survol** (`preload="none"` + `.load()` déclenché au `mouseEnter`) pour ne pas pénaliser le chargement initial.
- **Crossfade image → vidéo** — Transition fluide en opacité (700ms) entre la photo statique et la vidéo en lecture.
- **Badge "▶ LIVE"** — Indicateur animé (Framer Motion) apparaissant pendant la lecture vidéo.
- **Badge époque** — Affiché en overlay sur le média avec icône Clock et couleur thématique.
- **Effet hover global** — La card s'agrandit (`scale: 1.03`) et monte légèrement (`y: -6px`) via `whileHover` Framer Motion.
- **Tags catégoriels** — Ex. : Culture, Histoire, Architecture — affichés avec icône Tag.
- **Prix** — Mis en valeur avec la couleur thématique de la destination.
- **Bouton "Réserver"** — Couleur et border dynamiques selon la destination, déclenche l'ouverture de la modale de réservation.
- **Glow hover** — Lueur intérieure colorée au survol (`box-shadow` inset).
- **Animation d'entrée** — Chaque card apparaît en fade-up au scroll (`whileInView`, stagger de 0.15s par carte).

**Optimisation du chargement :**

| Élément | Stratégie |
|---|---|
| Images des cards | `loading="lazy"` + `decoding="async"` |
| Vidéos des cards | `preload="none"` — chargées uniquement au premier hover |
| Image hero | `loading="eager"` + `fetchPriority="high"` — priorité maximale (above-the-fold) |
| Image modale | `loading="lazy"` — chargée à l'ouverture uniquement |

**Informations détaillées par destination :**
- Titre de l'époque et nom complet
- Description courte sur la card
- Description longue dans les données (prête pour une page détail future)
- Liste de `highlights` : 4 points forts par destination
- Couleur, dégradé et icône emoji propres à chaque époque

---

## 3. Agent Conversationnel — CHRONOS

### 3.1 Chatbot IA Intégré

**Objectif :** Offrir un accompagnement personnalisé et intelligent 24h/24, incarné par un conseiller expert en voyages temporels.

**Persona :**
- Nom : **CHRONOS**
- Ton : professionnel, passionné, légèrement mystérieux
- Message d'accueil : _"Bienvenue chez TimeTravel Agency ! Je suis CHRONOS, votre assistant personnel en voyages temporels."_

**Technologie IA — Groq API :**
- **Fournisseur :** [Groq](https://console.groq.com) — API gratuite avec quota généreux (30 req/min)
- **Modèle :** `llama-3.3-70b-versatile` — LLM open source de Meta, 70 milliards de paramètres
- **Vitesse :** Réponses en < 1 seconde grâce au hardware LPU (Language Processing Unit) de Groq
- **Langue :** Français natif, instruction via system prompt dédié
- **Mémoire de conversation :** L'historique complet des échanges est envoyé à chaque requête (`historyRef`), permettant à CHRONOS de se souvenir du contexte de la session
- **Configuration :** Clé API stockée dans `.env` (`VITE_GROQ_API_KEY`), jamais exposée dans le code source

**System prompt (instructions de CHRONOS) :**
CHRONOS reçoit un prompt système définissant :
- Son identité et son ton
- La connaissance exacte des 3 destinations (titres, prix, points forts)
- Les informations générales de l'agence (sécurité, devises, processus de réservation)
- La consigne de recentrer sur les voyages temporels si la question est hors sujet

**Interface (`ChatBot.jsx`) :**
- **Widget flottant** — Bouton rond gold en bas à droite, avec animation `pulse-gold` et badge de notification rouge.
- **Fenêtre de chat** — Thème sombre avec accents dorés, `backdrop-filter: blur`, apparition en spring animation.
- **Indicateur "en ligne"** — Pastille verte sur l'avatar CHRONOS.
- **Indicateur de frappe** — Trois points animés (`typing dots`) pendant l'appel API.
- **Mise en forme des réponses** — Support du markdown inline : `**gras**` affiché en or, `*italique*`.
- **Suggestions rapides** — 3 boutons pré-remplis à l'ouverture : "Voir les prix", "Paris 1889", "Comment réserver ?"
- **Effacement de conversation** — Icône corbeille pour réinitialiser le chat et la mémoire.
- **Responsive** — Largeur adaptée : `w-80` mobile, `sm:w-96` desktop.

### 3.2 Conseils Personnalisés sur les Destinations

Grâce au LLM, CHRONOS peut répondre librement à toute question sur les destinations, sans être limité à une liste de mots-clés. Il adapte ses réponses au contexte de la conversation et peut comparer les destinations, donner des conseils personnalisés ou développer des détails à la demande.

Exemples de questions gérées nativement :
- _"Quelle destination me conseilles-tu pour un premier voyage ?"_
- _"Est-ce que le Crétacé est adapté à des enfants ?"_
- _"Quelle est la différence entre Florence et Paris ?"_
- _"Combien coûte un voyage pour 3 personnes à Florence ?"_

### 3.3 FAQ Automatisée

Les thèmes couverts automatiquement par le system prompt :
- Prix et devises (₳ Chronos), calcul par nombre de voyageurs
- Présentation et comparaison des 3 destinations
- Processus de réservation (étapes 1 à 4)
- Sécurité et certifications (ISO-T9, assurance paradoxe temporel)
- Inclusions du voyage (transport, hébergement, guide)

### 3.4 Système de Fallback

En cas d'indisponibilité de l'API (quota dépassé, pas de clé configurée, erreur réseau), le chatbot bascule **automatiquement** et silencieusement sur un système de réponses par mots-clés prédéfinies :

| Déclencheurs | Réponse fallback |
|---|---|
| `bonjour`, `salut`, `hello` | Message de bienvenue |
| `prix`, `tarif`, `combien` | Tableau des 3 tarifs |
| `paris`, `eiffel`, `1889` | Fiche Paris 1889 |
| `dinosaure`, `crétacé` | Fiche Crétacé |
| `florence`, `michel-ange` | Fiche Florence 1504 |
| `réserver`, `réservation` | Étapes de réservation |
| `sécurité`, `danger` | Protocoles de sécurité |
| Autres | Réponse générique aléatoire |

L'utilisateur ne voit aucune erreur — le chatbot reste fonctionnel dans tous les cas.

---

## 4. Formulaire de Réservation

### 4.1 Sélection Destination + Dates

**Accès :** Clic sur "Réserver" depuis une card destination → ouverture de la modale (`ReservationModal.jsx`).

**Champs du formulaire :**
- **Nom** — Champ texte, requis
- **Email** — Champ email, requis
- **Date de départ** — Date picker avec `min` = date du jour (pas de réservation dans le passé)
- **Nombre de voyageurs** — Select de 1 à 6

**Contexte de destination :**
- La modale affiche l'image, l'époque et le titre de la destination sélectionnée.
- Le nom de la destination est pré-rempli contextuellement (pas de confusion entre les 3 destinations).

### 4.2 Validation Automatisée

- Tous les champs marqués `required` → validation HTML5 native.
- Le bouton de soumission est désactivé pendant le chargement (`disabled`).
- **Récapitulatif dynamique** — Bloc prix mis à jour en temps réel selon le nombre de voyageurs :
  - Prix par personne
  - × nombre de voyageurs
  - **Total en ₳ Chronos**
- **État de chargement** — Icône spinner + texte "Confirmation..." pendant 1.5s.
- **Écran de confirmation** — Après soumission : icône CheckCircle verte, message de confirmation avec l'email saisi, bouton "Fermer".
- Fermeture possible via : bouton X, clic sur l'overlay sombre, ou bouton "Fermer" post-confirmation.

---

## 5. Design System

| Élément | Valeur |
|---------|--------|
| Couleur de fond | `#0a0a0f` (dark-900) |
| Accent principal | `#fbbf24` (gold-400) |
| Typographie titres | Cinzel (serif) |
| Typographie corps | Raleway (sans-serif) |
| Glassmorphism | `backdrop-filter: blur(12-20px)` + border gold/15 |
| Animations | Framer Motion (spring, ease, whileInView) |
| Responsive | Mobile-first, breakpoints sm/md/lg |
