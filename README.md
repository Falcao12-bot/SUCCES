# EduCI : application éducative (Expo + React Native + TypeScript)

## Lancer
```
npm install
npx expo install --fix     # aligne les versions des paquets sur Expo
npx expo start --tunnel    # puis scanner le QR code avec Expo Go
```
Connexion : toute adresse fonctionne. Une adresse commençant par `admin` ouvre l'espace administrateur.

## Architecture
- `src/screens` : écrans (Auth, Student, Student2, Admin)
- `src/editor` : modèle de blocs (`models`), `BlockRenderer` (rendu partagé éditeur / aperçu / élève), `EditorScreen`
- `src/services/api.ts` : toutes les données (mock en mémoire). Remplacer chaque fonction par un `fetch` vers l'API.
- `src/services/store.ts` : favoris en mémoire
- `src/navigation` : pile + onglets (Accueil, Cours, Exercices, Examens, Profil)

## Premier travail : lancer et corriger
Le code n'a jamais été exécuté (aucun test réel). Commencer par corriger les erreurs de démarrage et de types (`npx tsc --noEmit`).

## Reste à faire
1. **Fidélité visuelle** à la maquette : détail d'un cours (onglets Cours / Exercices, puces CM2 / Chapitre / Leçon), éditeur, blocs pédagogiques, exercices, IA, profil. Remplacer les icônes par les illustrations (dossier `assets/`).
2. **Éditeur** : style sur une sélection de mots (spans multiples), rendu mathématique réel (KaTeX via WebView ou lib dédiée), matrices, indices/exposants, fusion de cellules, figures avec cotes et angles.
3. **Données** : stockage persistant (AsyncStorage) pour favoris, progression, résultats ; vrai backend ; authentification réelle ; inscription et reset de mot de passe réels.
4. **Administration** : modifier et supprimer exercices, examens, utilisateurs ; choisir la matière et le chapitre d'un cours ; création de questions pour les examens (aujourd'hui réutilisent les exercices).
5. **Progression** : calculée à partir des résultats (aujourd'hui valeurs fictives).
6. **Divers** : mode sombre, notifications, état d'erreur réseau, tests.
