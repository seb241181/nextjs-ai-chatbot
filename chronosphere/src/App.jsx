import { useState, useEffect, useCallback } from 'react'
import './App.css'

// ─── CONSTANTES ────────────────────────────────────────────────────────────────
const STRIPE_LINK = 'https://buy.stripe.com/bJe00k2aB9lo9jQdGBc7u00'
const STORAGE_KEY = 'chronosphere_state'
const ARCHIVE_KEY = 'chronosphere_archive'

// ─── 58 CARTES ORACLE ──────────────────────────────────────────────────────────
const CARDS = [
  { id: 1,  name: "L'Éveil",           symbol: '☀️', element: 'Feu',   planet: 'Soleil',    message: "Une lumière nouvelle s'allume en toi. Le moment est venu de te révéler." },
  { id: 2,  name: 'La Lune Noire',      symbol: '🌑', element: 'Eau',   planet: 'Lune',      message: "Dans l'obscurité se cachent tes forces les plus profondes. Plonge." },
  { id: 3,  name: 'Mercure Ailé',       symbol: '⚡', element: 'Air',   planet: 'Mercure',   message: "La communication est ta clé. Dis ce que tu ressens sans filtre." },
  { id: 4,  name: 'Vénus Dorée',        symbol: '💛', element: 'Terre', planet: 'Vénus',     message: "L'amour et la beauté te sont acquis. Accueille la douceur." },
  { id: 5,  name: 'Mars Ardent',        symbol: '🔥', element: 'Feu',   planet: 'Mars',      message: "L'action est nécessaire. Agis sans hésitation, le courage t'appartient." },
  { id: 6,  name: 'Jupiter Sage',       symbol: '🌟', element: 'Air',   planet: 'Jupiter',   message: "L'expansion t'attend. Une opportunité majeure se présente à toi." },
  { id: 7,  name: 'Saturne Maître',     symbol: '⏳', element: 'Terre', planet: 'Saturne',   message: "La discipline forge le destin. Patience et structure sont tes alliées." },
  { id: 8,  name: 'Uranus Rebelle',     symbol: '🌀', element: 'Air',   planet: 'Uranus',    message: "La révolution commence en toi. Brise les vieux schémas sans remords." },
  { id: 9,  name: 'Neptune Mystique',   symbol: '🌊', element: 'Eau',   planet: 'Neptune',   message: "L'intuition ne ment jamais. Écoute ce que ton âme chuchote." },
  { id: 10, name: 'Pluton Alchimiste',  symbol: '💜', element: 'Feu',   planet: 'Pluton',    message: "La transformation totale est en cours. Laisse mourir ce qui doit mourir." },
  { id: 11, name: 'Le Portail',         symbol: '🚪', element: 'Éther', planet: 'Nœud Nord', message: "Un passage s'ouvre. Traverses-le sans regarder en arrière." },
  { id: 12, name: 'La Spirale',         symbol: '🌀', element: 'Éther', planet: 'Chiron',    message: "Ce qui te blesse est aussi ce qui te guérit. La blessure est le chemin." },
  { id: 13, name: "L'Ancre",            symbol: '⚓', element: 'Terre', planet: 'Saturne',   message: "Enracine-toi. Ta stabilité est une force, non une prison." },
  { id: 14, name: "L'Éclair",           symbol: '🌩️', element: 'Feu',   planet: 'Uranus',    message: "Un changement soudain illumine tout. Ne résiste pas à l'inattendu." },
  { id: 15, name: 'La Rose Noire',      symbol: '🖤', element: 'Eau',   planet: 'Pluton',    message: "La beauté naît de la douleur transformée. Tu es en pleine alchimie." },
  { id: 16, name: 'Le Miroir',          symbol: '🪞', element: 'Éther', planet: 'Lune',      message: "Ce que tu vois chez l'autre est un reflet de toi. Regarde honnêtement." },
  { id: 17, name: "L'Étoile Polaire",   symbol: '⭐', element: 'Air',   planet: 'Jupiter',   message: "Tu as une direction claire. Fais confiance à ta boussole intérieure." },
  { id: 18, name: 'Le Courant',         symbol: '🌊', element: 'Eau',   planet: 'Neptune',   message: "Laisse-toi porter. La résistance épuise, la fluidité libère." },
  { id: 19, name: 'La Forêt',           symbol: '🌲', element: 'Terre', planet: 'Vénus',     message: "Prends le temps de grandir en silence. Tes racines sont plus profondes que tu ne le crois." },
  { id: 20, name: 'Le Faucon',          symbol: '🦅', element: 'Air',   planet: 'Mercure',   message: "Prends de la hauteur. La vue panoramique te donnera toutes les réponses." },
  { id: 21, name: 'Le Cristal',         symbol: '💎', element: 'Terre', planet: 'Vénus',     message: "Ta clarté intérieure attire la clarté extérieure. Sois transparent." },
  { id: 22, name: 'La Flamme Éternelle',symbol: '🕯️', element: 'Feu',   planet: 'Soleil',    message: "Ta lumière ne peut s'éteindre. Elle guide même quand tu ne le vois pas." },
  { id: 23, name: "L'Océan Profond",    symbol: '🌊', element: 'Eau',   planet: 'Neptune',   message: "Tes émotions sont une boussole, non un obstacle. Plonge sans peur." },
  { id: 24, name: 'Le Thunderbird',     symbol: '⚡', element: 'Feu',   planet: 'Mars',      message: "Une énergie puissante te traverse. Canalise-la vers ta mission." },
  { id: 25, name: 'La Chrysalide',      symbol: '🦋', element: 'Air',   planet: 'Pluton',    message: "Tu es en transformation. Ce qui semble une prison est en fait un cocon." },
  { id: 26, name: 'Le Solstice',        symbol: '🌅', element: 'Feu',   planet: 'Soleil',    message: "Un point de bascule est atteint. Après l'obscurité vient l'expansion." },
  { id: 27, name: 'La Clé',             symbol: '🗝️', element: 'Terre', planet: 'Saturne',   message: "Tu possèdes déjà ce qu'il te faut. Cherche en toi, pas dehors." },
  { id: 28, name: 'Le Labyrinthe',      symbol: '🌀', element: 'Éther', planet: 'Mercure',   message: "Il n'y a pas de mauvais chemin, seulement des détours enrichissants." },
  { id: 29, name: "L'Arc-en-Ciel",      symbol: '🌈', element: 'Air',   planet: 'Jupiter',   message: "Après la tempête, la promesse. La joie te revient de plein droit." },
  { id: 30, name: 'Le Volcan',          symbol: '🌋', element: 'Feu',   planet: 'Mars',      message: "Une énergie comprimée cherche à s'exprimer. Libère-la avec intention." },
  { id: 31, name: 'La Perle',           symbol: '🪩', element: 'Eau',   planet: 'Lune',      message: "Ce qui t'a blessé s'est transformé en trésor. Reconnais ta valeur." },
  { id: 32, name: 'Le Guerrier Sage',   symbol: '⚔️', element: 'Feu',   planet: 'Mars',      message: "La force n'est pas dans la violence mais dans la maîtrise de soi." },
  { id: 33, name: 'La Source',          symbol: '💧', element: 'Eau',   planet: 'Lune',      message: "Retourne à l'essentiel. Ta vérité est simple et pure comme l'eau." },
  { id: 34, name: "L'Alliance",         symbol: '🤝', element: 'Éther', planet: 'Vénus',     message: "Une rencontre décisive approche ou est déjà là. Honore ce lien." },
  { id: 35, name: "La Tour d'Ivoire",   symbol: '🏰', element: 'Terre', planet: 'Saturne',   message: "L'isolement protecteur est devenu une prison. Ouvre la porte." },
  { id: 36, name: 'Le Papillon de Nuit',symbol: '🦋', element: 'Éther', planet: 'Neptune',   message: "Tu es attirée par la lumière même dans l'obscurité. Fais confiance à cet élan." },
  { id: 37, name: 'La Comète',          symbol: '☄️', element: 'Feu',   planet: 'Uranus',    message: "Tu traverses les vies comme une étoile filante. Laisse une trace lumineuse." },
  { id: 38, name: 'Le Sanctuaire',      symbol: '⛩️', element: 'Terre', planet: 'Saturne',   message: "Crée un espace sacré en toi. Le calme intérieur est inviolable." },
  { id: 39, name: "L'Horizon",          symbol: '🌄', element: 'Air',   planet: 'Jupiter',   message: "Ce que tu cherches est encore plus grand que ce que tu imagines." },
  { id: 40, name: 'Le Serpent',         symbol: '🐍', element: 'Terre', planet: 'Pluton',    message: "Mue. Abandonne ta vieille peau sans nostalgie. Tu es neuf maintenant." },
  { id: 41, name: 'La Harpe',           symbol: '🎵', element: 'Air',   planet: 'Vénus',     message: "L'harmonie est à portée. Accorde-toi à ce qui te fait vibrer." },
  { id: 42, name: 'Le Phénix',          symbol: '🦅', element: 'Feu',   planet: 'Pluton',    message: "Tu renaîtras de cette épreuve plus puissant que jamais. C'est certain." },
  { id: 43, name: 'La Toile',           symbol: '🕸️', element: 'Éther', planet: 'Mercure',   message: "Tout est connecté. Tes actions ont des répercussions plus larges que tu ne le vois." },
  { id: 44, name: 'Le Géant Endormi',   symbol: '🏔️', element: 'Terre', planet: 'Jupiter',   message: "Un potentiel immense sommeille en toi. Il attend ton signal pour s'éveiller." },
  { id: 45, name: 'La Tempête',         symbol: '🌪️', element: 'Air',   planet: 'Uranus',    message: "La turbulence actuelle nettoie le terrain. Reste ancré au centre de toi." },
  { id: 46, name: 'Le Lotus',           symbol: '🪷', element: 'Eau',   planet: 'Neptune',   message: "Tu fleuris dans les eaux troubles. Ta beauté vient de là où tu viens." },
  { id: 47, name: "L'Observateur",      symbol: '👁️', element: 'Éther', planet: 'Mercure',   message: "Prends du recul. Observe sans juger. La vérité se révèle dans le silence." },
  { id: 48, name: 'La Constellation',   symbol: '✨', element: 'Air',   planet: 'Jupiter',   message: "Tes dons forment un ensemble cohérent. Vois le tableau d'ensemble." },
  { id: 49, name: 'Le Coucher de Soleil',symbol:'🌇', element: 'Feu',   planet: 'Soleil',    message: "Un cycle se termine magnifiquement. Honore ce qui fut avant de passer à autre chose." },
  { id: 50, name: "L'Arbre Monde",      symbol: '🌳', element: 'Terre', planet: 'Saturne',   message: "Tes racines touchent la Terre, tes branches touchent le Ciel. Tu es le lien." },
  { id: 51, name: 'Le Fleuve Sacré',    symbol: '🏞️', element: 'Eau',   planet: 'Neptune',   message: "Suis le courant de ta vie sans lutter. Chaque méandre a son sens." },
  { id: 52, name: "L'Orage d'Or",       symbol: '🌩️', element: 'Feu',   planet: 'Jupiter',   message: "Une abondance inattendue arrive sous une forme surprenante. Sois prêt." },
  { id: 53, name: 'La Lune Rousse',     symbol: '🌕', element: 'Eau',   planet: 'Lune',      message: "Tes émotions sont à leur apogée. Ce que tu ressens est une révélation." },
  { id: 54, name: 'Le Couteau de Lumière',symbol:'⚡',element: 'Air',   planet: 'Mercure',   message: "La vérité coupe net. Une conversation nécessaire doit avoir lieu." },
  { id: 55, name: 'La Grotte',          symbol: '🕳️', element: 'Terre', planet: 'Lune',      message: "Le retrait est nécessaire. Recharge-toi dans ton espace intérieur." },
  { id: 56, name: 'Le Messager',        symbol: '📩', element: 'Air',   planet: 'Mercure',   message: "Un message important arrive. Reste attentif aux signes et synchronicités." },
  { id: 57, name: 'La Couronne',        symbol: '👑', element: 'Feu',   planet: 'Soleil',    message: "Tu mérites ta place au sommet. Assume ton autorité avec grâce." },
  { id: 58, name: "L'Infini",           symbol: '∞',  element: 'Éther', planet: 'Chiron',    message: "Tu es bien plus grand que cette vie. Rappelle-toi qui tu es vraiment." },
]

