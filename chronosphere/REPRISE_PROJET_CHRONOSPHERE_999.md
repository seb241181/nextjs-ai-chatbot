# REPRISE PROJET — CHRONOSPHÈRE 999
## Document de transmission technique · Mars 2026

---

## 1. ARCHITECTURE GÉNÉRALE

**ChronoSphère 999** est une Single Page Application (SPA) React/Vite, entièrement côté client (aucun backend). Elle tourne dans le navigateur et persiste ses données via `localStorage`.

```
[Navigateur]
  └── React SPA (Vite)
        ├── Logique Oracle (tirage, cartes, astro)
        ├── localStorage (état utilisateur, archive)
        └── Stripe (lien externe, pas d'intégration webhook)
```

**Technologies :**
| Technologie | Version | Rôle |
|---|---|---|
| React | ^19.2.4 | Framework UI |
| Vite | ^8.0.1 | Bundler / Dev server |
| CSS custom (BEM) | — | Styles, pas de Tailwind |
| QRNG ANU API | externe | Aléatoire quantique (avec fallback) |
| Stripe Payment Link | externe | Paiement (lien simple, pas de SDK) |

**Pas de** : TypeScript, base de données, backend, authentification serveur, tests automatisés, Next.js.

---

## 2. ARBORESCENCE DES FICHIERS

```
chronosphere/
├── index.html              ← Point d'entrée HTML (lang="en" à changer en "fr")
├── package.json            ← Dépendances npm
├── vite.config.js          ← Config Vite (minimal, juste le plugin React)
├── src/
│   ├── main.jsx            ← Montage React dans #root
│   ├── App.jsx             ← TOUT le code applicatif (composants + logique)
│   ├── App.css             ← TOUS les styles (BEM, dark theme, responsive)
│   ├── index.css           ← Reset global basique
│   └── assets/
│       ├── react.svg       ← Inutilisé (vestige du template Vite)
│       └── vite.svg        ← Inutilisé (vestige du template Vite)
└── REPRISE_PROJET_CHRONOSPHERE_999.md  ← Ce fichier
```

**Fichier central : `src/App.jsx`** — contient la totalité de la logique, des données et des composants. Un seul fichier de ~475 lignes.

---

## 3. COMPOSANTS ET FONCTIONNALITÉS

### Composants React (tous dans `App.jsx`)

| Composant | Rôle |
|---|---|
| `SplashScreen` | Écran d'accueil animé (50 étoiles procédurales, ∞ pulsant, bouton entrée) |
| `OracleCard` | Affiche la carte (dos cliquable → face révélée avec nom, symbole, message) |
| `AstroPanel` | Bandeau contextuel : phase lunaire, planète du jour, énergie horaire, ascendant |
| `ArchivePanel` | Historique des tirages (Premium uniquement), avec bouton "Tout effacer" |
| `PremiumModal` | Modal de conversion freemium → premium avec lien Stripe |
| `BirthTimeInput` | Champ `<input type="time">` pour l'heure de naissance (Premium) |
| `App` | Composant racine : orchestration état, navigation, localStorage |

### Fonctionnalités terminées

- ✅ Splash screen animé
- ✅ Tirage d'une carte parmi 58 (aléatoire quantique + fallback)
- ✅ Révélation de carte en deux temps (dos → face)
- ✅ Affichage du contexte astrologique en temps réel (mis à jour chaque minute)
- ✅ Mode freemium : 3 tirages gratuits, blocage + modal passé la limite
- ✅ Modal "Souveraineté Plus" avec lien Stripe
- ✅ Persistance localStorage (statut premium, compteur de tirages, heure de naissance)
- ✅ Archivage des tirages (Premium) avec date et message
- ✅ Calcul d'ascendant simplifié via heure de naissance (Premium)
- ✅ Navigation onglets Oracle / Historique
- ✅ Design dark mystique responsive (mobile-first, max-width 640px)

### Fonctionnalités incomplètes ou provisoires

