#  GOTY History Interactive Timeline

Une expérience web interactive et animée retraçant l'histoire des jeux ayant remporté le titre prestigieux de "Game of the Year" (GOTY) de 2003 à nos jours.

##  Fonctionnalités

- **Frise chronologique animée :** Une ligne du temps dynamique qui se construit automatiquement au fil du défilement de la page (Scroll), propulsée par GSAP.
- **Affichage alterné :** Les entrées de chaque jeu apparaissent de manière alternée sur la ligne du temps pour un design élégant.
- **Interactivité détaillée :** Un clic sur un jeu déclenche une animation fluide pour révéler des informations historiques détaillées :
  - L'image de couverture du jeu.
  - Une description complète du titre.
  - La liste des autres grand jeux qui étaient nommés pour la même année.
- **Chargement dynamique :** L'ensemble des données (titres, années, descriptions, images, nominés) est chargé via un fichier externe `goty.json`, ce qui permet de mettre à jour la liste sans toucher au code principal.

## 🛠️ Technologies Utilisées

- **HTML5** : Structure de la page.
- **SCSS / CSS3** : Design moderne, mise en page et animations CSS.
- **JavaScript (Vanilla)** : Logique interactive, chargement dynamique des données JSON (via `fetch`) et génération des éléments de la timeline.
- **GSAP (GreenSock Animation Platform)** : Animations avancées et fluides notamment basées sur le défilement (ScrollTrigger).

##  Structure du projet

```text
📁 goty_site/
├── 📄 index.html      # Point d'entrée principal de l'application
├── 📄 style.scss      # Fichier source des styles (à compiler)
├── 📄 style.css       # Feuille de style compilée
├── 📄 goty.js         # Script gérant l'affichage de l'historique et les interactions liées aux jeux
├── 📄 script.js       # Script principal (initialisation, GSAP, timeline, etc.)
├── 📄 goty.json       # Base de données au format JSON contenant l'histoire de tous les GOTY
└── 📁 img/            # Répertoire contenant les jaquettes et images de chaque jeu
```

## 🚀 Installation et Lancement

1. **Cloner ou télécharger** le dossier sur votre machine.
2. **Compiler le SCSS (si vous souhaitez modifier les couleurs ou le design) :**
   ```bash
   sass --watch style.scss style.css
   ```
3. **Lancer un serveur local :**
   Vous pouvez utiliser l'un des outils suivants selon ce que vous avez d'installé :
   - L'extension VS Code **Live Server** (recommandé pour la simplicité)
   - Avec **Python** : `python -m http.server 8000`
   - Avec **Node.js** : `npx serve .` ou `npx http-server`

