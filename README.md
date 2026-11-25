# Flora Wigs — perruques et coiffure, rue Jaffa, Jérusalem

Site en hébreu (langue principale), français et anglais, pensé d'abord pour le téléphone.

- **Perruques** : catalogue avec filtres (longueur, texture, couleur). La cliente réserve une perruque et paie sur place.
- **Rendez-vous** : la cliente choisit une prestation, un jour et une heure libres. La demande reste « en attente » jusqu'à ce que la coiffeuse la valide.
- **Carte cadeau** : demande en ligne, paiement sur place.
- **Admin** (`/admin`) : valider ou refuser les demandes, envoyer la réponse à la cliente sur WhatsApp en un clic (dans sa langue), gérer le catalogue et les photos, changer les horaires et les jours fermés.

Aucun paiement en ligne.

## Lancer le site sur son ordinateur

Il faut Node.js 22.13 ou plus récent.

```bash
npm install
npm run seed     # ajoute 6 perruques d'exemple (à supprimer ensuite depuis l'admin)
npm run dev
```

- Site : http://localhost:3000 (s'ouvre en hébreu)
- Admin : http://localhost:3000/admin — en local, le mot de passe est `admin`

## À compléter avant la mise en ligne

Tout est dans `src/lib/config.ts`, aux lignes marquées **À COMPLÉTER** :

- le prénom de la coiffeuse
- son Instagram
- les prix « à partir de » de chaque prestation (ceux du fichier sont des exemples)

Les textes des trois langues sont dans `src/lib/i18n.ts`.

### Photos

- `public/photos/hero.jpg` : la grande photo du haut de page (verticale, avec une zone calme pour le texte)
- `public/photos/portrait.jpg` : la photo de la section « À propos » (facultative)

Tant qu'une photo manque, le site affiche une illustration à la place. Les photos des perruques s'ajoutent depuis l'admin.

## Mise en ligne

Le site garde ses données (demandes, perruques, photos envoyées) dans un dossier sur le serveur (`DATA_DIR`, par défaut `./data`). Il lui faut donc un hébergement Node.js **avec un disque qui persiste** : un petit VPS, Railway, Render ou Fly.io avec un volume. Pas Vercel ni Netlify, qui effacent les fichiers.

```bash
npm install
npm run build
npm start        # écoute sur le port 3000 (variable PORT pour changer)
```

Variables d'environnement (modèle dans `.env.example`) :

| Variable | Rôle |
|---|---|
| `ADMIN_PASSWORD` | mot de passe de l'admin (**obligatoire**) |
| `SESSION_SECRET` | longue chaîne au hasard, 16 caractères minimum (**obligatoire**) |
| `SITE_URL` | adresse du site, utilisée dans les messages WhatsApp |
| `DATA_DIR` | dossier des données, sur le disque persistant |
| `TWILIO_*`, `OWNER_PHONE` | facultatif : alerte WhatsApp ou SMS à la coiffeuse à chaque nouvelle demande |

Sans Twilio, les nouvelles demandes apparaissent dans l'admin, avec un compteur sur chaque onglet.

**Sauvegarde** : copier régulièrement le dossier `DATA_DIR` (base `site.db` et dossier `uploads`).

## Choix techniques

- Next.js 15 (App Router), React 19, TypeScript
- Base SQLite intégrée à Node (`node:sqlite`), aucun service externe
- Polices auto-hébergées : Frank Ruhl Libre (titres) et Assistant (texte), qui couvrent l'hébreu et l'alphabet latin
- Les créneaux sont calculés à l'heure de Jérusalem, quel que soit le fuseau du serveur
- Accessibilité : contrastes vérifiés (accent `#7a4e28`), choix par boutons radio natifs (clavier), libellés visibles, erreurs reliées aux champs, `lang` et `dir="rtl"` sur chaque langue