- ⚠️ **Vérification du paiement** : `isPremium` est stocké en `localStorage` sans aucune vérification côté serveur. N'importe qui peut passer Premium en tapant `localStorage.setItem('chronosphere_state', JSON.stringify({isPremium: true}))` dans la console. Il n'y a **aucun webhook Stripe** configuré.
- ⚠️ **58 cartes** : les textes (noms, messages) sont des placeholders génériques provisoires. Ils devront être remplacés par les vrais textes de l'Oracle ChronoSphère 999.
- ⚠️ **Structure des cartes** : chaque carte n'a qu'un seul champ `message` (une phrase). Les champs `titre`, `densités`, `décrets`, `actes de libération`, `blocs`, `interprétation complète`, `numéro`, `catégorie`, `fréquence` sont **absents** du modèle actuel.
- ⚠️ **Images** : aucune image de carte n'est intégrée. Le champ `image` n'existe pas dans le modèle.
- ⚠️ **Calcul d'ascendant** : approximation grossière (1 signe toutes les 2 heures). Non conforme à l'astrologie réelle.
- ⚠️ **Phase lunaire** : calculée par `jour_du_mois % 30 / 7.5` — approximation calendaire, pas astronomique.
- ⚠️ **Activation Premium** : l'état `isPremium` n'est jamais mis à `true` automatiquement après paiement. Il faudrait un webhook Stripe → backend → localStorage ou un système de code d'accès.
- ⚠️ **`index.html`** : `lang="en"` au lieu de `lang="fr"`, et `<title>chronosphere</title>` sans majuscules ni branding.
- ⚠️ **Assets inutilisés** : `react.svg` et `vite.svg` dans `assets/` (vestiges du template).

---

## 4. STRUCTURE DES DONNÉES DES 58 CARTES

### Modèle actuel (provisoire)

```js
{
  id:      Number,   // 1 à 58
  name:    String,   // Nom de la carte (ex: "L'Éveil")
  symbol:  String,   // Emoji (ex: '☀️')
  element: String,   // 'Feu' | 'Eau' | 'Air' | 'Terre' | 'Éther'
  planet:  String,   // Planète associée (ex: 'Soleil', 'Lune', 'Chiron'…)
  message: String,   // Message court (1 à 2 phrases)
}
```

### Modèle cible recommandé (à implémenter)

```js
{
  id:                  Number,
  numero:              String,   // Numéro selon la structure 999
  name:                String,
  symbol:              String,   // Emoji ou chemin vers image
  image:               String,   // URL ou import d'image
  element:             String,
  planet:              String,
  categorie:           String,   // Ex: "Arcane Majeur", "Ligne de Temps", etc.
  frequence:           Number,   // Ex: 13, 999…
  permutation:         Number,   // 1 à 12
  etape:               Number,   // 1 à 24
  message:             String,   // Message court (freemium)
  interpretation:      String,   // Interprétation complète (premium)
  decret:              String,   // Décret ou affirmation
  acte_liberation:     String,   // Acte de libération associé
  bloc:                String,   // Bloc à libérer
  densite:             String,   // Densité énergétique
}
```

### Répartition actuelle des planètes (58 cartes)

| Planète | Nb de cartes |
|---|---|
| Mercure | 6 |
| Lune | 6 |
| Saturne | 6 |
| Jupiter | 5 |
| Neptune | 5 |
| Pluton | 4 |
| Mars | 4 |
| Soleil | 5 |
| Vénus | 4 |
| Uranus | 4 |
| Chiron | 2 |
| Nœud Nord | 1 |

### Répartition des éléments

| Élément | Nb |
|---|---|
| Feu | 13 |
| Eau | 12 |
| Air | 12 |
| Terre | 13 |
| Éther | 8 |

---

## 5. STOCKAGE DES DONNÉES DE CONTENU

### État actuel — tout dans `App.jsx`

Le tableau `CARDS` (ligne 10 à 69 de `App.jsx`) contient les 58 cartes hardcodées directement dans le composant. **Il n'y a pas de fichier séparé, pas de JSON, pas de base de données.**

### Où modifier le contenu

| Contenu | Fichier | Ligne |
|---|---|---|
| Noms, symboles, messages des cartes | `src/App.jsx` | 10–69 |
| Lien Stripe | `src/App.jsx` | 5 |
| Nombre de tirages gratuits | `src/App.jsx` | 289 (`FREE_LIMIT = 3`) |
| Textes de la modal Premium | `src/App.jsx` | 236–251 |
| Textes du splash screen | `src/App.jsx` | 122–129 |
| Couleurs et variables visuelles | `src/App.css` | 4–19 |
| Titre de l'onglet navigateur | `index.html` | 7 |

### Recommandation pour l'harmonisation

Extraire les cartes dans un fichier séparé :
```
src/
  data/
    cards.js     ← tableau CARDS exporté
    astro.js     ← constantes astrologiques
```

---

## 6. LOGIQUE HEURE DE NAISSANCE ET ALIGNEMENT PLANÉTAIRE

### Heure de naissance → Ascendant

**Fichier :** `src/App.jsx`, fonction `getAstroContext()`, lignes 87–92.

