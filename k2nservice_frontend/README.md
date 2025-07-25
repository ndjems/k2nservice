Bien sûr ! Voici une version améliorée de ton README.md, en commençant par la partie **clonage du dépôt**, puis toutes les étapes clairement expliquées pour démarrer le frontend et backend.

---

````md
# 🧩 K2NService Platform

Plateforme complète de gestion développée avec :

- 🖥️ **Frontend** : React + TypeScript + Tailwind CSS + shadcn/ui  
- ⚙️ **Backend** : FastAPI + SQLite  
- 🧪 API REST avec Swagger UI pour tester facilement les endpoints  
- 🌐 Déploiement via Lovable (frontend) et hébergement libre pour le backend  

---

## 🚀 Cloner le projet

```bash
# Cloner le dépôt Git
git clone https://github.com/ton-utilisateur/k2nservice.git

# Se positionner dans le dossier du projet
cd k2nservice
````

---

## 🌐 Aperçu de la stack

### 🖥️ Frontend

* [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.dev/)
* [Lucide Icons](https://lucide.dev/)

### ⚙️ Backend

* [FastAPI](https://fastapi.tiangolo.com/)
* [Uvicorn](https://www.uvicorn.org/)
* [SQLAlchemy](https://www.sqlalchemy.org/) + [SQLite](https://www.sqlite.org/index.html)
* [dotenv](https://pypi.org/project/python-dotenv/)

---

## ▶️ Démarrer le projet en local

### 📦 1. Démarrer le **Frontend React**

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement Vite
npm run dev
```

✅ Frontend disponible sur : [http://localhost:8080](http://localhost:8080)

---

### 🔁 2. Démarrer le **Backend FastAPI**

```bash
# Aller dans le dossier backend
cd backend

# (Optionnel) Créer un environnement virtuel Python
python -m venv venv

# Activer l'environnement virtuel
# Windows :
venv\Scripts\activate
# macOS / Linux :
source venv/bin/activate

# Installer les dépendances Python
pip install -r requirements.txt

# Lancer le serveur FastAPI sur le port 9000
uvicorn main:app --reload --port 9000
```

✅ API REST disponible sur :

* Swagger UI : [http://localhost:9000/docs](http://localhost:9000/docs)
* Redoc : [http://localhost:9000/redoc](http://localhost:9000/redoc)

---

## 🛢️ Configuration de la base de données

**Base utilisée : SQLite**

### Exemple de fichier `.env` à placer dans `backend/.env` :

```
DATABASE_URL=sqlite:///./app.db
```

Le backend chargera automatiquement cette configuration grâce à `dotenv`.

---

## 🚀 Déploiement

### 🌐 Frontend React

Déployé via [Lovable](https://lovable.dev/projects/07d307cb-d9ef-4cb4-87de-daaf0cc3efc9)

🔗 Lien : [https://lovable.dev/projects/07d307cb-d9ef-4cb4-87de-daaf0cc3efc9](https://lovable.dev/projects/07d307cb-d9ef-4cb4-87de-daaf0cc3efc9)

Pour publier :

```
Menu Share → Publish
```

### ⚙️ Backend FastAPI

Peut être déployé sur :

* Render (gratuit et facile)
* Railway (supporte SQLite)
* VPS personnel

---

## 🌍 Connecter un domaine personnalisé

Depuis Lovable :

```
Menu Project > Settings > Domains > Connect Domain
```

📖 [Guide officiel Lovable pour domaine personnalisé](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## ✅ Checklist rapide

* [x] Cloner le repo et se positionner dans le dossier
* [x] Installer les dépendances frontend (`npm install`)
* [x] Lancer le frontend (`npm run dev`)
* [x] Configurer `.env` dans `backend/` avec la bonne base SQLite
* [x] Installer les dépendances backend (`pip install -r requirements.txt`)
* [x] Lancer le backend (`uvicorn main:app --reload --port 9000`)
* [x] Frontend configuré pour consommer l’API backend sur `http://localhost:9000`

---

## 🧪 Exemple de test API

Tester via Swagger ou directement :

```http
GET http://localhost:9000/api/fonds
POST http://localhost:9000/api/sorties
```

---

## 🛠️ Technologies utilisées

| Frontend     | Backend           | Base de données         |
| ------------ | ----------------- | ----------------------- |
| React + Vite | FastAPI + Uvicorn | SQLite (via SQLAlchemy) |
| Tailwind CSS | Pydantic          | `.env` pour la config   |
| shadcn/ui    | dotenv            |                         |

---

## 📬 Besoin d’aide ?

Contactez l’équipe ou ouvrez un ticket GitHub.
Bon développement ! 🚀

```

---

