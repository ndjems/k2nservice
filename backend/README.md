# Backend FastAPI pour Dashboard

## Lancer le backend

1. Installe les dépendances (idéalement dans un venv) :
   ```bash
   pip install -r requirements.txt
   ```
2. Lance le serveur :
   ```bash
   uvicorn main:app --reload
   ```

- Accès API docs : http://localhost:8000/docs

## Endpoints principaux
- `GET /acquisitions` / `POST /acquisitions`
- `GET /sorties` / `POST /sorties`
- `GET /ventes` / `POST /ventes`
- `GET /fonds` / `POST /fonds`
- `GET /stats/dashboard` (statistiques pour le dashboard)

**Stockage en mémoire** : les données sont perdues à chaque redémarrage (pour MVP/test rapide).