```js
const bh = parseInt(birthTime.split(':')[0], 10)  // heure (0–23)
const risingSign = [
  'Bélier','Taureau','Gémeaux','Cancer','Lion','Vierge',
  'Balance','Scorpion','Sagittaire','Capricorne','Verseau','Poissons'
][Math.floor(bh / 2) % 12]
```

**Logique :** 1 signe toutes les 2 heures → 12 signes × 2h = 24h. Simple mais approximatif.

**Limites :** en astrologie réelle, l'ascendant dépend de la latitude, longitude et date de naissance, pas seulement de l'heure.

### Planète du jour

```js
const dayPlanets = ['Soleil', 'Lune', 'Mars', 'Mercure', 'Jupiter', 'Vénus', 'Saturne']
const planetOfDay = dayPlanets[dayOfWeek]  // dayOfWeek = 0 (Dim) à 6 (Sam)
```

Correspondance chaldéenne classique : Dimanche=Soleil, Lundi=Lune, Mardi=Mars, Mercredi=Mercure, Jeudi=Jupiter, Vendredi=Vénus, Samedi=Saturne.

### Phase lunaire

```js
const moonPhaseRaw = Math.floor((now.getDate() % 30) / 7.5)
const moonPhases = ['🌑 Nouvelle Lune', '🌒 Premier Quartier', '🌕 Pleine Lune', '🌘 Dernier Quartier']
```

Approximation basée uniquement sur le jour du mois (1–30). Pas de calcul astronomique réel.

### Énergie horaire

| Heure | Énergie |
|---|---|
| 0h–5h59 | mystique et intuitive |
| 6h–11h59 | dynamique et créatrice |
| 12h–17h59 | ancrée et productive |
| 18h–23h59 | réflexive et profonde |

---

## 7. CALCULS ASTRONOMIQUES — ÉTAT ET RECOMMANDATIONS

### État actuel : aucune bibliothèque astronomique

Tout est calculé par des formules calendaires simples, sans bibliothèque externe.

### Pour aller plus loin (recommandations)

| Besoin | Bibliothèque recommandée |
|---|---|
| Phase lunaire précise | `astronomia` (npm) ou `suncalc` |
| Position des planètes | `astronomy-engine` (NASA) |
| Ascendant réel (avec lieu) | `astrologico` ou appel à une API comme AstroSeek |
| Éphémérides complètes | `swiss-ephemeris` (JS port) |

Pour une app Oracle, les approximations actuelles sont **acceptables** si l'objectif est symbolique et non astrologique précis. À clarifier avec le porteur du projet.

---

## 8. INFLUENCE DU CONTEXTE PLANÉTAIRE SUR LES CARTES

### État actuel : aucune influence

Le contexte astrologique (planète du jour, phase lunaire, ascendant) est **affiché** dans le panneau `AstroPanel`, mais **n'influence pas** le tirage. La sélection de carte est purement aléatoire (quantique ou pseudo-aléatoire).

### Ce qui est prévu mais non implémenté

- Filtrer ou pondérer les cartes selon la planète du jour (ex : favoriser les cartes "Mercure" un mercredi)
- Adapter le message selon la phase lunaire (pleine lune → message d'expansion vs nouvelle lune → message d'intention)
- Personnaliser l'interprétation selon l'ascendant calculé

---

## 9. RÈGLES 12 PERMUTATIONS / 24 ÉTAPES / FRÉQUENCE 13 / STRUCTURE 999

### État actuel : NON IMPLÉMENTÉ

Ces concepts sont mentionnés dans la vision du projet mais **absents du code**. Aucune règle, aucun calcul, aucun champ de donnée ne s'y réfère.

### Ce qu'il faudra implémenter

| Concept | Description attendue | À créer dans |
|---|---|---|
| 12 permutations | Probablement 12 variantes ou cycles de lecture | `src/data/cards.js` (champ `permutation`) + logique dans `App.jsx` |
| 24 étapes | Étapes d'un parcours ou d'un cycle | Champ `etape` dans le modèle carte + logique de progression |
| Fréquence 13 | Valeur vibratoire ou filtre de sélection | Champ `frequence` + logique de tirage |
| Structure 999 | Architecture globale du système Oracle | À définir avec le porteur du projet avant implémentation |

**Action requise :** obtenir du porteur du projet la documentation exacte de ces règles avant de coder quoi que ce soit.

---

## 10. ÉTAT DES FONCTIONNALITÉS

