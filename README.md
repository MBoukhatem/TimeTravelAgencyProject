# TimeTravel Agency — Webapp Interactive

> L'agence de voyage temporel de luxe. Une landing page React immersive présentant 3 destinations temporelles, un quiz de recommandation IA et un assistant conversationnel intégré.

## Aperçu

TimeTravel Agency est une webapp moderne construite avec React + Tailwind CSS. Elle propose une interface sombre et élégante avec des animations Framer Motion, trois destinations temporelles interactives, un **quiz de recommandation personnalisé** et un chatbot conversationnel (CHRONOS) — tous deux propulsés par le LLM **Llama 3.3 70B** via l'API Groq.

## Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| **React 18** | Framework UI |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3** | Styling utilitaire |
| **Framer Motion 11** | Animations & transitions |
| **Lucide React** | Icônes SVG |
| **Groq API** | LLM ultra-rapide — quiz IA + chatbot (Llama 3.3 70B) |

## Fonctionnalités

- **Hero Section** — Background immersif avec animations Framer Motion (fade-in, orbes lumineux, champ d'étoiles)
- **3 Destinations** — Paris 1889, Crétacé -66M, Florence 1504 — cards interactives avec vidéo en background au hover
- **Quiz de recommandation IA** — 4 questions sur les préférences, recommandation personnalisée générée par Groq, accessible depuis la navbar et le hero
- **Chatbot CHRONOS** — Widget flottant propulsé par Groq (Llama 3.3 70B), avec mémoire de conversation et fallback automatique
- **Modal de réservation** — Formulaire avec calcul du prix en temps réel, enchaînable depuis le quiz
- **Design System** — Thème Dark Mode & Gold/Premium, entièrement responsive

## Membres de l'équipe

- [BOUKHATEM Mustapha]
- [BOUHAIC BILEL]
- [BADOU Marole Conrad]
- [BOUZIANE Seddak ]

## Installation

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd timetravel-agency

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API Groq
cp .env.example .env
# Puis renseigner VITE_GROQ_API_KEY dans le fichier .env
# Créer une clé gratuite sur : https://console.groq.com

# 4. Lancer en développement
npm run dev

# 5. Build de production
npm run build

# 6. Prévisualiser le build
npm run preview
```

Le serveur de développement démarre sur `http://localhost:5173`

> **Sans clé API**, le quiz et le chatbot basculent automatiquement sur un mode de réponses locales (aucune erreur, fonctionnement dégradé).

## Variables d'environnement

| Variable | Description | Requis |
|---|---|---|
| `VITE_GROQ_API_KEY` | Clé API Groq — utilisée par le quiz IA et le chatbot | Non (fallback automatique) |

⚠️ Ne jamais commiter le fichier `.env`. Il est exclu par `.gitignore`.

## Structure du projet

```
src/
├── components/
│   ├── ChatBot.jsx          # Widget chatbot flottant (Groq + fallback)
│   ├── DestinationCard.jsx  # Carte destination avec vidéo au hover
│   ├── Destinations.jsx     # Section grille des 3 destinations
│   ├── Footer.jsx           # Pied de page
│   ├── Header.jsx           # Navigation fixe — liens + bouton Quiz
│   ├── Hero.jsx             # Section hero avec animations + bouton Quiz
│   ├── QuizModal.jsx        # Quiz 4 questions + recommandation Groq IA
│   ├── ReservationModal.jsx # Modale de réservation avec calcul de prix
│   └── StarField.jsx        # Fond étoilé animé
├── data/
│   └── destinations.js      # Données des 3 destinations (images + vidéos)
├── hooks/
│   └── useChat.js           # Hook chatbot — Groq API + fallback mots-clés
├── App.jsx
├── main.jsx
└── index.css                # Styles globaux + Tailwind
public/
├── images/                  # Images PNG des destinations
│   ├── paris1889.png
│   ├── cretace.png
│   └── florence.png
└── videos/                  # Vidéos MP4 (lazy-loaded au hover)
    ├── paris1889.mp4
    ├── cretace.mp4
    └── florence.mp4
```

## Déploiement

### Vercel
```bash
npm i -g vercel
vercel --prod
```
> Ajouter `VITE_GROQ_API_KEY` dans les variables d'environnement du projet sur le dashboard Vercel.

### Netlify
```bash
npm run build
# Glisser le dossier dist/ sur netlify.com/drop
```
> Ajouter `VITE_GROQ_API_KEY` dans Site settings → Environment variables.

---

## Utilisation du Quiz

1. Cliquer sur **Quiz** dans la navbar ou **"Trouver mon époque"** sur la page d'accueil
2. Répondre aux 4 questions sur vos préférences de voyage
3. CHRONOS (Llama 3.3 70B) analyse votre profil et génère une recommandation personnalisée
4. Cliquer sur **"Réserver ce voyage"** pour accéder directement au formulaire de réservation

---

*Projet réalisé dans le cadre d'un exercice de Vibe Coding — React + Tailwind + Framer Motion + Groq AI.*
