# LINFO1212 - Seconde partie du projet d'approfondissement en sciences informatiques

Deuxième partie du projet sur la création d'un site web. A l'aide de HTML, CSS, JavaScript, NodeJS, MongoDB et WebSocket, nous créons un jeu multijoueur sur naviteur et mobile.

Notre application est un jeu multijoueur pour occuper ses soirées en groupe (une fois le confinement terminé). Il propose des parties pour se regrouper, jouer aux jeux créés sur le site et regroupés dans les playlists des utilisateurs.

## 🚗 Routes disponibles

### 👪 Pour tout utilisateur

- [/](https://localhost:8080/) (GET) pour la page d'acceuil
- [/signup](https://localhost:8080/signup) (GET) pour voir la page pour créer un compte
- [/signup](https://localhost:8080/signup) (POST) pour envoyer la demande de compte
- [/signin](https://localhost:8080/signin) (GET) pour voir la page de connexion
- [/signin](https://localhost:8080/signin) (POST) pour envoyer les informations de connexion
- [/games/](https://localhost:8080/games/) (GET) pour une liste des tous les jeux existants
- [/gamedata/:id](https://localhost:8080/games/gamedata/:id) (GET) pour avoir l'apperçu d'un jeu en particulier
- [/party/:code](https://localhost:8080/party/:code) (GET) pour créer ou rejoindre une partie

### 🔓 Pour les utilisateurs identifiés

- [/games/new](https://localhost:8080/games/new) (GET) pour créer un nouveau jeu
- [/games/new](https://localhost:8080/games/new) (POST) pour envoyer la demande de création de jeu
- [/games/findgames](https://localhost:8080/games/findgames) (GET) JSON des jeux avec filtres spécifiés en argument
- [/profile/id](https://localhost:8080/profile/id) (GET) pour afficher la page de profil d'un utilisateur
- [/profile/id/changepseudo](https://localhost:8080/games/profile/id/changepseudo) (PUT) pour changer de pseudo
- [/createplaylist](https://localhost:8080/createplaylist) (GET) pour créer une playlist
- [/createplaylist](https://localhost:8080/createplaylist) (POST) pour la création de playlists
- [/signout](https://localhost:8080/signout) (GET) pour se déconnecter

### 👨‍💻 Réservés au MASTER USER (voir le fichier _.env_ pour les identifiants)

- [/admin/users](https://localhost:8080/admin/users) (GET) pour une liste de tous les utilisateurs au format JSON
- [/admin/users](https://localhost:8080/admin/users) (DELETE) pour supprimer tous les utilisateurs de la base de données
- [/admin/games](https://localhost:8080/admin/games) (GET) pour une liste de tous les jeux au format JSON
- [/admin/games](https://localhost:8080/admin/games) (DELETE) pour supprimer tous les jeux de la base de données
- [/admin/playlists](https://localhost:8080/admin/playlists) (GET) pour une liste de toutes les playlists au format JSON
- [/admin/playlists](https://localhost:8080/admin/playlists) (DELETE) pour supprimer toutes les playlists de la base de données
- [/admin/parties](https://localhost:8080/admin/parties) (GET) pour une liste de toutes les parties au format JSON
- [/admin/parties](https://localhost:8080/admin/parties) (DELETE) pour supprimer toutes les parties de la base de données

---

## 💻 Commandes NPM

- `npm run start` lance le serveur avec nodemon (qui redémarre automatiquement dès qu'un changement est fait au fichiers).
- `npm run-script mongod` pour lancer la base de données dans un terminal (en ouvrir un autre pour exécuter d'autres commandes).
- `npm run-script initdb` nettoye et initialise la base de données avec des examples sous format JSON dans _/utils_.
- `npm run-script keys` génère une paire de clés _cert.key_ et son certificat _csr.key_. Par facilité, les clés sont déjà inclues.
- `npm run-script env` copie le fichier _.env.example_ en un _.env_ qui peut être modifiée avec les paramêtres que l'utilisateur décide.

## ✅ Recommandations

Je recommande de tout faire depuis [Visual Studio Code](https://code.visualstudio.com/) qui est un outil idéal pour le développement web. Le terminal s'ouvre avec le raccourci _CTRL+ù_. VSC intègre un outil _Source Control_ pour gérer git donc plus besoin de taper `git clone`, `git status`, `git add`, `git commit`, `git pull`, `git push`, etc. ! Je recommande également d'installer les extensions suivantes :

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) : mise en page automatique du code sur base du fichier `.editorconfig`.
- [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) : autocomplétion des packages npm.
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) : bouton droit sur un fichier html, "open with live server" pour avoir un site qui se recharge à chaque changement (seulement pour les pages statiques).

---

## 👉 **En bref**

1. Clone le répertoire
2. On se déplace dedans
3. `npm install` qui lance `env`, `initdb` et `start`.
4. rendez-vous sur <https://localhost:8080/>

Les fois d'après il suffit de faire :

1. `npm start`
2. <https://localhost:8080/>

Attention : utiliser `npm run-script initdb` remet la base de données à zéro. Si le but n'est pas de supprimer tous les utilisateurs et reports crées, c'est une commande à éviter !

---

## 👷‍♀️ Installation

Pour clone le répertoire la première fois soit :

`git clone https://github.com/Simcornelis/ProjetFinal-P2-NodeJS.git`

Ou bien dans VSC, dans le 3e onglet à gauche "Source Control" (_CTRL+SHIFT+G_), on peut "Clone Repository" en étant identifié avec [GitHub](https://github.com/). Et ensuite, soit en recherchant le répertoire, soit en collant l'[url](https://github.com/Simcornelis/FYT-NodeJS-server.git).

Il faut avoir installé [NodeJS](https://nodejs.org/) pour la suite ! Pour s'assurer qu'il est bien installé on peut taper `node -v` dans le terminal et ça devrait afficher la version de NodeJS.

Le projet installe les packages NPM nécessaires avec la commande `npm install` lorsqu'on est dans le dossier du projet. Cela devrait installer : _dotenv_, _express_, _express-session_,_hogan_, _https_, _mongodb_, _multer_, _sharp_ et _socket.io_. Ainsi que _nodemon_ utile lors du développement pour redémarrer le serveur dès qu'on fait un changement et _prettier_ ainsi que son extension pour fichiers `.XML` pour formater le code automatiquement.

## 🚀 Lancement

Afin de lancer le serveur NodeJS, nous utilisons le package _nodemon_ qui permet de relancer le serveur dès qu'il y a un changement dans le code. Un script a été ajouté pour pouvoir faire `npm start` et que le serveur se lance (il exécute la commande `nodemon start.js` ou bien `npx nodemon start.js` si nodemon n'est pas installé en _-g_).

Maintenant que le serveur tourne, tous les `console.log()` du JavaScript serveur seront envoyés dans ce terminal. Il n'est pas possible de taper des commandes alors que le serveur tourne. Cela doit se faire dans un autre terminal.

## 🛑 Arrêt

Soit _CTRL+C_ deux fois, soit _CTRL+C_ suivi de _Y_ (yes en Anglais) et _ENTER_.

## 🔧 Publier des changements

Avec _source control_ (3e onglet sur la gauche dans VSC, ou avec _CTRL+SHIFT+G_) on appuie sur les + pour ajouter des fichiers au commit. Ensuite on donne un message dans le cadre au dessus des fichiers et on commit avec _CTRL+ENTER_. Maintenant il ne reste plus qu'à push les commits avec le menu (•••) puis "push". C'est là que se situent les autres options intéressantes comme "pull" si jamais des changements ont étés faits depuis le dernier pull.

## 😎 Guide de style

Pour une lisibilité optimale du code, ainsi qu'une cohérence entre les versions de codes, on utilise un guide de style. On a choisi le guide de [Felix Geisendörfer](https://github.com/felixge) qui est le [Node style guide](https://github.com/felixge/node-style-guide). Il y propose un fichier `.editorconfig` qui fonctionne par défaut avec _Prettier_. Nous avons cependant décidé de l'ajuster à nos propres préférences qui suivent.

- Commentaires et code en anglais.
- Toujours utiliser les doubles guillemets.
- Les objets (et classes) qui ne doivent pas être remplacées par d'autres types de variables doivent être des constantes.
- Utiliser `const` autant que possible. Seules les constantes globales sont en majuscules.
- Ajouter un espace entre des accolades d'un objet.

```js
const playlist = { game: "I like that cut g.", info: "Slap." };
```

- Utiliser la fonction lambda lorsqu'on veut utiliser une fonction anonyme.
- Absolument tout le temps utiliser la triple égalité, sinon, l'expliquer à l'aide d'un commentaire.
- If/else en une ligne si possible, sinon, ajouter des accolades lorsqu'il n'y a pas de else.

```js
partyRouter.get("/game", (req, res, next) => {
  if ("Steak" === 🥩) console.log("Hmmm");
});
```

- L'opérateur ternaire doit être simple à lire, il peut être écrit sur une ligne si il est court. Sinon, le remplacer par un if.
- Éviter les commentaires de description du fonctionnement du code.
- Ajouter des commentaires là où une option d'implémentation à été choisie en faveur d'une autre pour une raison particulière.
- Extraire un maximum de fonctions compliquées en de plus petites, plus rapides à comprendre.
- En bonus, ajouter des emojis aux commits 🤗.