| Fonctionnalité | État |
|---|---|
| Splash screen animé | ✅ Terminé |
| 58 cartes avec tirage | ✅ Terminé (textes provisoires) |
| Révélation en deux temps | ✅ Terminé |
| Panneau astrologique | ✅ Terminé (approximatif) |
| Mode freemium (3 tirages) | ✅ Terminé |
| Modal Souveraineté Plus | ✅ Terminé |
| Lien Stripe | ✅ Terminé (lien simple) |
| localStorage état/archive | ✅ Terminé |
| Heure de naissance + ascendant | ✅ Terminé (approximatif) |
| Design responsive mobile | ✅ Terminé |
| Vérification paiement Stripe | ❌ Non implémenté |
| Images des cartes | ❌ Non implémenté |
| Interprétations complètes | ❌ Non implémenté |
| Décrets / actes de libération | ❌ Non implémenté |
| 12 permutations | ❌ Non implémenté |
| 24 étapes | ❌ Non implémenté |
| Fréquence 13 / Structure 999 | ❌ Non implémenté |
| Influence astro sur tirage | ❌ Non implémenté |
| Astronomie réelle (bibliothèque) | ❌ Non implémenté |
| Tests automatisés | ❌ Inexistants |

---

## 11. BUGS CONNUS ET POINTS À VÉRIFIER

### Bugs fonctionnels

1. **Sécurité Premium bypass** : `isPremium` lisible et modifiable en console par n'importe quel utilisateur. Risque fort si l'offre Premium a une valeur commerciale réelle.

2. **Compteur de tirages non réinitialisable** : `drawCount` s'accumule en localStorage et ne se remet jamais à zéro. Un utilisateur qui vide son localStorage repart à 0 (contournable).

3. **Fallback QRNG non vraiment aléatoire** : `Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)` reste du pseudo-aléatoire standard. Le XOR avec `Date.now()` n'améliore pas l'entropie de manière significative.

4. **Doublons de symboles** : plusieurs cartes partagent le même emoji (ex: 🌊 utilisé pour cartes 9, 18, 23 / 🦅 pour cartes 20 et 42 / ⚡ pour cartes 3, 24, 54 / 🌀 pour cartes 8, 12, 28 / 🦋 pour cartes 25 et 36). À harmoniser.

5. **Phase lunaire incorrecte** : le calcul actuel peut donner "Pleine Lune" le 15 de chaque mois calendaire, indépendamment de la vraie position de la Lune.

6. **`index.html` lang="en"** : la langue déclarée est l'anglais alors que l'app est en français. Impacte l'accessibilité et le SEO.

7. **Titre navigateur** : `<title>chronosphere</title>` — ni majuscules ni branding "999".

### Points à vérifier

- La QRNG API (qrng.anu.edu.au) a un timeout de 3s mais peut être bloquée par certains bloqueurs de contenu ou pare-feux d'entreprise.
- Le lien Stripe `https://buy.stripe.com/bJe00k2aB9lo9jQdGBc7u00` — vérifier qu'il est actif et pointe vers la bonne offre.
- Aucune gestion de l'erreur réseau complète (ex: si fetch QRNG échoue silencieusement mais que le fallback retourne toujours la même carte).

---

## 12. VARIABLES D'ENVIRONNEMENT, SERVICES ET DÉPLOIEMENT

### Variables d'environnement

**Aucune.** Tout est hardcodé dans `App.jsx` :
- `STRIPE_LINK` (ligne 5) — lien de paiement Stripe
- `STORAGE_KEY` (ligne 6) — clé localStorage état
- `ARCHIVE_KEY` (ligne 7) — clé localStorage archive

### Services externes

| Service | URL | Type d'intégration |
|---|---|---|
| QRNG ANU | `https://qrng.anu.edu.au/API/jsonI.php` | Fetch GET (gratuit, sans clé) |
| Stripe | `https://buy.stripe.com/bJe00k2aB9lo9jQdGBc7u00` | Lien externe simple |

### Procédure de build

```bash
cd ~/chronosphere        # ou ~/nextjs-ai-chatbot/chronosphere
npm install
npm run build            # Génère dist/
```

Build Vite → `dist/` (HTML + JS + CSS bundlés, ~210 KB JS, ~11 KB CSS gzippés).

### Procédure de déploiement

**Option A — Vercel (recommandé) :**
```bash
npx vercel --prod
# Root directory : chronosphere/
# Framework : Vite (détecté automatiquement)
# Build command : npm run build
# Output directory : dist
```

**Option B — Netlify :**
- Build command : `npm run build`
- Publish directory : `dist`

**Option C — GitHub Pages :**
Ajouter `base: '/nom-du-repo/'` dans `vite.config.js`, puis `npm run build` et pousser `dist/`.

### Emplacement des fichiers dans le repo git

Le projet ChronoSphère est dans le sous-dossier `chronosphere/` du repo GitHub :
```
github.com/seb241181/nextjs-ai-chatbot
  └── chronosphere/          ← Projet ChronoSphère 999
        ├── src/App.jsx
        ├── src/App.css
        └── ...
```