// ─── MOTEUR ASTROLOGIQUE ───────────────────────────────────────────────────────
function getAstroContext(birthTime) {
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.getDay()
  const moonPhaseRaw = Math.floor((now.getDate() % 30) / 7.5)
  const moonPhases = ['🌑 Nouvelle Lune', '🌒 Premier Quartier', '🌕 Pleine Lune', '🌘 Dernier Quartier']
  const moonPhase = moonPhases[moonPhaseRaw]
  const dayPlanets = ['Soleil', 'Lune', 'Mars', 'Mercure', 'Jupiter', 'Vénus', 'Saturne']
  const planetOfDay = dayPlanets[dayOfWeek]
  const hourEnergies =
    hour < 6 ? 'mystique et intuitive' :
    hour < 12 ? 'dynamique et créatrice' :
    hour < 18 ? 'ancrée et productive' : 'réflexive et profonde'

  let birthContext = null
  if (birthTime) {
    const bh = parseInt(birthTime.split(':')[0], 10)
    const risingSign = ['Bélier','Taureau','Gémeaux','Cancer','Lion','Vierge',
      'Balance','Scorpion','Sagittaire','Capricorne','Verseau','Poissons'][Math.floor(bh / 2) % 12]
    birthContext = { risingSign }
  }
  return { moonPhase, planetOfDay, hourEnergies, birthContext }
}

