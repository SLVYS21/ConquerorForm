# ConquerorForm

Formulaire de lead capture style **Typebot** pour la formation EcomConqueror.
Réponses persistées dans **Google Sheets** (pas de DB). Admin sur `/form-admin` avec dashboard des sessions **+ éditeur de thème** (couleurs / radius / typo / presets). Meta Pixel intégré pour retargeting FB/IG Ads. Déployé sur Vercel.

## Setup

### 1. Google Sheet + service account

1. Créer un nouveau spreadsheet Google (garde l'ID de l'URL : `docs.google.com/spreadsheets/d/<ID>/edit`).
2. Aller sur [Google Cloud Console](https://console.cloud.google.com/) → nouveau projet → activer **Google Sheets API**.
3. IAM & Admin → Service Accounts → créer un service account (rôle : aucun n'est nécessaire côté GCP, l'accès est donné directement au Sheet).
4. Sur ce service account → Keys → Add key → JSON. Télécharge le fichier.
5. Ouvre le Sheet → Partager → colle l'email du service account (`...@...iam.gserviceaccount.com`) en rôle **Éditeur**.
6. Les onglets `responses` et `theme` sont créés automatiquement au premier appel.

### 2. Variables d'environnement

Copie `.env.example` vers `.env.local` et remplis :

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=  # depuis le JSON du service account
GOOGLE_PRIVATE_KEY="..."       # depuis le JSON, garde les \n littéraux
GOOGLE_SHEET_ID=               # ID de l'URL du Sheet
NEXT_PUBLIC_META_PIXEL_ID=     # ID du Pixel Meta
ADMIN_PASSWORD=                # mot de passe admin (16+ chars)
ADMIN_COOKIE_SECRET=           # random 32+ chars pour signer le cookie
```

### 3. Lancer en local

```bash
npm install
npm run dev
```

- Form public : http://localhost:3000/
- Admin : http://localhost:3000/form-admin/login

## Structure

- `app/page.tsx` — le form (server component qui lit le thème)
- `app/form-admin/(dashboard)/` — pages admin protégées par le middleware
- `app/api/responses/route.ts` — POST des réponses (partielles ou finales)
- `app/api/admin/theme/route.ts` — GET/PUT du thème
- `lib/sheets.ts` — client googleapis
- `lib/theme.ts` — read/write thème (avec `unstable_cache` + `revalidateTag`)
- `lib/responses.ts` — upsert des sessions dans l'onglet `responses`
- `config/form.ts` — questions (à personnaliser)
- `config/presets.ts` — 7 presets de thème
- `middleware.ts` — protège `/form-admin/*` (redirect vers `/form-admin/login`)

## Personnalisation des questions

Édite `config/form.ts` — chaque question a un `id` (= nom de colonne dans le Sheet), un `type` (`text`, `email`, `phone`, `choice`, `number`, `textarea`), un `label`, et éventuellement `choices` / `hint` / `placeholder`.

⚠️ Ajouter/renommer une question **change les colonnes** du Sheet. Pour un Sheet déjà en prod : ajoute plutôt en fin de liste (les colonnes existantes gardent leur position).

## Déploiement Vercel

1. `git push` vers ton repo (GitHub / GitLab / Bitbucket).
2. Import dans Vercel → détecte Next.js automatiquement.
3. Colle toutes les variables d'environnement dans **Settings → Environment Variables**.
4. Deploy. L'admin est accessible sur `https://<ton-domaine>/form-admin/login`.

## Meta Pixel — événements émis

- `PageView` — auto au chargement.
- `FormStart` (custom) — au premier affichage du form.
- `FormStep` (custom, params `{ step, step_id }`) — à chaque étape complétée.
- `Lead` (params `{ content_name, value, currency }`) — à la soumission finale.

Vérifier avec [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc).

## Notes techniques

- **Persistance thème** : le thème est stocké dans la cellule `A1` de l'onglet `theme` du Sheet (JSON stringifié). Chaque save invalide le cache Next (`revalidateTag('theme')`), le form public reflète la nouvelle valeur au prochain render.
- **Persistance sessions** : une ligne par session, patchée à chaque étape. Les sessions abandonnées sont visibles avec `completed_at` vide.
- **`sendBeacon` on unload** : capte les abandons in-flight au reload/close.
- **Cache row lookup** : le mapping `session_id → rowIndex` est mémorisé en mémoire process (perdu au cold start Vercel, reconstruit au premier update d'une session existante).