Branche de développement actuelle : `claude/setup-chronosphere-project-UEMAt`

---

## 13. DÉCISIONS TECHNIQUES PRISES

| Décision | Raison |
|---|---|
| Tout dans un seul `App.jsx` | Rapidité de mise en place, projet mono-page simple |
| CSS BEM custom (pas Tailwind) | Contrôle total du design mystique, pas de surcharge de classes |
| Pas de TypeScript | Simplicité, pas de build step supplémentaire |
| localStorage (pas de backend) | Aucun compte utilisateur, déploiement statique simple |
| Vite + React (pas Next.js) | Application purement client, pas de SSR nécessaire |
| Lien Stripe simple (pas SDK) | Évite un backend, mais empêche la vérification de paiement |
| QRNG avec fallback synchrone | Robustesse si l'API externe est indisponible |
| `experimental.ppr` désactivé | Causait un crash de build dans Next.js canary (non pertinent ici, fix dans le repo parent) |

---

## 14. RECOMMANDATIONS AVANT DE POURSUIVRE

### Priorité 1 — Indispensable avant tout ajout

1. **Obtenir les vrais textes des 58 cartes** : noms définitifs, messages, interprétations, décrets, actes de libération, densités, blocs. Sans ça, tout développement sur les cartes est provisoire.

2. **Documenter la structure 999** : qu'est-ce que les 12 permutations, les 24 étapes, la fréquence 13 ? Fournir un cahier des charges avant implémentation.

3. **Décider du modèle de sécurité Premium** : lien Stripe simple (actuel) ou webhook + vérification serveur ? Si le Premium a un prix, le bypass localStorage est un problème réel.

### Priorité 2 — Qualité et complétude

4. **Extraire `CARDS` dans `src/data/cards.js`** : facilite les mises à jour de contenu sans toucher à la logique applicative.

5. **Ajouter les champs manquants** : `image`, `interpretation`, `decret`, `acte_liberation`, `bloc`, `densite`, `numero`, `permutation`, `etape`, `frequence`.

6. **Corriger `index.html`** : `lang="fr"`, titre correct, favicon ChronoSphère.

7. **Implémenter la phase lunaire réelle** : intégrer `suncalc` (2 KB) pour un calcul précis.

8. **Lier le contexte astro au tirage** : pondération des cartes selon planète du jour, phase lunaire, ascendant.

### Priorité 3 — Robustesse

9. **Sécuriser le Premium** : minimum, utiliser un code d'accès chiffré (HMAC) envoyé par Stripe webhook, vérifié côté client avec une clé publique.

10. **Corriger les doublons d'emojis** sur les 58 cartes.

11. **Ajouter les images des cartes** : prévoir un dossier `public/cards/` avec 58 images (format recommandé : WebP 400×600px).

---

## FICHIERS À MODIFIER selon les harmonisations futures

| Type de changement | Fichiers concernés |
|---|---|
| Noms / textes / messages des cartes | `src/App.jsx` (tableau `CARDS`) → futur `src/data/cards.js` |
| Numéros / catégories / fréquences | `src/App.jsx` (tableau `CARDS`) → futur `src/data/cards.js` |
| Règles des 12 permutations | `src/App.jsx` (fonction `drawCard` + modèle CARDS) |
| Règles des 24 étapes | `src/App.jsx` (nouveau state + logique) |
| Influence planétaire sur tirage | `src/App.jsx` (fonction `drawCard`) |
| Images des cartes | `public/cards/*.webp` + `src/App.jsx` (champ `image` dans CARDS) |
| Interprétations complètes (Premium) | `src/App.jsx` (composant `OracleCard`, champ `interpretation`) |
| Décrets / actes de libération | `src/App.jsx` (composant `OracleCard`, nouveaux champs) |
| Phase lunaire (astronomie réelle) | `src/App.jsx` (fonction `getAstroContext`) |
| Ascendant (calcul réel) | `src/App.jsx` (fonction `getAstroContext`) |
| Lien Stripe | `src/App.jsx` (constante `STRIPE_LINK` ligne 5) |
| Limite tirages gratuits | `src/App.jsx` (constante `FREE_LIMIT` ligne 289) |
| Titre de l'onglet navigateur | `index.html` (balise `<title>`) |
| Langue déclarée | `index.html` (attribut `lang`) |
| Couleurs / thème visuel | `src/App.css` (variables CSS `:root` lignes 4–19) |

---

*Document généré le 24 mars 2026 · Session Claude Code · Branche `claude/setup-chronosphere-project-UEMAt`*