// ─── TIRAGE QUANTIQUE ─────────────────────────────────────────────────────────
async function quantumRandom(max) {
  try {
    const res = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8', { signal: AbortSignal.timeout(3000) })
    const data = await res.json()
    return data.data[0] % max
  } catch {
    const seed = Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)
    return ((seed % max) + max) % max
  }
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onEnter }) {
  return (
    <div className="splash">
      <div className="splash__bg" aria-hidden="true">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="splash__star" style={{
            left: `${(i * 17 + 7) % 100}%`,
            top: `${(i * 23 + 11) % 100}%`,
            animationDelay: `${(i * 0.13) % 3}s`,
          }}>✦</span>
        ))}
      </div>
      <div className="splash__content">
        <div className="splash__symbol">∞</div>
        <h1 className="splash__title">ChronoSphère</h1>
        <p className="splash__subtitle">Oracle des 58 Arcanes du Temps</p>
        <p className="splash__tagline">Chaque tirage est une porte vers ta vérité</p>
        <button className="btn btn--primary btn--lg" onClick={onEnter}>
          Entrer dans l&apos;Oracle
        </button>
      </div>
    </div>
  )
}

// ─── CARTE ORACLE ─────────────────────────────────────────────────────────────
function OracleCard({ card, revealed, onReveal, isPremium }) {
  return (
    <div className={`oracle-card ${revealed ? 'oracle-card--revealed' : 'oracle-card--hidden'}`}>
      {!revealed ? (
        <button className="oracle-card__back" onClick={onReveal} aria-label="Révéler la carte">
          <span className="oracle-card__back-symbol">∞</span>
          <span className="oracle-card__back-hint">Touche pour révéler</span>
        </button>
      ) : (
        <div className="oracle-card__front">
          <div className="oracle-card__header">
            <span className="oracle-card__symbol">{card.symbol}</span>
            <div className="oracle-card__meta">
              <span className="oracle-card__element">{card.element}</span>
              <span className="oracle-card__planet">✦ {card.planet}</span>
            </div>
          </div>
          <h2 className="oracle-card__name">{card.name}</h2>
          <p className="oracle-card__message">{card.message}</p>
          {!isPremium && (
            <p className="oracle-card__lock">
              🔒 Interprétation approfondie réservée aux membres Premium
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── PANNEAU ASTROLOGIQUE ─────────────────────────────────────────────────────
function AstroPanel({ astro }) {
  return (
    <div className="astro-panel">
      <div className="astro-panel__item">
        <span>🌙</span>
        <span>{astro.moonPhase}</span>
      </div>
      <div className="astro-panel__item">
        <span>⭐</span>
        <span>Planète du jour : <strong>{astro.planetOfDay}</strong></span>
      </div>
      <div className="astro-panel__item">
        <span>🕐</span>
        <span>Énergie {astro.hourEnergies}</span>
      </div>
      {astro.birthContext && (
        <div className="astro-panel__item astro-panel__item--gold">
          <span>👑</span>
          <span>Ascendant probable : <strong>{astro.birthContext.risingSign}</strong></span>
        </div>
      )}
    </div>
  )
}

// ─── ARCHIVE PREMIUM ──────────────────────────────────────────────────────────
function ArchivePanel({ archive, onClear }) {
  if (!archive.length) {
    return (
      <div className="archive archive--empty">
        <p className="archive__empty-text">Aucun tirage archivé pour le moment.</p>
        <p className="archive__empty-hint">Tes prochains tirages apparaîtront ici.</p>
      </div>
    )
  }
  return (
    <div className="archive">
      <div className="archive__header">
        <h3>📚 Historique de tes tirages</h3>
        <button className="btn btn--ghost btn--sm" onClick={onClear}>Tout effacer</button>
      </div>
      <div className="archive__list">
        {archive.slice().reverse().map((entry, i) => (
          <div key={i} className="archive__entry">
            <div className="archive__entry-top">
              <span className="archive__entry-symbol">{entry.card.symbol}</span>
              <span className="archive__entry-name">{entry.card.name}</span>
              <span className="archive__entry-date">
                {new Date(entry.date).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <p className="archive__entry-message">{entry.card.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MODAL PREMIUM ────────────────────────────────────────────────────────────
function PremiumModal({ onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Fermer">✕</button>
        <div className="modal__symbol">👑</div>
        <h2 className="modal__title">Souveraineté Plus</h2>
        <p className="modal__intro">Accède à la puissance complète de l&apos;Oracle</p>
        <ul className="modal__features">
          <li>✦ Tirages illimités avec aléatoire quantique</li>
          <li>✦ Interprétations complètes des 58 Arcanes</li>
          <li>✦ Moteur astrologique avec ton heure de naissance</li>
          <li>✦ Archivage et historique de tous tes tirages</li>
          <li>✦ Contexte planétaire personnalisé en temps réel</li>
        </ul>
        <a
          href={STRIPE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--gold btn--lg"
        >
          Devenir Premium — Accès à vie
        </a>
        <p className="modal__note">Paiement sécurisé · Stripe</p>
      </div>
    </div>
  )
}

// ─── SAISIE HEURE DE NAISSANCE ────────────────────────────────────────────────
function BirthTimeInput({ birthTime, onChange }) {
  return (
    <div className="birth-time">
      <label className="birth-time__label" htmlFor="birthtime">
        🕐 Heure de naissance <span className="birth-time__hint">(calcul de l&apos;ascendant)</span>
      </label>
      <input
        id="birthtime"
        type="time"
        className="birth-time__input"
        value={birthTime}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// ─── APP PRINCIPALE ────────────────────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentCard, setCurrentCard] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [astro, setAstro] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [archive, setArchive] = useState([])
  const [birthTime, setBirthTime] = useState('')
  const [drawCount, setDrawCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('oracle')

  const FREE_LIMIT = 3

  // Chargement depuis localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (saved.isPremium) setIsPremium(true)
      if (saved.birthTime) setBirthTime(saved.birthTime)
      if (saved.drawCount) setDrawCount(saved.drawCount)
      const savedArchive = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]')
      setArchive(savedArchive)
    } catch { /* ignore */ }
  }, [])

  // Sauvegarde dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isPremium, birthTime, drawCount }))
    } catch { /* ignore */ }
  }, [isPremium, birthTime, drawCount])

  // Contexte astrologique mis à jour chaque minute
  useEffect(() => {
    const update = () => setAstro(getAstroContext(birthTime))
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [birthTime])

  const handleBirthTimeChange = useCallback((val) => {
    setBirthTime(val)
  }, [])

  const drawCard = useCallback(async () => {
    if (!isPremium && drawCount >= FREE_LIMIT) {
      setShowPremiumModal(true)
      return
    }
    setIsLoading(true)
    setRevealed(false)
    setCurrentCard(null)
    try {
      const idx = await quantumRandom(CARDS.length)
      setCurrentCard(CARDS[idx])
      setDrawCount(c => c + 1)
    } finally {
      setIsLoading(false)
    }
  }, [isPremium, drawCount])

  const revealCard = useCallback(() => {
    setRevealed(true)
    if (currentCard && isPremium) {
      const entry = { card: currentCard, date: new Date().toISOString() }
      setArchive(prev => {
        const next = [...prev, entry]
        try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
        return next
      })
    }
  }, [currentCard, isPremium])

  const clearArchive = useCallback(() => {
    setArchive([])
    try { localStorage.removeItem(ARCHIVE_KEY) } catch { /* ignore */ }
  }, [])

  const freeSlotsLeft = Math.max(0, FREE_LIMIT - drawCount)

  if (showSplash) return <SplashScreen onEnter={() => setShowSplash(false)} />

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header__brand">
          <span className="header__symbol">∞</span>
          <span className="header__title">ChronoSphère</span>
        </div>
        <div className="header__actions">
          {isPremium ? (
            <span className="badge badge--gold">👑 Premium</span>
          ) : (
            <button className="btn btn--ghost btn--sm" onClick={() => setShowPremiumModal(true)}>
              Passer Premium
            </button>
          )}
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="nav">
        <button
          className={`nav__tab ${activeTab === 'oracle' ? 'nav__tab--active' : ''}`}
          onClick={() => setActiveTab('oracle')}
        >
          🔮 Oracle
        </button>
        {isPremium && (
          <button
            className={`nav__tab ${activeTab === 'archive' ? 'nav__tab--active' : ''}`}
            onClick={() => setActiveTab('archive')}
          >
            📚 Historique
          </button>
        )}
      </nav>

      <main className="main">
        {activeTab === 'oracle' ? (
          <>
            {/* CONTEXTE ASTRO */}
            {astro && <AstroPanel astro={astro} />}

            {/* HEURE DE NAISSANCE (Premium) */}
            {isPremium && (
              <BirthTimeInput birthTime={birthTime} onChange={handleBirthTimeChange} />
            )}

            {/* JAUGE FREEMIUM */}
            {!isPremium && (
              <div className="freemium-bar">
                <span>Tirages gratuits : <strong>{freeSlotsLeft}/{FREE_LIMIT}</strong></span>
                {freeSlotsLeft === 0 && (
                  <button className="btn btn--gold btn--sm" onClick={() => setShowPremiumModal(true)}>
                    Débloquer l&apos;illimité 👑
                  </button>
                )}
              </div>
            )}

            {/* BOUTON TIRAGE */}
            <div className="draw-zone">
              <button
                className={`btn btn--primary btn--xl draw-btn ${isLoading ? 'draw-btn--loading' : ''}`}
                onClick={drawCard}
                disabled={isLoading}
              >
                {isLoading ? '∞ Consultation en cours…' : currentCard ? '✦ Nouveau tirage' : '✦ Consulter l\'Oracle'}
              </button>
              {isPremium && (
                <p className="draw-zone__hint">Aléatoire quantique · chaque tirage est unique</p>
              )}
            </div>

            {/* CARTE */}
            {currentCard && (
              <OracleCard
                card={currentCard}
                revealed={revealed}
                onReveal={revealCard}
                isPremium={isPremium}
              />
            )}

            {/* CTA PREMIUM après révélation */}
            {!isPremium && revealed && currentCard && (
              <div className="cta-premium">
                <p>Prête à aller plus loin avec cette carte ?</p>
                <button className="btn btn--gold" onClick={() => setShowPremiumModal(true)}>
                  Interprétation complète 👑
                </button>
              </div>
            )}
          </>
        ) : (
          <ArchivePanel archive={archive} onClear={clearArchive} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>ChronoSphère 999 · Oracle des Arcanes du Temps</p>
        {!isPremium && (
          <button className="footer__link" onClick={() => setShowPremiumModal(true)}>
            Activer Souveraineté Plus
          </button>
        )}
      </footer>

      {/* MODAL PREMIUM */}
      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  )
}
