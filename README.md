# Flora Wigs — perruques et coiffure, rue Jaffa, Jérusalem

Site statique en hébreu (langue principale), français et anglais, pensé d'abord pour le téléphone, publié sur GitHub Pages.

- **Perruques** : catalogue avec filtres (longueur, texture, couleur) et fiche par perruque.
- **Rendez-vous** : la cliente choisit une prestation, un jour et une heure, puis la demande s'ouvre dans WhatsApp, prête à envoyer à Flora Wigs.
- **Réserver une perruque** et **carte cadeau** : même principe, par WhatsApp.

Aucun paiement en ligne, aucun serveur. Comme le site ne connaît pas les rendez-vous déjà pris, c'est la coiffeuse qui répond sur WhatsApp si une heure n'est plus libre.

> La version avec espace admin, enregistrement des demandes et blocage des créneaux pris est sur la branche `version-avec-admin`. Elle demande un hébergeur avec serveur (Railway, Render, VPS).

## Modifier le site

Chaque modification envoyée sur `main` republie le site automatiquement en 1 à 2 minutes (onglet **Actions** du dépôt).

| Quoi | Où |
|---|---|
| Ajouter, modifier, retirer une perruque | `src/data/wigs.ts` (mode d'emploi en haut du fichier) |
| Photo d'une perruque | `public/wigs/` puis le nom du fichier dans `src/data/wigs.ts` |
| Grande photo du haut de page | `public/photos/hero.jpg` (verticale) |
| Photo « À propos » | `public/photos/portrait.jpg` (facultative) |
| Prix et durée des prestations | `src/lib/config.ts` |
| Horaires et jours fermés | `src/lib/config.ts` |
| Numéro WhatsApp, adresse, Instagram | `src/lib/config.ts` |
| Tous les textes (3 langues) et les messages WhatsApp | `src/lib/i18n.ts` |

Tout peut se modifier directement sur github.com (bouton crayon sur un fichier), même depuis un téléphone.

## Sur son ordinateur

```bash
npm install
npm run dev      # http://localhost:3000/site-perruques/
npm run build    # génère le site dans out/
```

## Nom de domaine

Une fois le domaine acheté (par exemple `florawigs.co.il`) :

1. Dans le dépôt : Settings → Pages → Custom domain, écrire le domaine.
2. Chez le registraire : un enregistrement `CNAME` de `www` vers `dak302.github.io`, et les enregistrements `A` du domaine nu vers les adresses GitHub Pages (185.199.108.153, .109.153, .110.153, .111.153).
3. Dans `.github/workflows/pages.yml`, ajouter `BASE_PATH: ""` comme variable d'environnement de l'étape `npm run build`, puisque le site ne sera plus sous `/site-perruques`.
