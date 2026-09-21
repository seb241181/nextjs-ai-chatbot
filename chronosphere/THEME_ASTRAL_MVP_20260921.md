# CHRONOSPHÈRE — THÈME ASTRAL PAYANT
## Fondation MVP · 21 septembre 2026

## Objectif produit

Créer dans ChronoSphère un produit distinct de l’Oracle : un thème astral personnel calculé à partir de la date, de l’heure exacte et du lieu de naissance.

Parcours cible :

1. L’utilisateur saisit sa date, son heure et son lieu de naissance.
2. ChronoSphère résout le lieu en latitude, longitude et fuseau horaire.
3. Le moteur calcule le ciel natal réel.
4. Une couche d’interprétation structurée transforme les données astronomiques en lecture astrologique.
5. Le client reçoit un rapport premium et, dans une phase ultérieure, peut converser avec ChronoSphère à propos de son propre thème.

Le prix n’est pas figé à ce stade. Il sera déterminé après validation du contenu, de la profondeur et du parcours commercial.

## État technique constaté

Le projet ChronoSphère actuel est une SPA React/Vite située dans le sous-dossier `chronosphere/` du repo `seb241181/nextjs-ai-chatbot`.

La version actuelle :
- fonctionne principalement côté navigateur ;
- utilise `localStorage` ;
- possède un lien Stripe simple mais aucune vérification serveur ;
- ne possède pas de backend métier ;
- n’a pas de calcul astrologique précis ;
- calcule actuellement l’ascendant de manière approximative à partir de l’heure seule ;
- calcule la phase lunaire de manière calendaire approximative.

Ces approximations ne doivent PAS être utilisées pour un thème astral vendu.

## Décision de sécurité

Le produit « Thème astral » ne devra pas s’appuyer sur le mécanisme Premium actuel basé uniquement sur `localStorage`.

Pour un produit payant :
- paiement vérifié côté serveur ;
- webhook de paiement ;
- entitlement/commande enregistré côté serveur ;
- génération du rapport après preuve de paiement ;
- aucune clé IA ou secret de paiement dans le navigateur.

## Moteur astrologique

### Option privilégiée pour le prototype

Étudier une intégration JavaScript MIT permettant :
- positions planétaires ;
- Ascendant / MC ;
- maisons ;
- aspects ;
- gestion correcte du fuseau historique ;
- fonctionnement compatible Vite/React ou backend Node.

Le paquet `free-human-design` est un candidat de prototype intéressant car il est MIT, JavaScript pur, gère les fuseaux IANA, les coordonnées et les maisons Placidus / Whole Sign / Equal, et expose des calculs astrologiques en plus de ses fonctions Human Design.

Avant intégration définitive, ses résultats devront être vérifiés sur plusieurs thèmes de référence.

### Swiss Ephemeris

Swiss Ephemeris reste une référence de très haute précision, mais son utilisation dans un service commercial fermé impose soit les obligations AGPL, soit l’achat d’une licence professionnelle.

Ne pas intégrer Swiss Ephemeris dans la version commerciale sans décision explicite sur la licence.

## Lieu de naissance et géocodage

Le lieu saisi doit produire :
- nom normalisé ;
- latitude ;
- longitude ;
- fuseau horaire IANA.

La solution de géocodage doit être compatible avec un usage commercial.

Le service gratuit Open-Meteo ne doit pas être utilisé tel quel en production commerciale ; son offre gratuite est non commerciale. Une solution commerciale ou auto-hébergée devra être retenue avant lancement.

Pour le prototype, on peut utiliser des coordonnées/fuseau saisis ou des fixtures de test sans dépendre d’un service commercial externe.

## Données minimales du thème natal

Entrée :
- prénom ou nom d’affichage facultatif ;
- date de naissance ;
- heure de naissance ;
- lieu ;
- latitude ;
- longitude ;
- fuseau IANA ;
- système de maisons choisi.

Sortie structurée :
- Soleil ;
- Lune ;
- Ascendant ;
- Milieu du Ciel ;
- Mercure ;
- Vénus ;
- Mars ;
- Jupiter ;
- Saturne ;
- Uranus ;
- Neptune ;
- Pluton ;
- maisons 1 à 12 ;
- signe et degré de chaque planète ;
- maison de chaque planète ;
- aspects majeurs ;
- éléments dominants ;
- modalités dominantes ;
- synthèse structurée.

## Interprétation IA

L’IA ne calcule jamais les positions astrologiques.

Ordre obligatoire :
1. calcul déterministe du thème ;
2. validation des données ;
3. envoi des données structurées au modèle ;
4. génération de l’interprétation.

Le prompt d’interprétation devra distinguer :
- données calculées ;
- interprétation astrologique ;
- synthèse ;
- nuances et contradictions du thème.

Le modèle ne doit jamais inventer une planète, une maison, un aspect ou une position absente du JSON calculé.

## Rapport premium

Le premier rapport peut comporter :
- couverture ChronoSphère ;
- identité de naissance ;
- carte du ciel ;
- « Big 3 » : Soleil / Lune / Ascendant ;
- planètes personnelles ;
- planètes sociales et transpersonnelles ;
- maisons ;
- aspects dominants ;
- forces et tensions ;
- relations ;
- orientation professionnelle ;
- synthèse finale.

La longueur exacte sera décidée après un premier prototype. Ne pas fixer artificiellement un nombre de pages avant d’avoir le contenu réel.

## Conversation après achat — phase 2

Extension future : « Parler avec mon thème ».

Le thème calculé est conservé comme structure de données canonique. L’agent ChronoSphère peut ensuite répondre à des questions en utilisant uniquement ce thème comme base astrologique.

Cette conversation ne doit pas recalculer ni modifier silencieusement le thème natal.

## Phases de développement

### Phase A — Fondation technique
- créer une branche dédiée ;
- isoler le moteur natal dans un module ;
- créer les structures de données ;
- créer des fixtures de naissance ;
- vérifier calculs Soleil/Lune/Ascendant/maisons/aspects ;
- aucun paiement réel.

### Phase B — Interface
- nouvel espace « Thème astral » ;
- formulaire date / heure / lieu ;
- écran récapitulatif avant calcul ;
- affichage du thème calculé ;
- design cohérent avec ChronoSphère.

### Phase C — Produit payant
- backend sécurisé ;
- paiement + webhook ;
- stockage commande/thème ;
- génération IA ;
- PDF premium ;
- e-mail de livraison.

### Phase D — Extensions
- révolution solaire ;
- transits ;
- synastrie ;
- thème enfant ;
- agent conversationnel basé sur le thème.

## Protection Production

Le chantier doit rester sur une branche dédiée et en Preview jusqu’à validation explicite de Sébastien.

Aucune modification Production, aucun paiement réel et aucune migration destructive sans GO explicite.

## Point technique Vercel identifié

Le projet Vercel `chronosphere` existe bien.

Le dernier déploiement Git de la branche de transmission a échoué car Vercel lance `pnpm run build` depuis la racine du repo parent au lieu de construire explicitement le sous-dossier `chronosphere/`.

Avant d’utiliser les Previews Git pour ce nouveau chantier, il faudra corriger la configuration Root Directory du projet Vercel ChronoSphère vers `chronosphere`, sans modifier la configuration du projet parent `nextjs-ai-chatbot`.

## Branche du nouveau chantier

`feat/chronosphere-theme-astral-20260921`

Base :
`b898aa77bb26a9defd64e2a508e7a1a496f628a4`

Objectif immédiat :
construire un prototype fiable du calcul natal avant toute couche commerciale.
